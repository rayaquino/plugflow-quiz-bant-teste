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
