# Atualização: trava de modo teste

Substitua os arquivos abaixo pelo conteúdo literal, mantendo os caminhos. Não reescreva, não renomeie e não altere nenhum outro arquivo do projeto.

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
 * Modo teste: `?teste=1` na URL.
 *
 * Existe porque so de preencher os dois primeiros campos o quiz ja dispara o
 * lead 'parcial' de verdade. Sem essa trava, qualquer um que abrisse a pagina
 * pra conferir a animacao criaria contato e task reais, e no fim disparia
 * WhatsApp pro numero que estivesse no campo.
 *
 * Quando ligado, nada sai da maquina e a tela mostra um aviso.
 */
export function modoTeste() {
  if (typeof window === 'undefined') return false
  const v = new URLSearchParams(window.location.search).get('teste')
  return v === '1' || v === 'true'
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

```

### `src/App.tsx`

```tsx
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
  const parcialEnviado = useRef(false)

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) =>
    setAnswers((a) => ({ ...a, [k]: v }))

  const scene = desfecho > 0 ? desfecho : concluido || enviando ? 5 : step

  const nomeOk = isValidName(answers.nome)
  const foneOk = isValidPhone(answers.whatsapp)

  const avancarStep0 = useCallback(() => {
    setTentouStep0(true)
    if (!nomeOk || !foneOk) return
    setStep(1)
    // Lead parcial: garante que quem abandonar no meio ainda chega no CRM.
    if (!parcialEnviado.current) {
      parcialEnviado.current = true
      void sendLead(answers, 'parcial')
    }
  }, [answers, nomeOk, foneOk])

  // Cada escolha destrava a proxima cena sozinha, sem botao no meio do caminho.
  const escolher = (campo: keyof Answers, valor: string, proximo: number) => {
    set(campo, valor)
    window.setTimeout(() => setStep(proximo), 260)
  }

  const finalizar = async (timing: string) => {
    set('timing', timing)
    setEnviando(true)
    const r = await sendLead({ ...answers, timing }, 'completo')
    setVaiReceberWhats(r.whatsappEnviado)
    setEnviando(false)
    setConcluido(true)
  }

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
                  foneOk={foneOk}
                  enviando={enviando}
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
          <p className="safe-bottom text-right text-[10px] leading-snug text-white/30">
            Seus dados servem só pro contato comercial da {SITE.brand}
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
  foneOk: boolean
  enviando: boolean
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
  foneOk,
  enviando,
}: PassoProps) {
  if (step === 0) {
    return (
      <div>
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-rosa">
          {SITE.brand} · {SITE.produto}
        </p>
        <h1 className="font-display text-[21px] font-black leading-[1.15] lg:text-3xl">
          {SITE.headline}
        </h1>
        <p className="mb-4 mt-2 text-[12.5px] leading-snug text-white/65">{SITE.sub}</p>

        {/* Nome e WhatsApp continuam juntos: sao um bloco so ("como te chamo e
            onde falo com voce"), e separar adiaria a primeira cena. */}
        <Label hint="É por onde a gente continua a conversa depois">
          Como você se chama e qual o seu WhatsApp?
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
          <TextField
            value={answers.whatsapp}
            onChange={(v) => set('whatsapp', maskPhone(v))}
            placeholder="(11) 99999-9999"
            inputMode="tel"
            autoComplete="tel"
            invalid={tentouStep0 && !foneOk}
            onEnter={avancarStep0}
          />
          {tentouStep0 && (!nomeOk || !foneOk) && (
            <p className="text-[12px] text-rosa">
              {!nomeOk
                ? 'Escreve seu nome pra gente continuar'
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
      <div className="mt-3">
        <PrimaryButton
          onClick={() => void finalizar(answers.timing)}
          disabled={!answers.timing}
          loading={enviando}
        >
          Destravar a demo completa
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
