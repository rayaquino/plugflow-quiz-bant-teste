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
    <div className="relative h-full overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-roxo-900/70 to-fundo shadow-2xl">
      {/* brilho de fundo da marca */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-magenta/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-roxo-600/35 blur-3xl" />

      {/* Marca d'agua so na tela de espera, que e onde sobra vazio. Nas cenas
          com conteudo ela encostava no texto do rodape e virava ruido, entao
          nao vale a pena ganhar marca e perder leitura. */}
      {scene === 0 && (
        <img
          src="/plugflow-logo.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2.5 right-3 w-[34%] opacity-[0.09]"
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          /* pb-3.5 reserva a faixa dos indicadores (eles vivem em bottom-2.5 e
             tem 4px), senao sobrepoem o rodape das cenas 1, 3 e 4.
             Era pb-5, folga que nao existe em tela de celular.
             `overflow-y-auto` e rede de seguranca, nao o layout esperado: as
             cenas foram ajustadas pra caber em 205px, que e o que sobra num
             iPhone com a barra do Safari aberta. Sem isso, cena que estoura
             some pra fora do `overflow-hidden` do Palco e o topo fica
             INALCANCAVEL, que foi o bug do case e da tela final no iPhone. */
          className="no-scrollbar relative h-full overflow-y-auto pb-3.5"
        >
          {scene === 0 && <SceneIdle />}
          {scene === 1 && <Scene1Entrada active nome={answers.nome} />}
          {scene === 2 && (
            <Scene2Qualifica
              active
              faturamento={answers.faturamento}
              empresa={answers.empresa}
            />
          )}
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
    <div className="flex min-h-full flex-col items-center justify-center px-6 text-center">
      {/* Saiu o circulo "IA" (a marca certa e a PlugFlow, nao um selo generico)
          e saiu a seta, que repetia o que os pontinhos ja dizem. Sobraram tres
          elementos em vez de cinco. */}
      <motion.div
        className="mb-3 h-2 w-2 rounded-full bg-brand-grad"
        animate={{ scale: [1, 1.9, 1], opacity: [1, 0.4, 1] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />
      <p className="font-display text-[16px] font-black leading-tight">
        A sua demo <span className="text-grad">começa aqui</span>
      </p>
      <p className="mt-1.5 text-[12px] leading-snug text-white/60">
        Preencha o primeiro campo e veja a jornada do seu cliente rodando
      </p>
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
