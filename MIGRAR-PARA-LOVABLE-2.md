# Migração para o Lovable, parte 2 de 3: as 7 cenas animadas

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

### `src/components/scenes/Scene4Case.tsx`

```tsx
import { motion } from 'framer-motion'

/**
 * Cena 4: o case.
 *
 * REGRAS DESTA CENA, nao afrouxar sem o Renan:
 *  - NUNCA nomear o cliente. So o setor.
 *  - So entra aqui o que foi autorizado: um cliente da area de odontologia
 *    ligou pedindo pra pausar as IAs em horario comercial, porque as 4
 *    atendentes estavam de bracos cruzados.
 *  - Nada de numero de performance (tempo de resposta, duracao do teste,
 *    percentual). Ninguem confirmou nenhum, e numero inventado embaixo de um
 *    selo "caso real" e a pior coisa que esta pagina poderia fazer.
 *  - Nada sobre o que aconteceu com o time depois. Nao foi dito, e afirmar
 *    seria inventar sobre o emprego de gente real.
 *
 * O detalhe que carrega o case e "em horario comercial": a IA nao estava
 * cobrindo a madrugada, estava dando conta no turno em que o time humano
 * estava la, sentado.
 */
const CASE = {
  setor: 'Cliente da área de odontologia',
  quando: 'Case recente',
  atendentes: 4,
}

export default function Scene4Case({ active }: { active: boolean }) {
  return (
    <div className="flex h-full flex-col justify-center px-3.5 py-2">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={active ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 26 }}
        className="rounded-2xl border border-white/15 bg-white/5 p-3"
      >
        {/* "case recente" no lugar de "esta semana" (decisao do Renan): o fato
            de ser recente era autorizado, mas data exata envelhece sozinha e a
            pagina fica no ar por meses afirmando algo que deixou de ser verdade. */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-white/60">
              {CASE.setor}
            </p>
            <p className="text-[9px] font-semibold uppercase tracking-wider text-white/40">
              {CASE.quando}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-rosa/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rosa">
            Caso real
          </span>
        </div>

        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-2 font-display text-[15px] font-extrabold leading-snug"
        >
          <span className="text-grad">"Dá pra pausar as IAs em horário comercial?</span>{' '}
          Minhas {CASE.atendentes} atendentes estão de braços cruzados."
        </motion.blockquote>

        {/* As 4 atendentes ficando ociosas, uma a uma */}
        <div className="mt-2.5 flex items-center justify-center gap-2.5">
          {Array.from({ length: CASE.atendentes }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={active ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.6 + i * 0.18 }}
              className="flex flex-col items-center gap-1"
            >
              <motion.div
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[13px]"
                animate={active ? { filter: ['grayscale(0)', 'grayscale(1)'] } : {}}
                transition={{ delay: 2.6 + i * 0.18, duration: 0.5 }}
              >
                🙂
              </motion.div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={active ? { opacity: 1 } : {}}
                transition={{ delay: 2.8 + i * 0.18 }}
                className="text-[9px] font-semibold uppercase tracking-wide text-white/50"
              >
                ociosa
              </motion.span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={active ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 3.6 }}
          className="mt-2.5 border-t border-white/10 pt-2 text-center text-[11.5px] leading-snug text-white/85"
        >
          O pedido não veio de falha da IA. Veio porque ela{' '}
          <span className="text-grad font-black">não estava deixando sobrar</span>{' '}
          atendimento para o time, no meio do expediente.
        </motion.p>
      </motion.div>

      {/* Dado publico, com fonte e autor, separado do case de proposito: quem
          responde por ele e a HBR, nao a PlugFlow falando de um cliente que
          nao pode ser nomeado nem checado. */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 4.2 }}
        className="mt-1.5 px-1 text-center text-[9.5px] leading-tight text-white/45"
      >
        Responder na primeira hora torna a empresa cerca de{' '}
        <span className="font-bold text-white/70">7 vezes mais propensa</span> a
        qualificar o lead do que esperar mais uma hora. Harvard Business Review, 2011
      </motion.p>
    </div>
  )
}

```

### `src/components/scenes/Scene5Fecha.tsx`

```tsx
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
    </div>
  )
}

```

### `src/components/scenes/Scene6Distribuicao.tsx`

```tsx
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

```

### `src/components/scenes/Scene7Crm.tsx`

```tsx
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { cx, collectUtms, firstName, prefersReducedMotion } from '@/lib/utils'

/**
 * Cena 6: o depois. O lead ve o proprio card andando pelas etapas do CRM
 * sozinho e caindo num dashboard que mostra de onde ele veio.
 *
 * E enfeite de fechamento, nao reage a campo nenhum: roda sozinha depois do
 * envio. Por isso vive fora do fluxo de perguntas e nao pode travar nada.
 */

const ETAPAS = [
  { label: 'Novo', legenda: 'Lead entrou no CRM sozinho' },
  { label: 'Qualificado', legenda: 'A IA qualificou e pontuou' },
  { label: 'Follow up', legenda: 'Sequência cobrando o retorno sozinha' },
  // "agenda do vendedor" saiu: a PlugFlow nao tem calendario nativo. O que
  // existe de verdade e a etapa no painel do CRM.
  { label: 'Agendado', legenda: 'Reunião marcada e registrada no painel' },
  { label: 'Ganho', legenda: 'Venda registrada, sem ninguém digitando' },
] as const

export default function Scene7Crm({
  active,
  nome,
}: {
  active: boolean
  nome: string
}) {
  const [etapa, setEtapa] = useState(0)
  const primeiro = firstName(nome) || 'Lead'
  const utm = collectUtms()

  // De onde o lead veio de verdade, quando a URL traz UTM. Sem UTM, mostra o
  // rotulo neutro em vez de inventar campanha.
  const origem = utm.utm_source ?? 'Direto'
  const criativo = utm.utm_content ?? utm.utm_campaign ?? 'Sem campanha marcada'

  useEffect(() => {
    if (!active) return
    if (prefersReducedMotion()) {
      setEtapa(ETAPAS.length - 1)
      return
    }
    setEtapa(0)
    const id = window.setInterval(() => {
      setEtapa((e) => {
        if (e >= ETAPAS.length - 1) {
          window.clearInterval(id)
          return e
        }
        return e + 1
      })
    }, 850)
    return () => window.clearInterval(id)
  }, [active])

  const chegouNoFim = etapa >= ETAPAS.length - 1

  return (
    <div className="flex h-full flex-col justify-center px-3 py-2">
      <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-rosa">
        A partir daqui, sozinho
      </p>

      {/* Trilho do kanban: o card anda de coluna em coluna */}
      <div className="flex items-stretch gap-1">
        {ETAPAS.map((e, i) => {
          const passou = i <= etapa
          return (
            <div key={e.label} className="flex-1">
              <p
                className={cx(
                  'mb-1 truncate text-center text-[8px] font-bold uppercase tracking-wide transition-colors',
                  passou ? 'text-rosa' : 'text-white/35',
                )}
              >
                {e.label}
              </p>
              <div
                className={cx(
                  'flex h-11 items-center justify-center rounded-lg border transition-colors',
                  passou
                    ? 'border-rosa/40 bg-white/10'
                    : 'border-white/10 bg-white/[0.03]',
                )}
              >
                {i === etapa && (
                  <motion.div
                    layoutId="card-lead"
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    className="w-[92%] rounded-md bg-brand-grad px-1 py-1 text-center shadow-lg"
                  >
                    <span className="block truncate text-[9px] font-black leading-tight text-roxo-950">
                      {primeiro}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legenda do que acontece na etapa atual */}
      <div className="mt-2 h-7">
        <motion.p
          key={etapa}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-[11px] font-semibold leading-snug text-white/85"
        >
          {ETAPAS[etapa].legenda}
        </motion.p>
      </div>

      {/* Vislumbre do dashboard: de onde veio o lead */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={chegouNoFim ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        className="mt-1 rounded-xl border border-white/12 bg-white/5 p-2.5"
      >
        <p className="mb-1.5 text-[8px] font-bold uppercase tracking-wider text-white/45">
          Dashboard · origem do lead
        </p>
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-bold leading-tight">{origem}</p>
            <p className="truncate text-[9px] leading-tight text-white/50">
              {criativo}
            </p>
          </div>
          {/* Barrinhas ilustrativas do painel, sem numero atribuido a ninguem */}
          <div className="flex h-6 shrink-0 items-end gap-[3px]">
            {[40, 70, 55, 100, 80].map((h, i) => (
              <motion.span
                key={i}
                className="w-1.5 rounded-sm bg-brand-grad"
                initial={{ height: 0 }}
                animate={chegouNoFim ? { height: `${h}%` } : {}}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.35 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

```
