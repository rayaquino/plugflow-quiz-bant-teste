import { motion } from 'framer-motion'

/**
 * Feixes de luz diagonais do site real (plugflow.com.br): faixas rosa/magenta
 * borradas atravessando o fundo escuro, com movimento lento.
 *
 * Fica atras de tudo e nao captura clique. O movimento e de proposito bem
 * devagar: rapido demais competiria com as animacoes das cenas, que sao o
 * assunto da pagina.
 */
export default function Feixes() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        className="absolute -left-1/3 top-[-20%] h-[60vh] w-[85vw] rotate-[28deg] rounded-full bg-rosa/20 blur-[90px]"
        animate={{ x: ['-6%', '10%', '-6%'], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-1/4 top-[15%] h-[55vh] w-[70vw] rotate-[-18deg] rounded-full bg-magenta/20 blur-[100px]"
        animate={{ x: ['8%', '-8%', '8%'], opacity: [0.45, 0.8, 0.45] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-15%] left-[10%] h-[45vh] w-[80vw] rotate-[12deg] rounded-full bg-roxo-600/25 blur-[110px]"
        animate={{ x: ['-4%', '8%', '-4%'], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
