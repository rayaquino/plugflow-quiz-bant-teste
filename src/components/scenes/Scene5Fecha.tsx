import { motion } from 'framer-motion'
import { firstName } from '@/lib/utils'
import { SITE } from '@/lib/config'

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
    <div className="flex h-full flex-col items-center justify-center px-5 text-center">
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={active ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="relative mb-4"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-grad">
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
        className="font-display text-xl font-black leading-tight"
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
        className="mt-2 max-w-xs text-[13px] leading-snug text-white/75"
      >
        {whatsappEnviado
          ? 'Você vai receber no WhatsApp o mesmo tipo de atendimento que acabou de ver aqui. Se fizer sentido, a gente marca uma demonstração de 20 minutos.'
          : 'Suas respostas já estão com o time comercial. Se fizer sentido pro seu cenário, alguém entra em contato pra combinar uma demonstração.'}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={active && !enviando && whatsappEnviado ? { opacity: 1 } : {}}
        transition={{ delay: 0.9 }}
        className="mt-4 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5"
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

      <motion.a
        href={`https://wa.me/${SITE.whatsappNumeroWa}?text=${encodeURIComponent(
          `Oi! Sou ${primeiro}, acabei de destravar minha demo no quiz da PlugFlow e quero solicitar uma demonstração.`,
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 12 }}
        animate={active && !enviando ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.1 }}
        className="mt-5 flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-[#0C0024] shadow-lg shadow-[#25D366]/20 transition-transform active:scale-95"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.27 4.9L2 22l5.25-1.38a9.96 9.96 0 0 0 4.79 1.22h.01c5.52 0 10-4.48 10-10s-4.49-9.84-10.01-9.84Zm0 18.15h-.01a8.14 8.14 0 0 1-4.16-1.14l-.3-.18-3.11.82.83-3.03-.2-.31a8.15 8.15 0 0 1-1.25-4.31c0-4.51 3.67-8.18 8.19-8.18a8.14 8.14 0 0 1 8.18 8.18c0 4.51-3.68 8.15-8.17 8.15Zm4.48-6.12c-.25-.12-1.45-.71-1.67-.8-.22-.08-.39-.12-.55.13-.16.24-.63.79-.78.96-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.45-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.24-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42-.14-.01-.31-.01-.47-.01-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.16 1.73 2.64 4.2 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28Z" />
        </svg>
        Solicitar demo
      </motion.a>
    </div>
  )
}
