# Migração para o Lovable, parte 3 de 6: cenas 4 e 5

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
