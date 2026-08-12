import { motion } from 'framer-motion'
import { firstName } from '@/lib/utils'

/**
 * Cena 5: fecha o loop. O lead ve o proprio WhatsApp recebendo a mensagem que
 * ele acabou de ver a IA mandar pros outros. O CTA vive no formulario abaixo.
 */
/**
 * O backend so dispara WhatsApp pra quem passou no corte. Entao esta tela nao
 * pode prometer mensagem pra todo mundo: quem nao passou ficaria esperando algo
 * que nunca chega. `whatsappEnviado` vem da resposta do n8n.
 */
export default function Scene5Fecha({
  active,
  nome,
  enviando,
  whatsappEnviado,
}: {
  active: boolean
  nome: string
  enviando: boolean
  whatsappEnviado: boolean
}) {
  const primeiro = firstName(nome) || 'você'

  return (
    /* `min-h-full`: com `h-full`, o `justify-center` empurrava o circulo do
       check pra fora do topo do Palco e ele aparecia cortado no meio no
       iPhone. */
    <div className="flex min-h-full flex-col items-center justify-center px-5 text-center">
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={active ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="relative mb-3 lg:mb-4"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-grad lg:h-16 lg:w-16">
          {enviando ? (
            <motion.span
              className="block h-7 w-7 rounded-full border-[3px] border-roxo-950/25 border-t-roxo-950"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
              <motion.path
                d="M5 12.5l4.5 4.5L19 7.5"
                fill="none"
                stroke="#1F0052"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.25, duration: 0.45, ease: 'easeOut' }}
              />
            </svg>
          )}
        </div>
        {!enviando && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-rosa"
            animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        )}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={active ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className="font-display text-[17px] font-black leading-tight lg:text-xl"
      >
        {enviando ? (
          'Montando a sua demo...'
        ) : (
          <>
            Pronto, {primeiro}. <span className="text-grad">Demo destravada.</span>
          </>
        )}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={active ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.55 }}
        className="mt-1.5 max-w-xs text-[12px] leading-snug text-white/75 lg:mt-2 lg:text-[13px]"
      >
        {whatsappEnviado
          ? 'Você vai receber no WhatsApp o mesmo tipo de atendimento que acabou de ver aqui. Se fizer sentido, a gente marca uma demonstração de 20 minutos.'
          : 'Suas respostas já estão com o time comercial. Se fizer sentido pro seu cenário, alguém entra em contato pra combinar uma demonstração.'}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={active && !enviando && whatsappEnviado ? { opacity: 1 } : {}}
        transition={{ delay: 0.9 }}
        className="mt-2.5 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 lg:mt-4"
      >
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-emerald-400"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        <span className="text-[11px] font-semibold text-white/80">
          Mensagem a caminho do seu WhatsApp
        </span>
      </motion.div>
    </div>
  )
}
