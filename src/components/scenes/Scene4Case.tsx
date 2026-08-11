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
    <div className="relative flex h-full flex-col justify-center px-3.5 py-2">
      {/* Foto de consultorio, escurecida, atras do card.
          Escolhi uma sala VAZIA de proposito: reforca o "bracos cruzados" do
          case e nao mostra pessoa nenhuma, entao nao da pra confundir com foto
          de funcionario real do cliente.
          Fonte: Pexels (pexels.com/photo/a-dental-equipment-in-the-clinic-6812453),
          licenca livre inclusive para uso comercial. */}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={active ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 26 }}
        /* `bg-fundo/70` em vez de `bg-white/5`: o card precisa de fundo proprio
           pra foto nao passar por tras do texto e comer a legibilidade. */
        /* `shrink-0` junto com `overflow-hidden`: overflow diferente de visible
           zera o tamanho minimo automatico do item flex, e sem isso o card
           encolhe e corta a propria ultima frase. */
        className="relative shrink-0 overflow-hidden rounded-2xl border border-white/15 p-3"
      >
        {/* Foto DENTRO do card: fora dele o card ocupava o palco inteiro e a
            imagem nao aparecia. Sala vazia de proposito, reforca o "bracos
            cruzados" e nao mostra pessoa nenhuma, entao nao da pra confundir
            com funcionario real do cliente.
            Fonte: Pexels (a-dental-equipment-in-the-clinic-6812453), licenca
            livre inclusive comercial. */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <img
            src="/clinica.jpg"
            alt=""
            className="h-full w-full object-cover opacity-[0.42]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-fundo/45 via-fundo/80 to-fundo/95" />
        </div>
        <div className="relative">
        {/* "case recente" no lugar de "esta semana" (decisao do Renan): o fato
            de ser recente era autorizado, mas data exata envelhece sozinha e a
            pagina fica no ar por meses afirmando algo que deixou de ser verdade. */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-white/60">
              {CASE.setor}
            </p>
            {/* "imagem ilustrativa" nao e detalhe juridico chato: sem isso, foto
                de clinica dentro de um card escrito "Caso real de cliente" e
                lida como sendo a clinica DAQUELE cliente, que e justamente o que
                a regra de nao identificar existe pra evitar. */}
            <p className="text-[9px] font-semibold uppercase tracking-wider text-white/40">
              {CASE.quando} · imagem ilustrativa
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
        </div>
      </motion.div>

      {/* Dado publico, com fonte e autor, separado do case de proposito: quem
          responde por ele e a HBR, nao a PlugFlow falando de um cliente que
          nao pode ser nomeado nem checado. */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 4.2 }}
        /* `relative` obrigatorio: sem isso a camada da foto, que e absoluta,
           pinta por cima desta linha e some com a fonte do dado. */
        className="relative mt-1.5 px-1 text-center text-[9.5px] leading-tight text-white/45"
      >
        Responder na primeira hora torna a empresa cerca de{' '}
        <span className="font-bold text-white/70">7 vezes mais propensa</span> a
        qualificar o lead do que esperar mais uma hora. Harvard Business Review, 2011
      </motion.p>
    </div>
  )
}
