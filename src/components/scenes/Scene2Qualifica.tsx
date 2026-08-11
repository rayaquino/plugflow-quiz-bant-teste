import { motion } from 'framer-motion'
import { PhoneHeader, Thread, type Msg } from '@/components/chat'
import { ANNUAL_REVENUE_RANGES } from '@/lib/config'

/**
 * Cena 2: o agente qualifica o porte sozinho, antes de gastar o tempo de
 * qualquer vendedor. E o momento em que o lead entende que a IA nao e um
 * robo de FAQ.
 */
export default function Scene2Qualifica({
  active,
  faturamento,
  empresa,
}: {
  active: boolean
  faturamento: string
  empresa: string
}) {
  const faixa = ANNUAL_REVENUE_RANGES.find((r) => r.value === faturamento)
  const label = faixa?.label ?? ''
  const dentroDoPerfil = faixa?.icp ?? false

  const msgs: Msg[] = [
    {
      from: 'ia',
      // Usa o nome da empresa quando existe: mostra o agente trabalhando com o
      // dado que a pessoa acabou de dar, em vez de falar generico.
      // Sem artigo antes do nome: "a"/"o" antes de nome de empresa qualquer e
      // aposta de genero e sai errado em metade dos casos.
      text: empresa.trim()
        ? `Antes de te passar preço, deixa eu entender o tamanho da operação. ${empresa.trim()} fatura mais ou menos quanto por ano?`
        : 'Antes de te passar preço, deixa eu entender o tamanho da operação. Sua empresa fatura mais ou menos quanto por ano?',
      typing: 800,
    },
    { from: 'lead', text: label, typing: 700, after: 300 },
    {
      from: 'ia',
      text: dentroDoPerfil
        ? 'Perfeito, esse é exatamente o porte que a gente atende. Já vou separar o cenário certo pra você.'
        : 'Entendi. Nesse porte eu já consigo te mostrar um caminho mais enxuto, sem te empurrar coisa grande demais.',
      typing: 900,
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <PhoneHeader
        title="Agente Inteligente - PlugFlow"
        subtitle="qualificando o lead"
      />
      <Thread msgs={msgs} active={active} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2 }}
        className="border-t border-white/10 bg-white/5 px-3 py-2"
      >
        <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wide">
          <span className="text-white/60">Qualificação automática</span>
          <span className="text-grad">porte identificado</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
          <motion.div
            className="h-full rounded-full bg-brand-grad"
            initial={{ width: '0%' }}
            animate={{ width: dentroDoPerfil ? '82%' : '48%' }}
            transition={{ delay: 3.4, duration: 1.1, ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    </div>
  )
}
