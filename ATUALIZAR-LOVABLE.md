# Atualização: campo empresa, Pixel do Meta, trava de iframe e trava de reenvio

Substitua os arquivos abaixo pelo conteúdo literal, mantendo os caminhos. Não reescreva, não renomeie e não altere nenhum outro arquivo do projeto.

### `src/lib/config.ts`

```ts
// Configuracao unica do quiz. Mexer aqui muda copy, opcoes e pontuacao.
// Regra de copy do projeto: nada de travessao, acentuacao sempre correta.

/**
 * O enquadramento da abertura e "destrave a SUA demo", nao "responda um
 * diagnostico". A diferenca importa: diagnostico e passivo e analitico, demo e
 * posse. O lead termina o quiz pra pegar uma coisa que ja e dele.
 */
export const SITE = {
  brand: 'PlugFlow',
  produto: 'Orquestrador da Jornada do Cliente',
  headline: 'Destrave a sua demo do Orquestrador da Jornada do Cliente',
  // Curto de proposito: a versao longa enumerava as etapas e ocupava 4 linhas
  // logo na primeira dobra, que e o que deixava a tela pesada. As etapas o lead
  // ve acontecendo na animacao, nao precisa ler antes.
  sub: 'Responda 4 perguntas e veja o seu lead sendo atendido, qualificado e agendado sozinho.',
  webhook:
    import.meta.env.VITE_WEBHOOK_URL ||
    'https://n8n.renanshots.com/webhook/plugflow-quiz-bant',
  whatsappChannel: 'da26f540-22d1-4add-8f15-d96755ceaa61',
  whatsappNumber: '(11) 93242-5662',
} as const

/**
 * Canais e recursos que a PlugFlow REALMENTE tem, conferidos nas telas do
 * produto rodando. Nada aqui pode ser suposto: a tela nomeia integracao, e
 * integracao que nao existe vira promessa quebrada na reuniao de vendas.
 *
 * NAO EXISTE e nao pode aparecer: e-mail e agenda/calendario nativos.
 * O nome real do recurso de IA e "Agente Inteligente", nao "Agente de IA".
 */
export const CANAIS_ENTRADA = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'site', label: 'Site' },
] as const

/** Saidas do orquestrador, todas telas reais do produto. */
export const DESTINOS = [
  { label: 'Painel do CRM', nota: 'card criado' },
  { label: 'Agente Inteligente', nota: 'qualificou o lead' },
  { label: 'Sequência', nota: 'nutrição ligada' },
  { label: 'Mensagem agendada', nota: 'retorno programado' },
  { label: 'Indicadores', nota: 'origem registrada' },
] as const

/**
 * Faixa de faturamento anual. O ICP da PlugFlow comeca em R$ 3 mi/ano, entao a
 * resolucao das faixas vive ACIMA desse corte, que e onde a decisao acontece.
 * Abaixo dele bastam duas faixas: separar o micro de quem esta quase no perfil
 * e pode virar lead bom em pouco tempo.
 *
 * `icp` e explicito de proposito. Ja tinhamos errado inferindo perfil a partir
 * do score, o que quebrava sozinho quando a pontuacao mudava.
 */
export const ANNUAL_REVENUE_RANGES = [
  { value: 'ate-500k', label: 'Até R$ 500 mil', score: 0, icp: false },
  { value: '500k-3mi', label: 'R$ 500 mil a R$ 3 milhões', score: 1, icp: false },
  { value: '3-10mi', label: 'R$ 3 a R$ 10 milhões', score: 3, icp: true },
  { value: '10-30mi', label: 'R$ 10 a R$ 30 milhões', score: 4, icp: true },
  { value: '30-100mi', label: 'R$ 30 a R$ 100 milhões', score: 5, icp: true },
  { value: 'acima-100mi', label: 'Acima de R$ 100 milhões', score: 5, icp: true },
] as const

// Need: a dor. Cada opcao vira o gancho da cena 3.
export const PAIN_OPTIONS = [
  {
    value: 'demora',
    label: 'Demora pra responder',
    hint: 'O lead chega e fica horas esperando',
    score: 5,
  },
  {
    value: 'fora-horario',
    label: 'Fora do horário comercial ninguém responde',
    hint: 'Noite, fim de semana e feriado ficam no vácuo',
    score: 5,
  },
  {
    value: 'follow-up',
    label: 'Falta follow up',
    hint: 'Quem não responde na hora some pra sempre',
    score: 4,
  },
  {
    value: 'volume',
    label: 'Volume alto demais pro time',
    hint: 'Chega mais lead do que o time dá conta',
    score: 4,
  },
  {
    value: 'qualificacao',
    label: 'Time perde tempo com curioso',
    hint: 'Vendedor bom atendendo quem nunca vai comprar',
    score: 3,
  },
  {
    value: 'sem-controle',
    label: 'Não sei o que acontece nas conversas',
    hint: 'Cada um responde de um jeito e nada fica registrado',
    score: 3,
  },
] as const

// Authority: quem decide sobre automacao de atendimento.
export const AUTHORITY_OPTIONS = [
  { value: 'eu-decido', label: 'Sou eu quem decide', score: 5 },
  { value: 'decido-com-socio', label: 'Decido junto com sócio ou diretoria', score: 4 },
  { value: 'indico', label: 'Eu indico, outra pessoa aprova', score: 2 },
  { value: 'outra-area', label: 'É de outra área', score: 1 },
] as const

// Timing: fecha o BANT na ultima tela.
export const TIMING_OPTIONS = [
  { value: 'agora', label: 'Pra ontem, é o gargalo do momento', score: 5 },
  { value: '30-dias', label: 'Nos próximos 30 dias', score: 4 },
  { value: '90-dias', label: 'Nos próximos 3 meses', score: 2 },
  { value: 'pesquisando', label: 'Só pesquisando por enquanto', score: 0 },
] as const

export type Answers = {
  nome: string
  empresa: string
  whatsapp: string
  faturamento: string
  dor: string
  authority: string
  timing: string
}

export const EMPTY_ANSWERS: Answers = {
  nome: '',
  empresa: '',
  whatsapp: '',
  faturamento: '',
  dor: '',
  authority: '',
  timing: '',
}

type Scored = readonly { value: string; score: number }[]
const scoreOf = (list: Scored, value: string) =>
  list.find((o) => o.value === value)?.score ?? 0

/**
 * Score BANT de 0 a 20, com as 4 letras valendo 5 cada:
 * Budget (faturamento), Authority, Need (dor) e Timing.
 *
 * Cortes: >=15 quente (vai pro agendamento), >=10 morno (nutricao),
 * abaixo disso frio. Esta tabela e o espelho do que o n8n recalcula,
 * entao mudanca aqui exige mudanca la.
 */
export function scoreBant(a: Answers) {
  const budget = scoreOf(ANNUAL_REVENUE_RANGES, a.faturamento)
  const authority = scoreOf(AUTHORITY_OPTIONS, a.authority)
  const need = scoreOf(PAIN_OPTIONS, a.dor)
  const timing = scoreOf(TIMING_OPTIONS, a.timing)
  const total = budget + authority + need + timing

  const tier = total >= 15 ? 'quente' : total >= 10 ? 'morno' : 'frio'
  return { budget, authority, need, timing, total, tier } as const
}

export type BantScore = ReturnType<typeof scoreBant>

```

### `src/lib/submit.ts`

```ts
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
    empresa: answers.empresa.trim(),
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

```

### `src/lib/pixel.ts`

```ts
import { modoTeste } from './submit'

/**
 * Pixel do Meta da PlugFlow (conta plugflowoficial).
 *
 * Injetado por codigo, nao pelo index.html, porque o projeto no Lovable roda
 * em TanStack Start e o shell de HTML nao e necessariamente o `index.html`
 * daqui. Injetando em runtime funciona nos dois lugares.
 *
 * Em modo teste nada e carregado nem disparado: evento de teste sujaria o sinal
 * da campanha, que e o que o Meta usa pra otimizar entrega.
 */
const PIXEL_ID = '2122212278583984'

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void
  queue?: unknown[]
  push?: unknown
  loaded?: boolean
  version?: string
}

declare global {
  interface Window {
    fbq?: Fbq
    _fbq?: Fbq
  }
}

export function iniciarPixel() {
  if (typeof window === 'undefined' || modoTeste()) return
  if (window.fbq) return

  // Snippet oficial do Meta, escrito de forma legivel. A fila (`queue`) existe
  // pra nao perder evento disparado antes do script terminar de carregar.
  const fbq: Fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args)
    else fbq.queue?.push(args)
  }
  fbq.queue = []
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.push = fbq
  window.fbq = fbq
  window._fbq = fbq

  const s = document.createElement('script')
  s.async = true
  s.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(s)

  window.fbq('init', PIXEL_ID)
  window.fbq('track', 'PageView')
}

/**
 * Só no envio 'completo' que deu certo. Disparar em toda tentativa infla o
 * sinal e ensina o Meta a otimizar pra quem nao virou lead de verdade.
 */
export function marcarLead() {
  if (typeof window === 'undefined' || modoTeste()) return
  window.fbq?.('track', 'Lead')
}

```

### `src/components/scenes/Scene2Qualifica.tsx`

```tsx
import { motion } from 'framer-motion'
import { PhoneHeader, Thread, type Msg } from '@/components/chat'
import { ANNUAL_REVENUE_RANGES } from '@/lib/config'

/**
 * Cena 2: o agente qualifica o porte sozinho, antes de gastar o tempo de
 * qualquer vendedor. E o momento em que o lead entende que a IA nao e um
 * robo de FAQ.
 */
export default function Scene2Qualifica({
  active,
  faturamento,
  empresa,
}: {
  active: boolean
  faturamento: string
  empresa: string
}) {
  const faixa = ANNUAL_REVENUE_RANGES.find((r) => r.value === faturamento)
  const label = faixa?.label ?? ''
  const dentroDoPerfil = faixa?.icp ?? false

  const msgs: Msg[] = [
    {
      from: 'ia',
      // Usa o nome da empresa quando existe: mostra o agente trabalhando com o
      // dado que a pessoa acabou de dar, em vez de falar generico.
      // Sem artigo antes do nome: "a"/"o" antes de nome de empresa qualquer e
      // aposta de genero e sai errado em metade dos casos.
      text: empresa.trim()
        ? `Antes de te passar preço, deixa eu entender o tamanho da operação. ${empresa.trim()} fatura mais ou menos quanto por ano?`
        : 'Antes de te passar preço, deixa eu entender o tamanho da operação. Sua empresa fatura mais ou menos quanto por ano?',
      typing: 800,
    },
    { from: 'lead', text: label, typing: 700, after: 300 },
    {
      from: 'ia',
      text: dentroDoPerfil
        ? 'Perfeito, esse é exatamente o porte que a gente atende. Já vou separar o cenário certo pra você.'
        : 'Entendi. Nesse porte eu já consigo te mostrar um caminho mais enxuto, sem te empurrar coisa grande demais.',
      typing: 900,
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <PhoneHeader
        title="Agente Inteligente - PlugFlow"
        subtitle="qualificando o lead"
      />
      <Thread msgs={msgs} active={active} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2 }}
        className="border-t border-white/10 bg-white/5 px-3 py-2"
      >
        <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wide">
          <span className="text-white/60">Qualificação automática</span>
          <span className="text-grad">porte identificado</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
          <motion.div
            className="h-full rounded-full bg-brand-grad"
            initial={{ width: '0%' }}
            animate={{ width: dentroDoPerfil ? '82%' : '48%' }}
            transition={{ delay: 3.4, duration: 1.1, ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    </div>
  )
}

```

### `src/components/Stage.tsx`

```tsx
import { AnimatePresence, motion } from 'framer-motion'
import Scene1Entrada from './scenes/Scene1Entrada'
import Scene2Qualifica from './scenes/Scene2Qualifica'
import Scene3Nutre from './scenes/Scene3Nutre'
import Scene4Case from './scenes/Scene4Case'
import Scene5Fecha from './scenes/Scene5Fecha'
import Scene6Distribuicao from './scenes/Scene6Distribuicao'
import Scene7Crm from './scenes/Scene7Crm'
import type { Answers } from '@/lib/config'

/**
 * Palco fixo no topo. Troca de cena conforme o lead destrava passos do form.
 * `scene` 0 e o estado de espera, 1 a 5 sao as cenas.
 */
export default function Stage({
  scene,
  answers,
  enviando,
  whatsappEnviado,
}: {
  scene: number
  answers: Answers
  enviando: boolean
  whatsappEnviado: boolean
}) {
  return (
    <div className="relative h-full overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-roxo-900/70 to-fundo shadow-2xl">
      {/* brilho de fundo da marca */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-magenta/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-roxo-600/35 blur-3xl" />

      {/* Marca d'agua so na tela de espera, que e onde sobra vazio. Nas cenas
          com conteudo ela encostava no texto do rodape e virava ruido, entao
          nao vale a pena ganhar marca e perder leitura. */}
      {scene === 0 && (
        <img
          src="/plugflow-logo.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2.5 right-3 w-[34%] opacity-[0.09]"
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          /* pb-5 reserva a faixa dos indicadores, senao eles sobrepoem o
             rodape das cenas 1, 3 e 4 */
          className="relative h-full pb-5"
        >
          {scene === 0 && <SceneIdle />}
          {scene === 1 && <Scene1Entrada active nome={answers.nome} />}
          {scene === 2 && (
            <Scene2Qualifica
              active
              faturamento={answers.faturamento}
              empresa={answers.empresa}
            />
          )}
          {scene === 3 && <Scene3Nutre active dor={answers.dor} />}
          {scene === 4 && <Scene4Case active />}
          {scene === 5 && (
            <Scene5Fecha
              active
              nome={answers.nome}
              enviando={enviando}
              whatsappEnviado={whatsappEnviado}
            />
          )}
          {scene === 6 && <Scene6Distribuicao active />}
          {scene === 7 && <Scene7Crm active nome={answers.nome} />}
        </motion.div>
      </AnimatePresence>

      {/* Os pontinhos param nas 5 cenas do quiz. As cenas 6 e 7 sao o desfecho
          que roda sozinho depois do envio, nao sao passos a preencher. */}
      <StepDots current={Math.min(scene, 5)} total={5} />
    </div>
  )
}

function SceneIdle() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      {/* Saiu o circulo "IA" (a marca certa e a PlugFlow, nao um selo generico)
          e saiu a seta, que repetia o que os pontinhos ja dizem. Sobraram tres
          elementos em vez de cinco. */}
      <motion.div
        className="mb-3 h-2 w-2 rounded-full bg-brand-grad"
        animate={{ scale: [1, 1.9, 1], opacity: [1, 0.4, 1] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />
      <p className="font-display text-[16px] font-black leading-tight">
        A sua demo <span className="text-grad">começa aqui</span>
      </p>
      <p className="mt-1.5 text-[12px] leading-snug text-white/60">
        Preencha o primeiro campo e veja a jornada do seu cliente rodando
      </p>
    </div>
  )
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.span
          key={i}
          className="h-1 rounded-full"
          animate={{
            width: i + 1 === current ? 18 : 6,
            backgroundColor:
              i + 1 <= current ? 'rgb(241 142 153)' : 'rgba(255,255,255,0.22)',
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  )
}

```

### `src/App.tsx`

```tsx
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Feixes from './components/Feixes'
import Logo from './components/Logo'
import Stage from './components/Stage'
import { ChoiceGrid, Label, PrimaryButton, TextField } from './components/fields/Fields'
import {
  ANNUAL_REVENUE_RANGES,
  AUTHORITY_OPTIONS,
  EMPTY_ANSWERS,
  PAIN_OPTIONS,
  SITE,
  TIMING_OPTIONS,
  type Answers,
} from './lib/config'
import { iniciarPixel, marcarLead } from './lib/pixel'
import { modoTeste, sendLead } from './lib/submit'
import { isValidName, isValidPhone, maskPhone } from './lib/utils'

/**
 * Mecanica estilo Typeform: uma pergunta por vez, sempre no mesmo lugar da tela.
 * A pergunta atual sai e a proxima entra no lugar dela, sem a pagina rolar.
 * O palco da animacao fica fixo em cima e nunca sai de vista.
 *
 * O mapeamento campo -> cena continua o mesmo de antes: cada resposta destrava
 * a cena seguinte.
 */
export default function App() {
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS)
  const [step, setStep] = useState(0) // 0 = identificacao, 1..4 = BANT
  const [tentouStep0, setTentouStep0] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [concluido, setConcluido] = useState(false)
  // Vem da resposta do n8n. So e true quando o HSM realmente saiu, entao a tela
  // nunca promete WhatsApp pra quem o backend decidiu nao disparar.
  const [vaiReceberWhats, setVaiReceberWhats] = useState(false)
  // Depois do envio o desfecho roda sozinho, em dois tempos:
  // 6 = o motor disparando pra todos os destinos, 7 = o lead andando no CRM.
  const [desfecho, setDesfecho] = useState(0)
  // Envio que falhou NAO pode virar tela de "recebemos": a pessoa ficaria
  // esperando um contato que ninguem sabe que precisa fazer.
  const [erroEnvio, setErroEnvio] = useState(false)
  const parcialEnviado = useRef(false)
  // Trava de reentrancia. O botao ja fica desabilitado durante o envio, mas
  // isso e o ultimo anteparo contra dois disparos do 'completo' saindo juntos,
  // que e o que gera task duplicada e template repetido no WhatsApp.
  const enviandoRef = useRef(false)

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) =>
    setAnswers((a) => ({ ...a, [k]: v }))

  const scene = desfecho > 0 ? desfecho : concluido || enviando ? 5 : step

  const nomeOk = isValidName(answers.nome)
  const empresaOk = answers.empresa.trim().length >= 2
  const foneOk = isValidPhone(answers.whatsapp)

  const avancarStep0 = useCallback(() => {
    setTentouStep0(true)
    if (!nomeOk || !empresaOk || !foneOk) return
    setStep(1)
    // Lead parcial: garante que quem abandonar no meio ainda chega no CRM.
    if (!parcialEnviado.current) {
      parcialEnviado.current = true
      void sendLead(answers, 'parcial')
    }
  }, [answers, nomeOk, empresaOk, foneOk])

  // Cada escolha destrava a proxima cena sozinha, sem botao no meio do caminho.
  const escolher = (campo: keyof Answers, valor: string, proximo: number) => {
    set(campo, valor)
    window.setTimeout(() => setStep(proximo), 260)
  }

  const finalizar = async (timing: string) => {
    // Segundo disparo enquanto o primeiro esta no ar: ignora.
    if (enviandoRef.current || (concluido && !erroEnvio)) return
    enviandoRef.current = true

    set('timing', timing)
    setErroEnvio(false)
    setEnviando(true)
    const r = await sendLead({ ...answers, timing }, 'completo')
    setEnviando(false)
    enviandoRef.current = false

    if (!r.ok) {
      // Botao continua clicavel de proposito. Retentar nao duplica lead: o
      // leadId e estavel na sessao e o backend casa por ele e pelo E.164.
      setErroEnvio(true)
      return
    }

    setVaiReceberWhats(r.whatsappEnviado)
    setConcluido(true)
    marcarLead()
  }

  // PageView do Pixel, uma vez por carregamento.
  useEffect(() => {
    iniciarPixel()
  }, [])

  useEffect(() => {
    if (!concluido) return
    const t1 = window.setTimeout(() => setDesfecho(6), 3000)
    const t2 = window.setTimeout(() => setDesfecho(7), 8000)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [concluido])

  const podeVoltar = step > 0 && !enviando && !concluido
  // Precisa ser visivel na tela, nao so no console: sem isso alguem testa,
  // ve "demo destravada" e acha que entrou lead de verdade (ou o contrario).
  const teste = modoTeste()

  return (
    <div className="relative mx-auto flex h-[100dvh] max-w-5xl flex-col overflow-hidden lg:max-w-6xl lg:flex-row lg:items-center lg:gap-8 lg:px-8">
      <Feixes />
      {teste && (
        <div className="pointer-events-none absolute left-1/2 top-1 z-50 -translate-x-1/2 rounded-full border border-amber-400/50 bg-amber-400/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-200">
          Modo teste · nada é enviado
        </div>
      )}
      {/* PALCO: fixo em cima no mobile, coluna esquerda no desktop */}
      <div className="shrink-0 px-3 pt-3 lg:w-[46%] lg:px-0 lg:pt-0">
        {/* 36dvh e o teto pra lista de 6 opcoes caber inteira embaixo sem
            cortar a ultima. Ja conferido que nenhuma cena estoura nessa altura. */}
        <div className="h-[36dvh] min-h-[225px] lg:h-[560px]">
          <Stage
            scene={scene}
            answers={answers}
            enviando={enviando}
            whatsappEnviado={vaiReceberWhats}
          />
        </div>
      </div>

      {/* PERGUNTA: sempre uma so, sempre no mesmo lugar */}
      <div className="flex min-h-0 flex-1 flex-col px-4 pb-3 pt-4 lg:pt-0">
        {/* `my-auto` no filho em vez de `justify-center` no pai: com
            justify-center, passo que nao cabe na tela tem o TOPO cortado e
            fica inalcancavel na rolagem. */}
        <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto py-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={concluido ? 'fim' : step}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -26 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="my-auto w-full"
            >
              {concluido ? (
                <Concluido
                  vaiReceberWhats={vaiReceberWhats}
                  whatsapp={answers.whatsapp}
                />
              ) : (
                <Passo
                  step={step}
                  answers={answers}
                  set={set}
                  escolher={escolher}
                  avancarStep0={avancarStep0}
                  finalizar={finalizar}
                  tentouStep0={tentouStep0}
                  nomeOk={nomeOk}
                  empresaOk={empresaOk}
                  foneOk={foneOk}
                  enviando={enviando}
                  erroEnvio={erroEnvio}
                  concluido={concluido}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 pt-2">
          {podeVoltar ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="rounded-lg px-2 py-1 text-[12px] font-semibold text-white/45 transition hover:text-white/80"
            >
              ← Voltar
            </button>
          ) : (
            <span />
          )}
          {/* Curto porque a Lexend e mais larga que a fonte anterior e a versao
              longa passou a quebrar em duas linhas em cima do botao Voltar. */}
          <p className="safe-bottom whitespace-nowrap text-right text-[10px] leading-snug text-white/30">
            Uso só para contato comercial
          </p>
        </div>
      </div>
    </div>
  )
}

type PassoProps = {
  step: number
  answers: Answers
  set: <K extends keyof Answers>(k: K, v: Answers[K]) => void
  escolher: (campo: keyof Answers, valor: string, proximo: number) => void
  avancarStep0: () => void
  finalizar: (timing: string) => void
  tentouStep0: boolean
  nomeOk: boolean
  empresaOk: boolean
  foneOk: boolean
  enviando: boolean
  erroEnvio: boolean
  concluido: boolean
}

function Passo({
  step,
  answers,
  set,
  escolher,
  avancarStep0,
  finalizar,
  tentouStep0,
  nomeOk,
  empresaOk,
  foneOk,
  enviando,
  erroEnvio,
  concluido,
}: PassoProps) {
  if (step === 0) {
    return (
      <div>
        {/* O logo substitui o eyebrow de texto. Menos uma linha na tela e
            some a repeticao do nome do produto, que ja esta no titulo. */}
        <Logo className="mb-3 h-5" />
        <h1 className="font-display text-[21px] font-black leading-[1.15] lg:text-3xl">
          {SITE.headline}
        </h1>
        <p className="mb-4 mt-2 text-[13px] leading-snug text-white/65">{SITE.sub}</p>

        {/* Nome e WhatsApp continuam juntos: sao um bloco so ("como te chamo e
            onde falo com voce"), e separar adiaria a primeira cena. */}
        <Label hint="É por onde a gente continua a conversa depois">
          Seu nome, sua empresa e seu WhatsApp
        </Label>
        <div className="space-y-2">
          <TextField
            value={answers.nome}
            onChange={(v) => set('nome', v)}
            placeholder="Seu nome"
            autoComplete="name"
            invalid={tentouStep0 && !nomeOk}
            onEnter={avancarStep0}
          />
          {/* Funil B2B: sem o nome da empresa o vendedor liga sem saber pra
              quem esta ligando. */}
          <TextField
            value={answers.empresa}
            onChange={(v) => set('empresa', v)}
            placeholder="Nome da empresa"
            autoComplete="organization"
            invalid={tentouStep0 && !empresaOk}
            onEnter={avancarStep0}
          />
          <TextField
            value={answers.whatsapp}
            onChange={(v) => set('whatsapp', maskPhone(v))}
            placeholder="(11) 99999-9999"
            inputMode="tel"
            autoComplete="tel"
            invalid={tentouStep0 && !foneOk}
            onEnter={avancarStep0}
          />
          {tentouStep0 && (!nomeOk || !empresaOk || !foneOk) && (
            <p className="text-[12px] text-rosa">
              {!nomeOk
                ? 'Escreve seu nome pra gente continuar'
                : !empresaOk
                  ? 'Falta o nome da empresa'
                  : 'Confere o WhatsApp com DDD, parece incompleto'}
            </p>
          )}
        </div>
        <div className="mt-3">
          <PrimaryButton onClick={avancarStep0}>Destravar a minha demo</PrimaryButton>
        </div>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div>
        <Label hint="Isso define o tamanho da operação que a gente vai desenhar">
          Quanto a sua empresa fatura por ano?
        </Label>
        <ChoiceGrid
          options={ANNUAL_REVENUE_RANGES}
          value={answers.faturamento}
          onChange={(v) => escolher('faturamento', v, 2)}
        />
      </div>
    )
  }

  if (step === 2) {
    return (
      <div>
        <Label hint="Escolha o que mais dói hoje">
          O que mais trava o seu atendimento?
        </Label>
        <ChoiceGrid
          options={PAIN_OPTIONS}
          value={answers.dor}
          onChange={(v) => escolher('dor', v, 3)}
        />
      </div>
    )
  }

  if (step === 3) {
    return (
      <div>
        <Label>Quem decide sobre automação de atendimento aí?</Label>
        <ChoiceGrid
          options={AUTHORITY_OPTIONS}
          value={answers.authority}
          onChange={(v) => escolher('authority', v, 4)}
        />
      </div>
    )
  }

  return (
    <div>
      <Label hint="Último passo pra destravar a demo completa">
        Pra quando você quer isso resolvido?
      </Label>
      <ChoiceGrid
        options={TIMING_OPTIONS}
        value={answers.timing}
        onChange={(v) => set('timing', v)}
      />
      {erroEnvio && (
        <p className="mt-3 rounded-xl border border-rosa/40 bg-rosa/10 px-3 py-2 text-[12px] leading-snug text-rosa">
          Não consegui enviar suas respostas agora. Confere a conexão e toca de novo,
          que eu tento outra vez.
        </p>
      )}
      <div className="mt-3">
        <PrimaryButton
          onClick={() => void finalizar(answers.timing)}
          disabled={!answers.timing || (concluido && !erroEnvio)}
          loading={enviando}
        >
          {erroEnvio ? 'Tentar de novo' : 'Destravar a demo completa'}
        </PrimaryButton>
      </div>
    </div>
  )
}

function Concluido({
  vaiReceberWhats,
  whatsapp,
}: {
  vaiReceberWhats: boolean
  whatsapp: string
}) {
  return (
    <div className="text-center">
      <h2 className="font-display text-[20px] font-black leading-tight">
        Demo destravada
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-snug text-white/70">
        {vaiReceberWhats
          ? `Fica de olho no WhatsApp ${whatsapp}, a mensagem sai em instantes.`
          : `Alguém do time da ${SITE.brand} vai olhar suas respostas e falar com você.`}
      </p>
      <p className="mt-3 text-[11px] font-semibold text-white/45">
        Continue assistindo aqui em cima
      </p>
    </div>
  )
}

```
