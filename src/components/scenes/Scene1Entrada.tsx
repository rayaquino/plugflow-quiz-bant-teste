import { motion } from 'framer-motion'
import { CANAIS_ENTRADA } from '@/lib/config'
import { firstName } from '@/lib/utils'

/**
 * Cena 1: a entrada. O lead pode chegar por qualquer canal e tudo cai no mesmo
 * motor. Abre a camera de proposito: a primeira coisa que a pagina mostra nao
 * pode ser uma conversa de WhatsApp, senao o produto vira "bot de WhatsApp".
 *
 * Os canais aqui sao os confirmados nas telas do produto. Ver CANAIS_ENTRADA.
 */
export default function Scene1Entrada({
  active,
  nome,
}: {
  active: boolean
  nome: string
}) {
  const primeiro = firstName(nome) || 'Seu lead'

  return (
    <div className="flex min-h-full flex-col justify-center px-3.5 py-2">
      <div className="mb-2 flex items-center justify-center gap-1.5">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-rosa"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/55">
          Sábado, 22h47 · time offline
        </p>
      </div>

      {/* Os canais entrando ao mesmo tempo */}
      <div className="flex items-start gap-2">
        {CANAIS_ENTRADA.map((canal, i) => (
          <div key={canal.id} className="flex flex-1 flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={active ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.22 }}
              className="w-full rounded-lg border border-white/15 bg-white/[0.07] px-1 py-1.5 text-center"
            >
              <p className="truncate text-[10px] font-bold leading-tight">
                {canal.label}
              </p>
              <p className="mt-0.5 truncate text-[8px] leading-tight text-white/45">
                {canal.id === 'whatsapp' ? primeiro : 'lead novo'}
              </p>
            </motion.div>

            {/* O pulso descendo do canal ate o motor */}
            {/* A linha precisa ser visivel: sem ela o pulso vira ponto solto e
                a convergencia dos canais no motor nao se le. */}
            <div className="relative my-1 h-9 w-px bg-white/25">
              <motion.span
                className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-rosa"
                initial={{ top: 0, opacity: 0 }}
                animate={active ? { top: ['0%', '100%'], opacity: [0, 1, 0] } : {}}
                transition={{
                  delay: 0.7 + i * 0.22,
                  duration: 0.7,
                  repeat: Infinity,
                  repeatDelay: 1.1,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* O motor */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={active ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.9, type: 'spring', stiffness: 260, damping: 22 }}
        className="relative rounded-xl border border-rosa/35 bg-brand-grad px-3 py-2 text-center"
      >
        <motion.div
          className="absolute inset-0 rounded-xl border border-rosa"
          animate={active ? { opacity: [0.6, 0], scale: [1, 1.06] } : {}}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <p className="font-display text-[12px] font-black leading-tight text-roxo-950">
          Orquestrador PlugFlow
        </p>
        <p className="text-[9px] font-semibold leading-tight text-roxo-900/70">
          responde na hora, em qualquer canal
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 2.2 }}
        className="mt-2 text-center text-[11px] font-semibold leading-snug text-white/80"
      >
        Não importa por onde ele chega.{' '}
        <span className="text-grad font-black">Ninguém fica sem resposta</span>
      </motion.p>
    </div>
  )
}
