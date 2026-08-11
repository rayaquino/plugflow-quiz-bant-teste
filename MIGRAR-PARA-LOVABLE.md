# Migração para o Lovable

Cole o bloco abaixo inteiro no chat do projeto Lovable
"Orquestrador Inteligente PlugFlow". Ele substitui o scaffold de placeholder
pelo código real do quiz BANT.

---

Substitua o conteúdo do projeto pelos arquivos abaixo, criando cada caminho
exatamente como está indicado. Apague qualquer página de exemplo que o scaffold
tenha gerado.

Pontos de atenção:
- O alias `@` precisa apontar para `src` (ex: `@/lib/config`).
- As dependências necessárias são `framer-motion`, `react` e `react-dom`.
- As fontes Lexend e Public Sans vêm por link no `index.html`, sem pacote.
- Não mude nenhum texto visível: a copy passou por aprovação do cliente.
- Não invente recurso de produto novo na tela: os canais e destinos listados em
  `src/lib/config.ts` são os únicos confirmados.


### `package.json`

```json
{
  "name": "plugflow-quiz-bant",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "framer-motion": "^11.11.17",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^26.2.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.15",
    "typescript": "^5.6.3",
    "vite": "^5.4.11"
  }
}

```

### `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Manual de identidade PlugFlow (pagina 13)
        roxo: {
          950: '#0D0D12',
          900: '#1F0052',
          800: '#2A0A63',
          700: '#3A1470',
          600: '#5A2A9E',
        },
        rosa: '#F18E99',
        magenta: '#CD4994',
        cinza: '#DEDEDE',
        creme: '#EDE3D2',
      },
      fontFamily: {
        display: ['Lexend', 'system-ui', 'sans-serif'],
        sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-grad': 'linear-gradient(90deg, #F18E99 0%, #CD4994 100%)',
      },
    },
  },
  plugins: [],
}

```

### `index.html`

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#1F0052" />
    <title>Destrave a sua demo | Orquestrador da Jornada do Cliente | PlugFlow</title>
    <meta
      name="description"
      content="Responda 4 perguntas rápidas e destrave a demo do Orquestrador da Jornada do Cliente: o lead chega por qualquer canal e é atendido, qualificado e agendado sozinho."
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;800;900&family=Public+Sans:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```

### `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    -webkit-text-size-adjust: 100%;
  }
  body {
    @apply bg-roxo-900 font-sans text-white antialiased;
    /* trava o bounce do iOS: a cena fica fixa, so o form rola */
    overscroll-behavior-y: none;
  }
  /* evita o zoom automatico do iOS ao focar input */
  input,
  select,
  textarea,
  button {
    font-size: 16px;
  }
}

@layer utilities {
  .text-grad {
    @apply bg-brand-grad bg-clip-text text-transparent;
  }
  .safe-bottom {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}

```

### `src/main.tsx`

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

```

### `src/lib/config.ts`

```ts
// Configuracao unica do quiz. Mexer aqui muda copy, opcoes e pontuacao.
// Regra de copy do projeto: nada de travessao, acentuacao sempre correta.

/**
 * O enquadramento da abertura e "destrave a SUA demo", nao "responda um
 * diagnostico". A diferenca importa: diagnostico e passivo e analitico, demo e
 * posse. O lead termina o quiz pra pegar uma coisa que ja e dele.
 */
export const SITE = {
  brand: 'PlugFlow',
  produto: 'Orquestrador da Jornada do Cliente',
  headline: 'Destrave a sua demo do Orquestrador da Jornada do Cliente',
  sub: 'Responda 4 perguntas rápidas e veja a demo montada pro seu cenário: o lead chegando por qualquer canal, sendo atendido, qualificado e agendado sozinho, enquanto o seu time cuida de fechar.',
  webhook:
    import.meta.env.VITE_WEBHOOK_URL ||
    'https://n8n.renanshots.com/webhook/plugflow-quiz-bant',
  whatsappChannel: 'da26f540-22d1-4add-8f15-d96755ceaa61',
  whatsappNumber: '(11) 93242-5662',
} as const

/**
 * Canais e recursos que a PlugFlow REALMENTE tem, conferidos nas telas do
 * produto rodando. Nada aqui pode ser suposto: a tela nomeia integracao, e
 * integracao que nao existe vira promessa quebrada na reuniao de vendas.
 *
 * NAO EXISTE e nao pode aparecer: e-mail e agenda/calendario nativos.
 * O nome real do recurso de IA e "Agente Inteligente", nao "Agente de IA".
 */
export const CANAIS_ENTRADA = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'site', label: 'Site' },
] as const

/** Saidas do orquestrador, todas telas reais do produto. */
export const DESTINOS = [
  { label: 'Painel do CRM', nota: 'card criado' },
  { label: 'Agente Inteligente', nota: 'qualificou o lead' },
  { label: 'Sequência', nota: 'nutrição ligada' },
  { label: 'Mensagem agendada', nota: 'retorno programado' },
  { label: 'Indicadores', nota: 'origem registrada' },
] as const

/**
 * Faixa de faturamento anual. O ICP da PlugFlow comeca em R$ 3 mi/ano, entao a
 * resolucao das faixas vive ACIMA desse corte, que e onde a decisao acontece.
 * Abaixo dele bastam duas faixas: separar o micro de quem esta quase no perfil
 * e pode virar lead bom em pouco tempo.
 *
 * `icp` e explicito de proposito. Ja tinhamos errado inferindo perfil a partir
 * do score, o que quebrava sozinho quando a pontuacao mudava.
 */
export const ANNUAL_REVENUE_RANGES = [
  { value: 'ate-500k', label: 'Até R$ 500 mil', score: 0, icp: false },
  { value: '500k-3mi', label: 'R$ 500 mil a R$ 3 milhões', score: 1, icp: false },
  { value: '3-10mi', label: 'R$ 3 a R$ 10 milhões', score: 3, icp: true },
  { value: '10-30mi', label: 'R$ 10 a R$ 30 milhões', score: 4, icp: true },
  { value: '30-100mi', label: 'R$ 30 a R$ 100 milhões', score: 5, icp: true },
  { value: 'acima-100mi', label: 'Acima de R$ 100 milhões', score: 5, icp: true },
] as const

// Need: a dor. Cada opcao vira o gancho da cena 3.
export const PAIN_OPTIONS = [
  {
    value: 'demora',
    label: 'Demora pra responder',
    hint: 'O lead chega e fica horas esperando',
    score: 5,
  },
  {
    value: 'fora-horario',
    label: 'Fora do horário comercial ninguém responde',
    hint: 'Noite, fim de semana e feriado ficam no vácuo',
    score: 5,
  },
  {
    value: 'follow-up',
    label: 'Falta follow up',
    hint: 'Quem não responde na hora some pra sempre',
    score: 4,
  },
  {
    value: 'volume',
    label: 'Volume alto demais pro time',
    hint: 'Chega mais lead do que o time dá conta',
    score: 4,
  },
  {
    value: 'qualificacao',
    label: 'Time perde tempo com curioso',
    hint: 'Vendedor bom atendendo quem nunca vai comprar',
    score: 3,
  },
  {
    value: 'sem-controle',
    label: 'Não sei o que acontece nas conversas',
    hint: 'Cada um responde de um jeito e nada fica registrado',
    score: 3,
  },
] as const

// Authority: quem decide sobre automacao de atendimento.
export const AUTHORITY_OPTIONS = [
  { value: 'eu-decido', label: 'Sou eu quem decide', score: 5 },
  { value: 'decido-com-socio', label: 'Decido junto com sócio ou diretoria', score: 4 },
  { value: 'indico', label: 'Eu indico, outra pessoa aprova', score: 2 },
  { value: 'outra-area', label: 'É de outra área', score: 1 },
] as const

// Timing: fecha o BANT na ultima tela.
export const TIMING_OPTIONS = [
  { value: 'agora', label: 'Pra ontem, é o gargalo do momento', score: 5 },
  { value: '30-dias', label: 'Nos próximos 30 dias', score: 4 },
  { value: '90-dias', label: 'Nos próximos 3 meses', score: 2 },
  { value: 'pesquisando', label: 'Só pesquisando por enquanto', score: 0 },
] as const

export type Answers = {
  nome: string
  whatsapp: string
  faturamento: string
  dor: string
  authority: string
  timing: string
}

export const EMPTY_ANSWERS: Answers = {
  nome: '',
  whatsapp: '',
  faturamento: '',
  dor: '',
  authority: '',
  timing: '',
}

type Scored = readonly { value: string; score: number }[]
const scoreOf = (list: Scored, value: string) =>
  list.find((o) => o.value === value)?.score ?? 0

/**
 * Score BANT de 0 a 20, com as 4 letras valendo 5 cada:
 * Budget (faturamento), Authority, Need (dor) e Timing.
 *
 * Cortes: >=15 quente (vai pro agendamento), >=10 morno (nutricao),
 * abaixo disso frio. Esta tabela e o espelho do que o n8n recalcula,
 * entao mudanca aqui exige mudanca la.
 */
export function scoreBant(a: Answers) {
  const budget = scoreOf(ANNUAL_REVENUE_RANGES, a.faturamento)
  const authority = scoreOf(AUTHORITY_OPTIONS, a.authority)
  const need = scoreOf(PAIN_OPTIONS, a.dor)
  const timing = scoreOf(TIMING_OPTIONS, a.timing)
  const total = budget + authority + need + timing

  const tier = total >= 15 ? 'quente' : total >= 10 ? 'morno' : 'frio'
  return { budget, authority, need, timing, total, tier } as const
}

export type BantScore = ReturnType<typeof scoreBant>

```

### `src/lib/utils.ts`

```ts
export const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(' ')

/**
 * So os digitos nacionais (DDD + numero), sem o 55 de pais.
 *
 * Muita gente cola o proprio numero do WhatsApp, que ja vem com o 55 na frente.
 * Sem tirar aqui, `+55` + `5511...` vira `+555511...`, numero invalido.
 * O corte so vale acima de 11 digitos pra nao estragar o DDD 55 (Caxias do Sul),
 * porque numero nacional nunca passa de 11 digitos.
 */
function digitsBR(raw: string) {
  let d = raw.replace(/\D/g, '')
  while (d.length > 11 && d.startsWith('55')) d = d.slice(2)
  return d.slice(0, 11)
}

/** Mascara pt-BR: (11) 93242-5662 */
export function maskPhone(raw: string) {
  const d = digitsBR(raw)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

/** Aceita fixo (10) e celular (11). DDD valido comeca em 11. */
export function isValidPhone(raw: string) {
  const d = digitsBR(raw)
  if (d.length !== 10 && d.length !== 11) return false
  if (Number(d.slice(0, 2)) < 11) return false
  if (d.length === 11 && d[2] !== '9') return false
  return true
}

/**
 * Formato E.164 pro WhatsApp: +5511932425662.
 * O front normaliza, mas o backend normaliza de novo por conta propria:
 * nada que vem do cliente entra no disparo sem ser reconferido.
 */
export function toE164(raw: string) {
  return `+55${digitsBR(raw)}`
}

/**
 * Id estavel do preenchimento, criado uma vez e repetido nos dois disparos
 * (parcial e completo). Sem ele, quem termina o quiz vira duas tasks no
 * ClickUp: a do parcial e a do completo.
 */
export function getLeadId() {
  const chave = 'plugflow_quiz_lead_id'
  try {
    let id = sessionStorage.getItem(chave)
    if (!id) {
      id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
      sessionStorage.setItem(chave, id)
    }
    return id
  } catch {
    // sessionStorage bloqueado (aba anonima, ITP). Devolve vazio de proposito:
    // um id novo a cada disparo nao casaria o parcial com o completo de
    // qualquer jeito, e ainda escreveria um id mentiroso na task. Sem id, o
    // backend cai no WhatsApp em E.164, que e a chave principal de dedupe.
    return ''
  }
}

export function isValidName(raw: string) {
  return raw.trim().length >= 2 && /[a-zà-ú]/i.test(raw)
}

export function firstName(raw: string) {
  return raw.trim().split(/\s+/)[0] || ''
}

/** UTMs da URL, pra atribuicao no n8n e no ClickUp. */
export function collectUtms() {
  if (typeof window === 'undefined') return {}
  const p = new URLSearchParams(window.location.search)
  const keys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'fbclid',
    'gclid',
  ]
  const out: Record<string, string> = {}
  for (const k of keys) {
    const v = p.get(k)
    if (v) out[k] = v
  }
  return out
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

```

### `src/lib/submit.ts`

```ts
import {
  ANNUAL_REVENUE_RANGES,
  AUTHORITY_OPTIONS,
  PAIN_OPTIONS,
  SITE,
  TIMING_OPTIONS,
  scoreBant,
  type Answers,
} from './config'
import { collectUtms, getLeadId, toE164 } from './utils'

export type SubmitStage = 'parcial' | 'completo'

type Labeled = readonly { value: string; label: string }[]
const labelOf = (list: Labeled, value: string) =>
  list.find((o) => o.value === value)?.label ?? ''

/**
 * Manda pro n8n (/webhook/plugflow-quiz-bant).
 *
 * Dispara duas vezes de proposito:
 *  - 'parcial' assim que nome + whatsapp existem, pra nao perder o lead que
 *    abandona no meio do quiz;
 *  - 'completo' no fim, com BANT fechado, que e o que dispara o HSM e o CRM.
 *
 * Contrato combinado com o backend: campos chatos e planos, cada resposta com
 * `value` (chave estavel) e `Label` (texto que o lead viu). O WhatsApp sai daqui
 * ja normalizado em E.164, o n8n confia nesse formato.
 *
 * `scoreClient` vai junto so como conferencia. Quem roteia e o score recalculado
 * no n8n, porque qualquer um abre o devtools e posta o total que quiser.
 *
 * Falha de rede nunca pode travar a tela: o erro so e logado e o quiz segue.
 */
export async function sendLead(answers: Answers, stage: SubmitStage) {
  const score = scoreBant(answers)

  const payload = {
    source: 'plugflow-quiz-bant-sdr',
    stage,
    leadId: getLeadId(),
    submittedAt: new Date().toISOString(),

    nome: answers.nome.trim(),
    whatsapp: toE164(answers.whatsapp),
    whatsappFormatado: answers.whatsapp,

    faturamento: answers.faturamento,
    faturamentoLabel: labelOf(ANNUAL_REVENUE_RANGES, answers.faturamento),
    dor: answers.dor,
    dorLabel: labelOf(PAIN_OPTIONS, answers.dor),
    authority: answers.authority,
    authorityLabel: labelOf(AUTHORITY_OPTIONS, answers.authority),
    timing: answers.timing,
    timingLabel: labelOf(TIMING_OPTIONS, answers.timing),

    scoreClient: { total: score.total, tier: score.tier },
    canalWhatsapp: SITE.whatsappChannel,
    utm: collectUtms(),
    pagina: typeof window !== 'undefined' ? window.location.href : '',
  }

  try {
    const res = await fetch(SITE.webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })

    // O backend responde se o WhatsApp saiu de verdade. Ele so dispara pra
    // quem esta dentro do ICP e nao entrou como frio, entao a tela NAO pode
    // prometer mensagem pra todo mundo: parte dos leads nunca receberia nada
    // e ficaria esperando.
    let whatsappEnviado = false
    try {
      const corpo = (await res.clone().json()) as { whatsappEnviado?: boolean }
      whatsappEnviado = corpo?.whatsappEnviado === true
    } catch {
      // Resposta sem JSON (proxy, erro cru). Trata como "nao prometi nada".
    }

    return { ok: res.ok, status: res.status, whatsappEnviado }
  } catch (err) {
    console.error('[quiz-bant] falha ao enviar lead', err)
    return { ok: false, status: 0, whatsappEnviado: false }
  }
}

```

### `src/components/chat.tsx`

```tsx
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

```

### `src/components/fields/Fields.tsx`

```tsx
import { motion } from 'framer-motion'
import { cx } from '@/lib/utils'

export function Label({ children, hint }: { children: string; hint?: string }) {
  return (
    <div className="mb-2">
      <label className="block font-display text-[15px] font-bold leading-snug">
        {children}
      </label>
      {hint && <p className="mt-0.5 text-[12px] text-white/55">{hint}</p>}
    </div>
  )
}

export function TextField({
  value,
  onChange,
  placeholder,
  invalid,
  inputMode = 'text',
  autoComplete,
  onEnter,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  invalid?: boolean
  inputMode?: 'text' | 'tel'
  autoComplete?: string
  onEnter?: () => void
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          onEnter?.()
        }
      }}
      placeholder={placeholder}
      inputMode={inputMode}
      autoComplete={autoComplete}
      className={cx(
        'w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition',
        'placeholder:text-white/35 focus:border-rosa focus:bg-white/10',
        invalid ? 'border-rosa/70' : 'border-white/15',
      )}
    />
  )
}

export function ChoiceGrid({
  options,
  value,
  onChange,
  columns = 1,
}: {
  options: readonly { value: string; label: string; hint?: string }[]
  value: string
  onChange: (v: string) => void
  columns?: 1 | 2
}) {
  return (
    <div className={cx('grid gap-2', columns === 2 && 'grid-cols-2')}>
      {options.map((o) => {
        const selected = value === o.value
        return (
          <motion.button
            key={o.value}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(o.value)}
            className={cx(
              'rounded-xl border px-3.5 py-3 text-left transition',
              selected
                ? 'border-rosa bg-brand-grad text-roxo-950'
                : 'border-white/15 bg-white/5 text-white hover:border-white/35',
            )}
          >
            <span
              className={cx(
                'block text-[13px] font-semibold leading-snug',
                selected && 'font-bold',
              )}
            >
              {o.label}
            </span>
            {o.hint && (
              <span
                className={cx(
                  'mt-0.5 block text-[11px] leading-snug',
                  selected ? 'text-roxo-900/75' : 'text-white/50',
                )}
              >
                {o.hint}
              </span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  loading,
}: {
  children: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={cx(
        'w-full rounded-xl px-4 py-3.5 font-display text-[15px] font-black transition',
        disabled || loading
          ? 'cursor-not-allowed bg-white/10 text-white/40'
          : 'bg-brand-grad text-roxo-950 shadow-lg shadow-magenta/25',
      )}
    >
      {loading ? 'Enviando...' : children}
    </motion.button>
  )
}

```

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

### `src/components/Stage.tsx`

```tsx
import { AnimatePresence, motion } from 'framer-motion'
import Scene1Entrada from './scenes/Scene1Entrada'
import Scene2Qualifica from './scenes/Scene2Qualifica'
import Scene3Nutre from './scenes/Scene3Nutre'
import Scene4Case from './scenes/Scene4Case'
import Scene5Fecha from './scenes/Scene5Fecha'
import Scene6Distribuicao from './scenes/Scene6Distribuicao'
import Scene7Crm from './scenes/Scene7Crm'
import type { Answers } from '@/lib/config'

/**
 * Palco fixo no topo. Troca de cena conforme o lead destrava passos do form.
 * `scene` 0 e o estado de espera, 1 a 5 sao as cenas.
 */
export default function Stage({
  scene,
  answers,
  enviando,
  whatsappEnviado,
}: {
  scene: number
  answers: Answers
  enviando: boolean
  whatsappEnviado: boolean
}) {
  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-white/12 bg-roxo-950/60 shadow-2xl">
      {/* brilho de fundo da marca */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-magenta/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-roxo-600/35 blur-3xl" />

      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          /* pb-5 reserva a faixa dos indicadores, senao eles sobrepoem o
             rodape das cenas 1, 3 e 4 */
          className="relative h-full pb-5"
        >
          {scene === 0 && <SceneIdle />}
          {scene === 1 && <Scene1Entrada active nome={answers.nome} />}
          {scene === 2 && <Scene2Qualifica active faturamento={answers.faturamento} />}
          {scene === 3 && <Scene3Nutre active dor={answers.dor} />}
          {scene === 4 && <Scene4Case active />}
          {scene === 5 && (
            <Scene5Fecha
              active
              nome={answers.nome}
              enviando={enviando}
              whatsappEnviado={whatsappEnviado}
            />
          )}
          {scene === 6 && <Scene6Distribuicao active />}
          {scene === 7 && <Scene7Crm active nome={answers.nome} />}
        </motion.div>
      </AnimatePresence>

      {/* Os pontinhos param nas 5 cenas do quiz. As cenas 6 e 7 sao o desfecho
          que roda sozinho depois do envio, nao sao passos a preencher. */}
      <StepDots current={Math.min(scene, 5)} total={5} />
    </div>
  )
}

function SceneIdle() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <motion.div
        className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-grad text-2xl font-black text-roxo-950"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        IA
      </motion.div>
      <p className="font-display text-[16px] font-black leading-tight">
        A sua demo <span className="text-grad">começa aqui</span>
      </p>
      <p className="mt-1.5 text-[12px] leading-snug text-white/60">
        Preencha o primeiro campo e veja a jornada do seu cliente rodando
      </p>
      <motion.div
        className="mt-4 text-white/40"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        ↓
      </motion.div>
    </div>
  )
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.span
          key={i}
          className="h-1 rounded-full"
          animate={{
            width: i + 1 === current ? 18 : 6,
            backgroundColor:
              i + 1 <= current ? 'rgb(241 142 153)' : 'rgba(255,255,255,0.22)',
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  )
}

```

### `src/App.tsx`

```tsx
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Stage from './components/Stage'
import { ChoiceGrid, Label, PrimaryButton, TextField } from './components/fields/Fields'
import {
  ANNUAL_REVENUE_RANGES,
  AUTHORITY_OPTIONS,
  EMPTY_ANSWERS,
  PAIN_OPTIONS,
  SITE,
  TIMING_OPTIONS,
  type Answers,
} from './lib/config'
import { sendLead } from './lib/submit'
import { isValidName, isValidPhone, maskPhone } from './lib/utils'

export default function App() {
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS)
  const [step, setStep] = useState(0) // 0 = identificacao, 1..4 = BANT
  const [tentouStep0, setTentouStep0] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [concluido, setConcluido] = useState(false)
  // Vem da resposta do n8n. So e true quando o HSM realmente saiu, entao a tela
  // nunca promete WhatsApp pra quem o backend decidiu nao disparar.
  const [vaiReceberWhats, setVaiReceberWhats] = useState(false)
  // Depois do envio o desfecho roda sozinho, em dois tempos:
  // 6 = o motor disparando pra todos os destinos, 7 = o lead andando no CRM.
  const [desfecho, setDesfecho] = useState(0)
  const parcialEnviado = useRef(false)
  const formRef = useRef<HTMLDivElement>(null)

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) =>
    setAnswers((a) => ({ ...a, [k]: v }))

  // Cena = quantos passos ja foram destravados. 0 e a tela de espera.
  const scene = desfecho > 0 ? desfecho : concluido || enviando ? 5 : step

  const nomeOk = isValidName(answers.nome)
  const foneOk = isValidPhone(answers.whatsapp)

  const avancarStep0 = useCallback(() => {
    setTentouStep0(true)
    if (!nomeOk || !foneOk) return
    setStep(1)
    // Lead parcial: garante que quem abandonar no meio ainda chega no CRM.
    if (!parcialEnviado.current) {
      parcialEnviado.current = true
      void sendLead({ ...answers, nome: answers.nome, whatsapp: answers.whatsapp }, 'parcial')
    }
  }, [answers, nomeOk, foneOk])

  // Cada escolha destrava a proxima cena sozinha, sem botao no meio do caminho.
  const escolher = (campo: keyof Answers, valor: string, proximo: number) => {
    set(campo, valor)
    window.setTimeout(() => setStep(proximo), 260)
  }

  const finalizar = async (timing: string) => {
    set('timing', timing)
    setEnviando(true)
    const r = await sendLead({ ...answers, timing }, 'completo')
    setVaiReceberWhats(r.whatsappEnviado)
    setEnviando(false)
    setConcluido(true)
  }

  // Deixa a tela de "pronto" respirar, depois mostra o motor distribuindo e,
  // por fim, o lead andando no CRM.
  useEffect(() => {
    if (!concluido) return
    const t1 = window.setTimeout(() => setDesfecho(6), 3000)
    const t2 = window.setTimeout(() => setDesfecho(7), 8000)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [concluido])

  // Rola o passo novo pra vista assim que ele aparece.
  useEffect(() => {
    // No passo 0 nao rola nada: rolar na abertura empurra o nome do produto e a
    // headline pra fora da tela, que e justamente o que precisa ser lido primeiro.
    if (step === 0) return
    const el = formRef.current?.querySelector(`[data-step="${step}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [step])

  return (
    <div className="mx-auto flex h-[100dvh] max-w-5xl flex-col lg:max-w-6xl lg:flex-row lg:items-center lg:gap-8 lg:px-8">
      {/* PALCO: fixo no topo no mobile, coluna esquerda no desktop */}
      <div className="shrink-0 px-3 pt-3 lg:w-[46%] lg:px-0 lg:pt-0">
        <div className="h-[38dvh] min-h-[240px] lg:h-[560px]">
          <Stage
            scene={scene}
            answers={answers}
            enviando={enviando}
            whatsappEnviado={vaiReceberWhats}
          />
        </div>
      </div>

      {/* FORMULARIO: a unica parte que rola */}
      <div
        ref={formRef}
        className="no-scrollbar flex-1 overflow-y-auto px-4 pb-10 pt-5 lg:pt-0"
      >
        <header className="mb-5">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-rosa">
            {SITE.brand} · {SITE.produto}
          </p>
          <h1 className="font-display text-[22px] font-black leading-[1.15] lg:text-3xl">
            {SITE.headline}
          </h1>
          <p className="mt-2 text-[13px] leading-snug text-white/65">{SITE.sub}</p>
        </header>

        <div className="space-y-6">
          {/* PASSO 0: identificacao */}
          <section data-step={0}>
            {/* Nao promete "mandamos a demo no WhatsApp": o disparo so acontece
                pra parte dos leads, entao a promessa aqui fica no que sempre
                vale, que e a conversa continuar por ali. */}
            <Label hint="É por onde a gente continua a conversa depois">
              Como você se chama e qual o seu WhatsApp?
            </Label>
            <div className="space-y-2">
              <TextField
                value={answers.nome}
                onChange={(v) => set('nome', v)}
                placeholder="Seu nome"
                autoComplete="name"
                invalid={tentouStep0 && !nomeOk}
                onEnter={avancarStep0}
              />
              <TextField
                value={answers.whatsapp}
                onChange={(v) => set('whatsapp', maskPhone(v))}
                placeholder="(11) 99999-9999"
                inputMode="tel"
                autoComplete="tel"
                invalid={tentouStep0 && !foneOk}
                onEnter={avancarStep0}
              />
              {tentouStep0 && (!nomeOk || !foneOk) && (
                <p className="text-[12px] text-rosa">
                  {!nomeOk
                    ? 'Escreve seu nome pra gente continuar'
                    : 'Confere o WhatsApp com DDD, parece incompleto'}
                </p>
              )}
            </div>
            {step === 0 && (
              <div className="mt-3">
                <PrimaryButton onClick={avancarStep0}>
                  Destravar a minha demo
                </PrimaryButton>
              </div>
            )}
          </section>

          <AnimatePresence>
            {step >= 1 && (
              <Reveal key="s1" step={1}>
                <Label hint="Isso define o tamanho da operação que a gente vai desenhar">
                  Quanto a sua empresa fatura por ano?
                </Label>
                <ChoiceGrid
                  options={ANNUAL_REVENUE_RANGES}
                  value={answers.faturamento}
                  onChange={(v) => escolher('faturamento', v, 2)}
                />
              </Reveal>
            )}

            {step >= 2 && (
              <Reveal key="s2" step={2}>
                <Label hint="Escolha o que mais dói hoje">
                  O que mais trava o seu atendimento?
                </Label>
                <ChoiceGrid
                  options={PAIN_OPTIONS}
                  value={answers.dor}
                  onChange={(v) => escolher('dor', v, 3)}
                />
              </Reveal>
            )}

            {step >= 3 && (
              <Reveal key="s3" step={3}>
                <Label>Quem decide sobre automação de atendimento aí?</Label>
                <ChoiceGrid
                  options={AUTHORITY_OPTIONS}
                  value={answers.authority}
                  onChange={(v) => escolher('authority', v, 4)}
                />
              </Reveal>
            )}

            {step >= 4 && (
              <Reveal key="s4" step={4}>
                <Label hint="Último passo pra destravar a demo completa">
                  Pra quando você quer isso resolvido?
                </Label>
                <ChoiceGrid
                  options={TIMING_OPTIONS}
                  value={answers.timing}
                  onChange={(v) => set('timing', v)}
                />
                <div className="mt-3">
                  <PrimaryButton
                    onClick={() => void finalizar(answers.timing)}
                    disabled={!answers.timing || concluido}
                    loading={enviando}
                  >
                    {concluido ? 'Demo destravada' : 'Destravar a demo completa'}
                  </PrimaryButton>
                </div>
              </Reveal>
            )}
          </AnimatePresence>

          {concluido && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-[13px] leading-snug text-emerald-100"
            >
              {vaiReceberWhats ? (
                <>
                  Recebemos. Fica de olho no WhatsApp {answers.whatsapp}, a mensagem sai
                  em instantes.
                </>
              ) : (
                <>
                  Recebemos, obrigado. Alguém do time da {SITE.brand} vai olhar suas
                  respostas e falar com você.
                </>
              )}
            </motion.p>
          )}

          <p className="safe-bottom pt-2 text-center text-[11px] leading-snug text-white/35">
            Seus dados servem só pro contato comercial da {SITE.brand}. Nada de spam.
          </p>
        </div>
      </div>
    </div>
  )
}

function Reveal({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <motion.section
      data-step={step}
      initial={{ opacity: 0, y: 20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="overflow-hidden"
    >
      {children}
    </motion.section>
  )
}

```
