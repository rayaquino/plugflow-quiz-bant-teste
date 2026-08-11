import {
  ANNUAL_REVENUE_RANGES,
  AUTHORITY_OPTIONS,
  PAIN_OPTIONS,
  SITE,
  TIMING_OPTIONS,
  scoreBant,
  type Answers,
} from './config'
import { collectUtms, getLeadId, toE164 } from './utils'

export type SubmitStage = 'parcial' | 'completo'

type Labeled = readonly { value: string; label: string }[]
const labelOf = (list: Labeled, value: string) =>
  list.find((o) => o.value === value)?.label ?? ''

/**
 * Modo teste. Liga de duas formas:
 *
 *  1. `?teste=1` na URL, pra conferir a tela de proposito;
 *  2. sozinho, quando a pagina esta dentro de um iframe.
 *
 * O item 2 nasceu de um incidente real: o preview do editor do Lovable roda
 * num iframe e NAO carrega a querystring, entao quem abria ali pra "so olhar a
 * animacao" disparava lead de verdade a cada preenchimento, e o WhatsApp
 * recebia template atras de template. Preview e lugar de olhar, nao de gerar
 * lead, entao o padrao seguro passa a ser: dentro de iframe, nao envia.
 *
 * A pagina publicada roda em aba propria, fora de iframe, e continua enviando
 * normalmente. Se um dia o quiz for embutido em iframe de proposito, essa regra
 * precisa mudar junto.
 *
 * Quando ligado, nada sai da maquina, o Pixel nao carrega e a tela avisa.
 */
export function modoTeste() {
  if (typeof window === 'undefined') return false
  const v = new URLSearchParams(window.location.search).get('teste')
  if (v === '1' || v === 'true') return true
  try {
    return window.self !== window.top
  } catch {
    // Acesso negado ao window.top e sinal de iframe de outra origem.
    return true
  }
}

/**
 * Manda pro n8n (/webhook/plugflow-quiz-bant).
 *
 * Dispara duas vezes de proposito:
 *  - 'parcial' assim que nome + whatsapp existem, pra nao perder o lead que
 *    abandona no meio do quiz;
 *  - 'completo' no fim, com BANT fechado, que e o que dispara o HSM e o CRM.
 *
 * Contrato combinado com o backend: campos chatos e planos, cada resposta com
 * `value` (chave estavel) e `Label` (texto que o lead viu). O WhatsApp sai daqui
 * ja normalizado em E.164, o n8n confia nesse formato.
 *
 * `scoreClient` vai junto so como conferencia. Quem roteia e o score recalculado
 * no n8n, porque qualquer um abre o devtools e posta o total que quiser.
 *
 * Falha de rede nunca pode travar a tela: o erro so e logado e o quiz segue.
 */
export async function sendLead(answers: Answers, stage: SubmitStage) {
  const score = scoreBant(answers)

  // A trava vem ANTES de montar qualquer requisicao: em modo teste nada sai.
  // Devolve whatsappEnviado true de proposito, pra quem esta validando ver a
  // tela final completa em vez do caminho pessimista.
  if (modoTeste()) {
    console.info('[quiz-bant] modo teste, nada enviado', { stage, score })
    return { ok: true, status: 0, whatsappEnviado: true }
  }

  const payload = {
    source: 'plugflow-quiz-bant-sdr',
    stage,
    leadId: getLeadId(),
    submittedAt: new Date().toISOString(),

    nome: answers.nome.trim(),
    whatsapp: toE164(answers.whatsapp),
    whatsappFormatado: answers.whatsapp,

    faturamento: answers.faturamento,
    faturamentoLabel: labelOf(ANNUAL_REVENUE_RANGES, answers.faturamento),
    dor: answers.dor,
    dorLabel: labelOf(PAIN_OPTIONS, answers.dor),
    authority: answers.authority,
    authorityLabel: labelOf(AUTHORITY_OPTIONS, answers.authority),
    timing: answers.timing,
    timingLabel: labelOf(TIMING_OPTIONS, answers.timing),

    scoreClient: { total: score.total, tier: score.tier },
    canalWhatsapp: SITE.whatsappChannel,
    utm: collectUtms(),
    pagina: typeof window !== 'undefined' ? window.location.href : '',
  }

  try {
    const res = await fetch(SITE.webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })

    // O backend responde se o WhatsApp saiu de verdade. Ele so dispara pra
    // quem esta dentro do ICP e nao entrou como frio, entao a tela NAO pode
    // prometer mensagem pra todo mundo: parte dos leads nunca receberia nada
    // e ficaria esperando.
    let whatsappEnviado = false
    try {
      const corpo = (await res.clone().json()) as { whatsappEnviado?: boolean }
      whatsappEnviado = corpo?.whatsappEnviado === true
    } catch {
      // Resposta sem JSON (proxy, erro cru). Trata como "nao prometi nada".
    }

    return { ok: res.ok, status: res.status, whatsappEnviado }
  } catch (err) {
    console.error('[quiz-bant] falha ao enviar lead', err)
    return { ok: false, status: 0, whatsappEnviado: false }
  }
}
