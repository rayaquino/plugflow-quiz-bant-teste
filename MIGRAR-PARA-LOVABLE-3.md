# Migração para o Lovable, parte 3 de 3: montagem final

Cole isto no chat do projeto Lovable "Orquestrador Inteligente PlugFlow". Aplique as partes em ordem, uma por vez, esperando cada uma terminar.

Crie ou substitua exatamente os arquivos abaixo, mantendo os caminhos como estão. Apague qualquer página de exemplo que o scaffold tenha gerado.

Pontos de atenção, valem para as 3 partes:
- O alias `@` precisa apontar para `src` (ex: `@/lib/config`).
- Dependências necessárias: `framer-motion`, `react`, `react-dom`.
- As fontes Lexend e Public Sans vêm por link no `index.html`, sem pacote.
- Não mude nenhum texto visível: a copy passou por aprovação do cliente.
- Não invente recurso de produto na tela. Os canais e destinos de
  `src/lib/config.ts` são os únicos confirmados, e não existe e-mail nem
  agenda nativa na PlugFlow.

### `src/components/chat.tsx`

```tsx
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { cx, prefersReducedMotion } from '@/lib/utils'

export type Msg = {
  /** 'lead' = balao da esquerda (cliente), 'ia' = balao da direita (agente) */
  from: 'lead' | 'ia' | 'humano' | 'sistema'
  text: string
  /**
   * Nome de quem falou, numa assinatura discreta dentro do balao.
   * A troca de IA pra humano tem que ser imperceptivel pro cliente, entao a
   * unica marca dela e essa assinatura miuda. Nada de selo anunciando.
   */
  assinatura?: string
  /** ms de "digitando" antes desta mensagem aparecer */
  typing?: number
  /** ms de espera depois que ela aparece */
  after?: number
}

/**
 * Revela mensagens em sequencia, com pausa de "digitando" entre elas.
 * Reinicia do zero sempre que `key` muda (troca de cena).
 * Com prefers-reduced-motion, entrega tudo de uma vez.
 */
export function useThread(msgs: Msg[], active: boolean) {
  const [shown, setShown] = useState(0)
  const [typing, setTyping] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setShown(0)
    setTyping(false)
    if (!active) return

    if (prefersReducedMotion()) {
      setShown(msgs.length)
      return
    }

    let t = 250
    msgs.forEach((m, i) => {
      const typeFor = m.typing ?? (m.from === 'lead' ? 400 : 900)
      timers.current.push(
        window.setTimeout(() => setTyping(true), t),
        window.setTimeout(() => {
          setTyping(false)
          setShown(i + 1)
        }, t + typeFor),
      )
      t += typeFor + (m.after ?? 550)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => timers.current.forEach(clearTimeout)
  }, [active, msgs])

  return { shown, typing, done: shown >= msgs.length }
}

export function Thread({ msgs, active }: { msgs: Msg[]; active: boolean }) {
  const { shown, typing } = useThread(msgs, active)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [shown, typing])

  return (
    <div className="no-scrollbar flex-1 space-y-2 overflow-y-auto px-3 py-3">
      <AnimatePresence initial={false}>
        {msgs.slice(0, shown).map((m, i) => (
          <Bubble key={i} msg={m} />
        ))}
        {typing && <Typing key="typing" side={sideOf(msgs[shown]?.from ?? 'ia')} />}
      </AnimatePresence>
      <div ref={endRef} />
    </div>
  )
}

const sideOf = (from: Msg['from']) => (from === 'lead' ? 'left' : 'right')

function Bubble({ msg }: { msg: Msg }) {
  if (msg.from === 'sistema') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center py-1"
      >
        <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/70">
          {msg.text}
        </span>
      </motion.div>
    )
  }

  const left = msg.from === 'lead'

  /* IA e humano usam EXATAMENTE o mesmo balao de proposito. A transicao e
     seamless: quem esta conversando nao tem como saber que trocou. */
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      className={cx('flex', left ? 'justify-start' : 'justify-end')}
    >
      <div
        className={cx(
          'max-w-[82%] rounded-2xl px-3 py-2 text-[13px] leading-snug shadow-lg',
          left
            ? 'rounded-bl-md bg-white text-roxo-950'
            : 'rounded-br-md bg-brand-grad font-medium text-roxo-950',
        )}
      >
        {msg.text}
        {msg.assinatura && (
          <span className="mt-0.5 block text-right text-[10px] font-semibold text-roxo-950/55">
            {msg.assinatura}
          </span>
        )}
      </div>
    </motion.div>
  )
}

function Typing({ side }: { side: 'left' | 'right' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={cx('flex', side === 'left' ? 'justify-start' : 'justify-end')}
    >
      <div
        className={cx(
          'flex gap-1 rounded-2xl px-3 py-2.5',
          side === 'left' ? 'bg-white/90' : 'bg-white/20',
        )}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={cx(
              'h-1.5 w-1.5 rounded-full',
              side === 'left' ? 'bg-roxo-700' : 'bg-white',
            )}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  )
}

/** Cabecalho do "aparelho" que envolve toda cena. */
export function PhoneHeader({
  title,
  subtitle,
  online = true,
}: {
  title: string
  subtitle: string
  online?: boolean
}) {
  return (
    <div className="flex items-center gap-2.5 border-b border-white/10 bg-white/5 px-3 py-2.5">
      <div className="relative">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-grad text-[13px] font-black text-roxo-950">
          IA
        </div>
        {online && (
          <motion.span
            className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-roxo-900 bg-emerald-400"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold leading-tight">{title}</p>
        <p className="truncate text-[11px] leading-tight text-white/60">{subtitle}</p>
      </div>
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
        'w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition',
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
            className={cx(
              'rounded-xl border px-3.5 py-3 text-left transition',
              selected
                ? 'border-rosa bg-brand-grad text-roxo-950'
                : 'border-white/15 bg-white/5 text-white hover:border-white/35',
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
      className={cx(
        'w-full rounded-xl px-4 py-3.5 font-display text-[15px] font-black transition',
        disabled || loading
          ? 'cursor-not-allowed bg-white/10 text-white/40'
          : 'bg-brand-grad text-roxo-950 shadow-lg shadow-magenta/25',
      )}
    >
      {loading ? 'Enviando...' : children}
    </motion.button>
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
    <div className="relative h-full overflow-hidden rounded-2xl border border-white/12 bg-roxo-950/60 shadow-2xl">
      {/* brilho de fundo da marca */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-magenta/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-roxo-600/35 blur-3xl" />

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
      <motion.div
        className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-grad text-2xl font-black text-roxo-950"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        IA
      </motion.div>
      <p className="font-display text-[16px] font-black leading-tight">
        A sua demo <span className="text-grad">começa aqui</span>
      </p>
      <p className="mt-1.5 text-[12px] leading-snug text-white/60">
        Preencha o primeiro campo e veja a jornada do seu cliente rodando
      </p>
      <motion.div
        className="mt-4 text-white/40"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        ↓
      </motion.div>
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
import { sendLead } from './lib/submit'
import { isValidName, isValidPhone, maskPhone } from './lib/utils'

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
  const formRef = useRef<HTMLDivElement>(null)

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) =>
    setAnswers((a) => ({ ...a, [k]: v }))

  // Cena = quantos passos ja foram destravados. 0 e a tela de espera.
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
      void sendLead({ ...answers, nome: answers.nome, whatsapp: answers.whatsapp }, 'parcial')
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

  // Deixa a tela de "pronto" respirar, depois mostra o motor distribuindo e,
  // por fim, o lead andando no CRM.
  useEffect(() => {
    if (!concluido) return
    const t1 = window.setTimeout(() => setDesfecho(6), 3000)
    const t2 = window.setTimeout(() => setDesfecho(7), 8000)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [concluido])

  // Rola o passo novo pra vista assim que ele aparece.
  useEffect(() => {
    // No passo 0 nao rola nada: rolar na abertura empurra o nome do produto e a
    // headline pra fora da tela, que e justamente o que precisa ser lido primeiro.
    if (step === 0) return
    const el = formRef.current?.querySelector(`[data-step="${step}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [step])

  return (
    <div className="mx-auto flex h-[100dvh] max-w-5xl flex-col lg:max-w-6xl lg:flex-row lg:items-center lg:gap-8 lg:px-8">
      {/* PALCO: fixo no topo no mobile, coluna esquerda no desktop */}
      <div className="shrink-0 px-3 pt-3 lg:w-[46%] lg:px-0 lg:pt-0">
        <div className="h-[38dvh] min-h-[240px] lg:h-[560px]">
          <Stage
            scene={scene}
            answers={answers}
            enviando={enviando}
            whatsappEnviado={vaiReceberWhats}
          />
        </div>
      </div>

      {/* FORMULARIO: a unica parte que rola */}
      <div
        ref={formRef}
        className="no-scrollbar flex-1 overflow-y-auto px-4 pb-10 pt-5 lg:pt-0"
      >
        <header className="mb-5">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-rosa">
            {SITE.brand} · {SITE.produto}
          </p>
          <h1 className="font-display text-[22px] font-black leading-[1.15] lg:text-3xl">
            {SITE.headline}
          </h1>
          <p className="mt-2 text-[13px] leading-snug text-white/65">{SITE.sub}</p>
        </header>

        <div className="space-y-6">
          {/* PASSO 0: identificacao */}
          <section data-step={0}>
            {/* Nao promete "mandamos a demo no WhatsApp": o disparo so acontece
                pra parte dos leads, entao a promessa aqui fica no que sempre
                vale, que e a conversa continuar por ali. */}
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
            {step === 0 && (
              <div className="mt-3">
                <PrimaryButton onClick={avancarStep0}>
                  Destravar a minha demo
                </PrimaryButton>
              </div>
            )}
          </section>

          <AnimatePresence>
            {step >= 1 && (
              <Reveal key="s1" step={1}>
                <Label hint="Isso define o tamanho da operação que a gente vai desenhar">
                  Quanto a sua empresa fatura por ano?
                </Label>
                <ChoiceGrid
                  options={ANNUAL_REVENUE_RANGES}
                  value={answers.faturamento}
                  onChange={(v) => escolher('faturamento', v, 2)}
                />
              </Reveal>
            )}

            {step >= 2 && (
              <Reveal key="s2" step={2}>
                <Label hint="Escolha o que mais dói hoje">
                  O que mais trava o seu atendimento?
                </Label>
                <ChoiceGrid
                  options={PAIN_OPTIONS}
                  value={answers.dor}
                  onChange={(v) => escolher('dor', v, 3)}
                />
              </Reveal>
            )}

            {step >= 3 && (
              <Reveal key="s3" step={3}>
                <Label>Quem decide sobre automação de atendimento aí?</Label>
                <ChoiceGrid
                  options={AUTHORITY_OPTIONS}
                  value={answers.authority}
                  onChange={(v) => escolher('authority', v, 4)}
                />
              </Reveal>
            )}

            {step >= 4 && (
              <Reveal key="s4" step={4}>
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
                    disabled={!answers.timing || concluido}
                    loading={enviando}
                  >
                    {concluido ? 'Demo destravada' : 'Destravar a demo completa'}
                  </PrimaryButton>
                </div>
              </Reveal>
            )}
          </AnimatePresence>

          {concluido && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-[13px] leading-snug text-emerald-100"
            >
              {vaiReceberWhats ? (
                <>
                  Recebemos. Fica de olho no WhatsApp {answers.whatsapp}, a mensagem sai
                  em instantes.
                </>
              ) : (
                <>
                  Recebemos, obrigado. Alguém do time da {SITE.brand} vai olhar suas
                  respostas e falar com você.
                </>
              )}
            </motion.p>
          )}

          <p className="safe-bottom pt-2 text-center text-[11px] leading-snug text-white/35">
            Seus dados servem só pro contato comercial da {SITE.brand}. Nada de spam.
          </p>
        </div>
      </div>
    </div>
  )
}

function Reveal({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <motion.section
      data-step={step}
      initial={{ opacity: 0, y: 20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="overflow-hidden"
    >
      {children}
    </motion.section>
  )
}

```
