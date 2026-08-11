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
              <p className="truncate text-[9px] font-bold leading-tight">{d.label}</p>
              <p
                className={cx(
                  'mt-0.5 truncate text-[8px] leading-tight',
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
