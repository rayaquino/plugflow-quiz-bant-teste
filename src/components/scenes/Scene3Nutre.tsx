import { motion } from 'framer-motion'
import { PhoneHeader, Thread, type Msg } from '@/components/chat'
import { PAIN_OPTIONS } from '@/lib/config'

/**
 * Cena 3: o agente mostra que entendeu a dor especifica e, no momento certo,
 * passa a conversa pro humano. E aqui que cai a objecao de "IA vai afastar
 * meu cliente".
 */

// Resposta do agente pra cada dor. Especifico o bastante pro lead sentir que
// foi lido, nunca generico tipo "entendo sua dor".
const RESPOSTA: Record<string, string> = {
  demora:
    'Entendi. Lead que espera mais de 5 minutos já está falando com o concorrente. Comigo a resposta sai na hora, em qualquer horário.',
  'fora-horario':
    'Faz sentido. Boa parte das mensagens chega justamente à noite e no fim de semana, quando não tem ninguém. Esse buraco eu cubro sozinho.',
  'follow-up':
    'Esse é o vazamento mais caro. Eu cobro o retorno sozinho no 2º, no 5º e no 10º dia, sem o seu time precisar lembrar.',
  volume:
    'Tranquilo. Eu atendo quantas conversas chegarem ao mesmo tempo e só passo pro time as que valem a pena.',
  qualificacao:
    'Combinado. Eu filtro o curioso e só entrego pro vendedor quem tem porte, urgência e poder de decisão.',
  'sem-controle':
    'Isso a gente resolve rápido: toda conversa fica registrada, com o resumo e o próximo passo já dentro do seu CRM.',
}

export default function Scene3Nutre({
  active,
  dor,
}: {
  active: boolean
  dor: string
}) {
  const opcao = PAIN_OPTIONS.find((p) => p.value === dor)
  const label = opcao?.label ?? 'Demora pra responder'

  const msgs: Msg[] = [
    { from: 'ia', text: 'Hoje o que mais te incomoda no atendimento?', typing: 700 },
    { from: 'lead', text: label, typing: 800, after: 250 },
    {
      from: 'ia',
      text: RESPOSTA[dor] ?? RESPOSTA.demora,
      typing: 1100,
      after: 400,
    },
    /* Aqui a conversa passa da IA pro humano. Nada anuncia isso: mesmo balao,
       mesmo ritmo, sem banner de "transferido". A unica marca e a assinatura
       miuda, e quem esta do outro lado nao percebe a troca. */
    {
      from: 'humano',
      text: 'E no seu caso dá pra resolver rápido. Quantas pessoas cuidam do atendimento aí hoje?',
      assinatura: 'Rafael',
      typing: 1000,
    },
  ]

  return (
    <div className="flex h-full min-h-full flex-col">
      <PhoneHeader
        title="Agente Inteligente - PlugFlow"
        subtitle="entendendo a sua dor"
      />
      <Thread msgs={msgs} active={active} />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 5.6 }}
        className="border-t border-white/10 bg-white/5 px-3 py-2 text-center"
      >
        {/* A troca so e revelada AQUI, na narracao, fora da conversa. Dentro do
            chat ela tem que passar despercebida, que e o ponto de venda. */}
        <p className="text-[11px] font-semibold text-white/80">
          A última mensagem já é uma pessoa do time.{' '}
          <span className="text-grad font-black">O seu cliente não percebe a troca</span>
        </p>
      </motion.div>
    </div>
  )
}
