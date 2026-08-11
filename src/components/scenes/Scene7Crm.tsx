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
