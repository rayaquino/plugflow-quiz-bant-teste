# Migração para o Lovable, parte 1 de 3: base e configuração

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
