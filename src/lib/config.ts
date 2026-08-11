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
