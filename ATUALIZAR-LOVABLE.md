# Atualização: tratamento de falha no envio

Substitua os arquivos abaixo pelo conteúdo literal, mantendo os caminhos. Não reescreva, não renomeie e não altere nenhum outro arquivo do projeto.

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
  // Envio que falhou NAO pode virar tela de "recebemos": a pessoa ficaria
  // esperando um contato que ninguem sabe que precisa fazer.
  const [erroEnvio, setErroEnvio] = useState(false)
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
    setErroEnvio(false)
    setEnviando(true)
    const r = await sendLead({ ...answers, timing }, 'completo')
    setEnviando(false)

    if (!r.ok) {
      // Botao continua clicavel de proposito. Retentar nao duplica lead: o
      // leadId e estavel na sessao e o backend casa por ele e pelo E.164.
      setErroEnvio(true)
      return
    }

    setVaiReceberWhats(r.whatsappEnviado)
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
                  erroEnvio={erroEnvio}
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
  erroEnvio: boolean
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
  erroEnvio,
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
      {erroEnvio && (
        <p className="mt-3 rounded-xl border border-rosa/40 bg-rosa/10 px-3 py-2 text-[12px] leading-snug text-rosa">
          Não consegui enviar suas respostas agora. Confere a conexão e toca de novo,
          que eu tento outra vez.
        </p>
      )}
      <div className="mt-3">
        <PrimaryButton
          onClick={() => void finalizar(answers.timing)}
          disabled={!answers.timing}
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
