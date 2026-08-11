# Migração para o Lovable, parte 2 de 6: cenas 1 a 3

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

### `src/components/scenes/Scene1Entrada.tsx`

```tsx
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
    <div className="flex h-full flex-col justify-center px-3.5 py-2">
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

```

### `src/components/scenes/Scene2Qualifica.tsx`

```tsx
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
}: {
  active: boolean
  faturamento: string
}) {
  const faixa = ANNUAL_REVENUE_RANGES.find((r) => r.value === faturamento)
  const label = faixa?.label ?? ''
  const dentroDoPerfil = faixa?.icp ?? false

  const msgs: Msg[] = [
    {
      from: 'ia',
      text: 'Antes de te passar preço, deixa eu entender o tamanho da operação. Sua empresa fatura mais ou menos quanto por ano?',
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

```

### `src/components/scenes/Scene3Nutre.tsx`

```tsx
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
    <div className="flex h-full flex-col">
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

```
