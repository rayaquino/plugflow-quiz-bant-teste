# Migração para o Lovable, parte 4 de 6: cenas 6 e 7

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
