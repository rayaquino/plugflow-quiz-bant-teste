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
