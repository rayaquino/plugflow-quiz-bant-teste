import { modoTeste } from './submit'

/**
 * Pixel do Meta da PlugFlow (conta plugflowoficial).
 *
 * Injetado por codigo, nao pelo index.html, porque o projeto no Lovable roda
 * em TanStack Start e o shell de HTML nao e necessariamente o `index.html`
 * daqui. Injetando em runtime funciona nos dois lugares.
 *
 * Em modo teste nada e carregado nem disparado: evento de teste sujaria o sinal
 * da campanha, que e o que o Meta usa pra otimizar entrega.
 */
const PIXEL_ID = '2122212278583984'

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void
  queue?: unknown[]
  push?: unknown
  loaded?: boolean
  version?: string
}

declare global {
  interface Window {
    fbq?: Fbq
    _fbq?: Fbq
  }
}

export function iniciarPixel() {
  if (typeof window === 'undefined' || modoTeste()) return
  if (window.fbq) return

  // Snippet oficial do Meta, escrito de forma legivel. A fila (`queue`) existe
  // pra nao perder evento disparado antes do script terminar de carregar.
  const fbq: Fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args)
    else fbq.queue?.push(args)
  }
  fbq.queue = []
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.push = fbq
  window.fbq = fbq
  window._fbq = fbq

  const s = document.createElement('script')
  s.async = true
  s.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(s)

  window.fbq('init', PIXEL_ID)
  window.fbq('track', 'PageView')
}

/**
 * Só no envio 'completo' que deu certo. Disparar em toda tentativa infla o
 * sinal e ensina o Meta a otimizar pra quem nao virou lead de verdade.
 */
export function marcarLead() {
  if (typeof window === 'undefined' || modoTeste()) return
  window.fbq?.('track', 'Lead')
}
