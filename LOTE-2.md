# Atualização: componentes (lote 2 de 2)

Substitua os arquivos abaixo pelo conteúdo literal, mantendo os caminhos. Não reescreva, não renomeie e não altere nenhum outro arquivo do projeto.

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
          {scene === 2 && <Scene2Qualifica active faturamento={answers.faturamento} />}
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

### `src/components/fields/Fields.tsx`

```tsx
import { motion } from 'framer-motion'
import { cx } from '@/lib/utils'

export function Label({ children, hint }: { children: string; hint?: string }) {
  return (
    <div className="mb-2">
      <label className="block font-display text-[15px] font-bold leading-snug">
        {children}
      </label>
      {hint && <p className="mt-0.5 text-[12px] text-white/55">{hint}</p>}
    </div>
  )
}

export function TextField({
  value,
  onChange,
  placeholder,
  invalid,
  inputMode = 'text',
  autoComplete,
  onEnter,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  invalid?: boolean
  inputMode?: 'text' | 'tel'
  autoComplete?: string
  onEnter?: () => void
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          onEnter?.()
        }
      }}
      placeholder={placeholder}
      inputMode={inputMode}
      autoComplete={autoComplete}
      className={cx(
        'w-full rounded-2xl border bg-white/5 px-4 py-3 text-white outline-none transition',
        'placeholder:text-white/35 focus:border-rosa focus:bg-white/10',
        invalid ? 'border-rosa/70' : 'border-white/15',
      )}
    />
  )
}

export function ChoiceGrid({
  options,
  value,
  onChange,
  columns = 1,
}: {
  options: readonly { value: string; label: string; hint?: string }[]
  value: string
  onChange: (v: string) => void
  columns?: 1 | 2
}) {
  return (
    <div className={cx('grid gap-2', columns === 2 && 'grid-cols-2')}>
      {options.map((o) => {
        const selected = value === o.value
        return (
          <motion.button
            key={o.value}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(o.value)}
            /* Card com gradiente diagonal sutil e canto grande, no estilo dos
               cards de pilar do site real. */
            className={cx(
              'rounded-2xl border px-3.5 py-2.5 text-left transition',
              selected
                ? 'border-rosa bg-brand-grad text-roxo-950'
                : 'border-white/12 bg-gradient-to-br from-white/[0.07] to-white/[0.02] text-white hover:border-white/30',
            )}
          >
            <span
              className={cx(
                'block text-[13px] font-semibold leading-snug',
                selected && 'font-bold',
              )}
            >
              {o.label}
            </span>
            {o.hint && (
              <span
                className={cx(
                  'mt-0.5 block text-[11px] leading-snug',
                  selected ? 'text-roxo-900/75' : 'text-white/50',
                )}
              >
                {o.hint}
              </span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  loading,
}: {
  children: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      /* Pill totalmente arredondado com gradiente preenchido, igual ao CTA
         primario do site real. */
      className={cx(
        'w-full rounded-full px-4 py-3.5 font-display text-[15px] font-black transition',
        disabled || loading
          ? 'cursor-not-allowed bg-white/10 text-white/40'
          : 'bg-brand-grad text-roxo-950 shadow-lg shadow-magenta/30',
      )}
    >
      {loading ? 'Enviando...' : children}
    </motion.button>
  )
}

```

### `src/components/scenes/Scene6Distribuicao.tsx`

```tsx
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { cx, prefersReducedMotion } from '@/lib/utils'
import { DESTINOS } from '@/lib/config'

/**
 * Cena da distribuicao: o motor dispara pra todos os destinos ao mesmo tempo.
 * E a cena que vende "orquestrador" em vez de "bot": o valor nao esta em
 * responder, esta em tudo acontecer junto e em segundos.
 *
 * Os destinos sao telas reais do produto (ver DESTINOS). Nao existe e-mail nem
 * agenda nativa, entao nada disso aparece aqui.
 */
export default function Scene6Distribuicao({ active }: { active: boolean }) {
  const [acesos, setAcesos] = useState(0)
  const [ms, setMs] = useState(0)

  useEffect(() => {
    if (!active) return
    if (prefersReducedMotion()) {
      setAcesos(DESTINOS.length)
      setMs(1400)
      return
    }
    setAcesos(0)
    setMs(0)

    const inicio = performance.now()
    const relogio = window.setInterval(() => {
      const passou = performance.now() - inicio
      setMs(passou >= 1400 ? 1400 : passou)
      if (passou >= 1400) window.clearInterval(relogio)
    }, 60)

    const acender = window.setInterval(() => {
      setAcesos((n) => {
        if (n >= DESTINOS.length) {
          window.clearInterval(acender)
          return n
        }
        return n + 1
      })
    }, 260)

    return () => {
      window.clearInterval(relogio)
      window.clearInterval(acender)
    }
  }, [active])

  const terminou = acesos >= DESTINOS.length

  return (
    <div className="flex h-full flex-col justify-center px-3.5 py-2">
      {/* O motor, no topo */}
      <div className="flex items-center justify-center">
        <div className="rounded-lg border border-rosa/35 bg-brand-grad px-3 py-1">
          <p className="font-display text-[11px] font-black leading-tight text-roxo-950">
            Orquestrador PlugFlow
          </p>
        </div>
      </div>

      {/* Pulso saindo pros destinos */}
      <div className="relative mx-auto my-1 h-4 w-px bg-white/15">
        <motion.span
          className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-rosa"
          initial={{ top: 0, opacity: 0 }}
          animate={active ? { top: ['0%', '100%'], opacity: [0, 1, 0] } : {}}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.5 }}
        />
      </div>

      {/* Os destinos acendendo quase juntos */}
      <div className="grid grid-cols-3 gap-1.5">
        {DESTINOS.map((d, i) => {
          const aceso = i < acesos
          return (
            <motion.div
              key={d.label}
              initial={{ opacity: 0.25, scale: 0.96 }}
              animate={aceso ? { opacity: 1, scale: 1 } : {}}
              transition={{ type: 'spring', stiffness: 340, damping: 26 }}
              className={cx(
                'rounded-lg border px-1.5 py-1.5 text-center transition-colors',
                aceso
                  ? 'border-rosa/40 bg-white/10'
                  : 'border-white/10 bg-white/[0.03]',
              )}
            >
              {/* Sem truncate: com Lexend "Mensagem agendada" era cortada e
                  virava "Mensagem agenda...", que parece defeito. */}
              <p className="text-[9px] font-bold leading-tight">{d.label}</p>
              <p
                className={cx(
                  'mt-0.5 text-[8px] leading-tight',
                  aceso ? 'text-rosa' : 'text-white/30',
                )}
              >
                {aceso ? d.nota : 'aguardando'}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* O cronometro, que e o que vende velocidade */}
      <div className="mt-2 flex items-center justify-center gap-2">
        <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[11px] font-bold tabular-nums text-white/85">
          {(ms / 1000).toFixed(1)}s
        </span>
        <motion.p
          initial={{ opacity: 0 }}
          animate={terminou ? { opacity: 1 } : {}}
          className="text-[10px] font-semibold leading-tight text-white/75"
        >
          Tudo isso <span className="text-grad font-black">de uma vez só</span>
        </motion.p>
      </div>
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
