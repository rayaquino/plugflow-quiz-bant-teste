import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Feixes from './components/Feixes'
import Logo from './components/Logo'
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
import { iniciarPixel, marcarLead } from './lib/pixel'
import { modoTeste, sendLead } from './lib/submit'
import { cx, firstName, isValidName, isValidPhone, maskPhone } from './lib/utils'

/**
 * Mecanica estilo Typeform: uma pergunta por vez, sempre no mesmo lugar da tela.
 * A pergunta atual sai e a proxima entra no lugar dela, sem a pagina rolar.
 * O palco da animacao fica fixo em cima e nunca sai de vista.
 *
 * O mapeamento campo -> cena continua o mesmo de antes: cada resposta destrava
 * a cena seguinte.
 */
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
  // Envio que falhou NAO pode virar tela de "recebemos": a pessoa ficaria
  // esperando um contato que ninguem sabe que precisa fazer.
  const [erroEnvio, setErroEnvio] = useState(false)
  const parcialEnviado = useRef(false)
  // Trava de reentrancia. O botao ja fica desabilitado durante o envio, mas
  // isso e o ultimo anteparo contra dois disparos do 'completo' saindo juntos,
  // que e o que gera task duplicada e template repetido no WhatsApp.
  const enviandoRef = useRef(false)

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) =>
    setAnswers((a) => ({ ...a, [k]: v }))

  const scene = desfecho > 0 ? desfecho : concluido || enviando ? 5 : step

  const nomeOk = isValidName(answers.nome)
  const empresaOk = answers.empresa.trim().length >= 2
  const foneOk = isValidPhone(answers.whatsapp)

  const avancarStep0 = useCallback(() => {
    setTentouStep0(true)
    if (!nomeOk || !empresaOk || !foneOk) return
    setStep(1)
    // Lead parcial: garante que quem abandonar no meio ainda chega no CRM.
    if (!parcialEnviado.current) {
      parcialEnviado.current = true
      void sendLead(answers, 'parcial')
    }
  }, [answers, nomeOk, empresaOk, foneOk])

  // Cada escolha destrava a proxima cena sozinha, sem botao no meio do caminho.
  const escolher = (campo: keyof Answers, valor: string, proximo: number) => {
    set(campo, valor)
    window.setTimeout(() => setStep(proximo), 260)
  }

  const finalizar = async (timing: string) => {
    // Segundo disparo enquanto o primeiro esta no ar: ignora.
    if (enviandoRef.current || (concluido && !erroEnvio)) return
    enviandoRef.current = true

    set('timing', timing)
    setErroEnvio(false)
    setEnviando(true)
    const r = await sendLead({ ...answers, timing }, 'completo')
    setEnviando(false)
    enviandoRef.current = false

    if (!r.ok) {
      // Botao continua clicavel de proposito. Retentar nao duplica lead: o
      // leadId e estavel na sessao e o backend casa por ele e pelo E.164.
      setErroEnvio(true)
      return
    }

    setVaiReceberWhats(r.whatsappEnviado)
    setConcluido(true)
    marcarLead()
  }

  // PageView do Pixel, uma vez por carregamento.
  useEffect(() => {
    iniciarPixel()
  }, [])

  useEffect(() => {
    if (!concluido) return
    const t1 = window.setTimeout(() => setDesfecho(6), 3000)
    const t2 = window.setTimeout(() => setDesfecho(7), 8000)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [concluido])

  const podeVoltar = step > 0 && !enviando && !concluido
  // Precisa ser visivel na tela, nao so no console: sem isso alguem testa,
  // ve "demo destravada" e acha que entrou lead de verdade (ou o contrario).
  //
  // Resolvido DEPOIS da montagem, nunca durante o render. Com SSR os dois lados
  // discordam: no servidor nao existe window e `modoTeste()` da false, no cliente
  // dentro de iframe da true. Isso trocaria a arvore logo abaixo da raiz entre o
  // HTML do servidor e o primeiro render do cliente, e o mismatch mata a
  // hidratacao da pagina inteira: renderiza tudo e nao responde a nada.
  // O primeiro render do cliente precisa bater com o servidor, entao comeca
  // false e o efeito liga o aviso depois.
  //
  // So o AVISO na tela mudou. A trava de verdade continua chamando `modoTeste()`
  // na hora do envio (submit.ts), que e o que impede o POST sair do preview.
  const [teste, setTeste] = useState(false)
  useEffect(() => {
    setTeste(modoTeste())
  }, [])

  // Passo que nao cabe na tela do celular continua rolavel, mas a barra de
  // rolagem e escondida de proposito, entao nada avisava. Sem aviso, tela
  // rolavel e lida como tela QUEBRADA: foi o que aconteceu no iPhone, com o
  // campo de WhatsApp cortado ao meio e o botao fora de vista.
  const areaRolagem = useRef<HTMLDivElement>(null)
  const [sobra, setSobra] = useState(false)

  const conferirSobra = useCallback(() => {
    const el = areaRolagem.current
    if (!el) return
    // 4px de folga: arredondamento de subpixel deixa 1px sobrando numa area
    // que ja chegou no fim, e a setinha ficaria acesa pra sempre.
    setSobra(el.scrollHeight - el.clientHeight - el.scrollTop > 4)
  }, [])

  useEffect(() => {
    const el = areaRolagem.current
    if (!el) return

    // Observa a CAIXA (girar o aparelho, teclado do iOS abrindo) e tambem o
    // CONTEUDO. O conteudo precisa entrar porque ele cresce sem ninguem mexer
    // no DOM: a Lexend chega da rede depois do primeiro render e o texto
    // reflui. Sem isso a setinha congela no valor que leu antes da fonte
    // carregar e fica acesa numa tela que cabe inteira.
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(conferirSobra) : null

    // O filho troca de identidade a cada passo, entao reassinar faz parte.
    const assinar = () => {
      if (!ro) return
      ro.disconnect()
      ro.observe(el)
      for (const filho of Array.from(el.children)) ro.observe(filho)
    }

    // Troca de passo. Tem que ser observer e nao dependencia de `step`: o passo
    // novo so entra DEPOIS que o antigo sai (AnimatePresence com mode="wait"),
    // entao medir na hora que `step` muda le a altura do passo velho.
    // De proposito sem `attributes`: a framer-motion mexe em transform e
    // opacity quadro a quadro e isso viraria enxurrada de callback.
    const mo =
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver(() => {
            assinar()
            conferirSobra()
          })
        : null
    mo?.observe(el, { childList: true, subtree: true, characterData: true })

    assinar()
    conferirSobra()

    // A primeira medida sai com a fonte de sistema, porque a Lexend ainda esta
    // vindo da rede. Ela e mais estreita, o texto ocupa mais linhas e a conta
    // da sobra sai errada por ~20px. Conferir de novo quando a fonte assentar
    // e o que impede a setinha de ficar acesa numa tela que cabe inteira.
    const quandoAssentar = document.fonts?.ready
    void quandoAssentar?.then(conferirSobra).catch(() => {})
    const quadro = requestAnimationFrame(conferirSobra)

    return () => {
      cancelAnimationFrame(quadro)
      ro?.disconnect()
      mo?.disconnect()
    }
  }, [conferirSobra])

  return (
    <div className="relative mx-auto flex h-[100dvh] max-w-5xl flex-col overflow-hidden lg:max-w-6xl lg:flex-row lg:items-center lg:gap-8 lg:px-8">
      <Feixes />
      {teste && (
        <div className="pointer-events-none absolute left-1/2 top-1 z-50 -translate-x-1/2 rounded-full border border-amber-400/50 bg-amber-400/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-200">
          Modo teste · nada é enviado
        </div>
      )}
      {/* PALCO: fixo em cima no mobile, coluna esquerda no desktop */}
      <div className="shrink-0 px-3 pt-3 lg:w-[46%] lg:px-0 lg:pt-0">
        {/* 38dvh e o teto pra lista de 6 opcoes caber embaixo. NAO aumentar:
            cada ponto daqui sai do formulario, e o passo da dor (6 opcoes) ja
            e o mais apertado da tela.
            Num iPhone com a barra do Safari aberta isso da ~252px, e o Palco
            entrega ~236px pra cena depois da faixa dos indicadores. As cenas
            foram medidas nesse teto: quem nao coubesse antes era CORTADA em
            silencio, porque o Palco e `overflow-hidden`.
            O piso subiu de 225 pra 240 por causa do iPhone 13 mini e afins
            (tela de 629px): neles 38dvh fica abaixo do piso, e com 225 a cena
            do case perdia a linha da fonte da Harvard Business Review. */}
        <div className="h-[38dvh] min-h-[240px] lg:h-[560px]">
          <Stage
            scene={scene}
            answers={answers}
            enviando={enviando}
            whatsappEnviado={vaiReceberWhats}
          />
        </div>
      </div>

      {/* PERGUNTA: sempre uma so, sempre no mesmo lugar */}
      <div className="flex min-h-0 flex-1 flex-col px-4 pb-2 pt-3 lg:pb-3 lg:pt-0">
        <div className="relative flex min-h-0 flex-1 flex-col">
        {/* `my-auto` no filho em vez de `justify-center` no pai: com
            justify-center, passo que nao cabe na tela tem o TOPO cortado e
            fica inalcancavel na rolagem. */}
        <div
          ref={areaRolagem}
          onScroll={conferirSobra}
          className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto py-1"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={concluido ? 'fim' : step}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -26 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="my-auto w-full"
            >
              {concluido ? (
                <Concluido
                  vaiReceberWhats={vaiReceberWhats}
                  whatsapp={answers.whatsapp}
                  nome={answers.nome}
                />
              ) : (
                <Passo
                  step={step}
                  answers={answers}
                  set={set}
                  escolher={escolher}
                  avancarStep0={avancarStep0}
                  finalizar={finalizar}
                  tentouStep0={tentouStep0}
                  nomeOk={nomeOk}
                  empresaOk={empresaOk}
                  foneOk={foneOk}
                  enviando={enviando}
                  erroEnvio={erroEnvio}
                  concluido={concluido}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Aviso de que TEM MAIS COISA EMBAIXO. A area de rolagem esconde a
            barra (`no-scrollbar`), entao um passo mais alto que a tela nao
            parecia rolavel, parecia CORTADO: foi assim que a tela de
            identificacao chegou no iPhone do Renan, com o campo de WhatsApp
            pela metade e o botao invisivel. So aparece quando sobra mesmo. */}
        <div
          aria-hidden="true"
          className={cx(
            // `lg:hidden` de proposito: no desktop o formulario cabe inteiro em
            // todos os passos (medido em 1440x900 e 1280x720, sobra 0), entao a
            // faixa so teria como pintar por cima do botao principal.
            'pointer-events-none absolute inset-x-0 bottom-0 flex h-6 items-end justify-center bg-gradient-to-t from-fundo to-transparent transition-opacity duration-200 lg:hidden',
            sobra ? 'opacity-100' : 'opacity-0',
          )}
        >
          <motion.span
            className="text-[13px] leading-none text-white/45"
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            ↓
          </motion.span>
        </div>
        </div>

        <div className="safe-bottom flex shrink-0 items-center justify-between gap-3 pt-2">
          {podeVoltar ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="rounded-lg px-2 py-1 text-[12px] font-semibold text-white/45 transition hover:text-white/80"
            >
              ← Voltar
            </button>
          ) : (
            <span />
          )}
          {/* Curto porque a Lexend e mais larga que a fonte anterior e a versao
              longa passou a quebrar em duas linhas em cima do botao Voltar. */}
          <p className="whitespace-nowrap text-right text-[10px] leading-snug text-white/30">
            Uso só para contato comercial
          </p>
        </div>
      </div>
    </div>
  )
}

type PassoProps = {
  step: number
  answers: Answers
  set: <K extends keyof Answers>(k: K, v: Answers[K]) => void
  escolher: (campo: keyof Answers, valor: string, proximo: number) => void
  avancarStep0: () => void
  finalizar: (timing: string) => void
  tentouStep0: boolean
  nomeOk: boolean
  empresaOk: boolean
  foneOk: boolean
  enviando: boolean
  erroEnvio: boolean
  concluido: boolean
}

function Passo({
  step,
  answers,
  set,
  escolher,
  avancarStep0,
  finalizar,
  tentouStep0,
  nomeOk,
  empresaOk,
  foneOk,
  enviando,
  erroEnvio,
  concluido,
}: PassoProps) {
  if (step === 0) {
    return (
      <div>
        {/* O logo substitui o eyebrow de texto. Menos uma linha na tela e
            some a repeticao do nome do produto, que ja esta no titulo. */}
        {/* Tudo aqui e uma casa menor no celular que no desktop: este passo e o
            unico com titulo + subtitulo + tres campos + botao juntos, e com os
            tamanhos antigos o botao caia fora da tela num iPhone. */}
        <Logo className="mb-2 h-4 lg:mb-3 lg:h-5" />
        <h1 className="font-display text-[19px] font-black leading-[1.15] lg:text-3xl">
          {SITE.headline}
        </h1>
        <p className="mb-3 mt-1.5 text-[12.5px] leading-snug text-white/65 lg:mb-4 lg:mt-2 lg:text-[13px]">
          {SITE.sub}
        </p>

        {/* Nome e WhatsApp continuam juntos: sao um bloco so ("como te chamo e
            onde falo com voce"), e separar adiaria a primeira cena. */}
        <Label hint="É por onde a gente continua a conversa depois">
          Seu nome, sua empresa e seu WhatsApp
        </Label>
        <div className="space-y-1.5 lg:space-y-2">
          <TextField
            value={answers.nome}
            onChange={(v) => set('nome', v)}
            placeholder="Seu nome"
            autoComplete="name"
            invalid={tentouStep0 && !nomeOk}
            onEnter={avancarStep0}
          />
          {/* Funil B2B: sem o nome da empresa o vendedor liga sem saber pra
              quem esta ligando. */}
          <TextField
            value={answers.empresa}
            onChange={(v) => set('empresa', v)}
            placeholder="Nome da empresa"
            autoComplete="organization"
            invalid={tentouStep0 && !empresaOk}
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
          {tentouStep0 && (!nomeOk || !empresaOk || !foneOk) && (
            <p className="text-[12px] text-rosa">
              {!nomeOk
                ? 'Escreve seu nome pra gente continuar'
                : !empresaOk
                  ? 'Falta o nome da empresa'
                  : 'Confere o WhatsApp com DDD, parece incompleto'}
            </p>
          )}
        </div>
        <div className="mt-2.5 lg:mt-3">
          <PrimaryButton onClick={avancarStep0}>Destravar a minha demo</PrimaryButton>
        </div>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div>
        <Label hint="Isso define o tamanho da operação que a gente vai desenhar">
          Quanto a sua empresa fatura por ano?
        </Label>
        <ChoiceGrid
          options={ANNUAL_REVENUE_RANGES}
          value={answers.faturamento}
          onChange={(v) => escolher('faturamento', v, 2)}
        />
      </div>
    )
  }

  if (step === 2) {
    return (
      <div>
        <Label hint="Escolha o que mais dói hoje">
          O que mais trava o seu atendimento?
        </Label>
        <ChoiceGrid
          options={PAIN_OPTIONS}
          value={answers.dor}
          onChange={(v) => escolher('dor', v, 3)}
        />
      </div>
    )
  }

  if (step === 3) {
    return (
      <div>
        <Label>Quem decide sobre automação de atendimento aí?</Label>
        <ChoiceGrid
          options={AUTHORITY_OPTIONS}
          value={answers.authority}
          onChange={(v) => escolher('authority', v, 4)}
        />
      </div>
    )
  }

  return (
    <div>
      <Label hint="Último passo pra destravar a demo completa">
        Pra quando você quer isso resolvido?
      </Label>
      <ChoiceGrid
        options={TIMING_OPTIONS}
        value={answers.timing}
        onChange={(v) => set('timing', v)}
      />
      {erroEnvio && (
        <p className="mt-3 rounded-xl border border-rosa/40 bg-rosa/10 px-3 py-2 text-[12px] leading-snug text-rosa">
          Não consegui enviar suas respostas agora. Confere a conexão e toca de novo,
          que eu tento outra vez.
        </p>
      )}
      <div className="mt-3">
        <PrimaryButton
          onClick={() => void finalizar(answers.timing)}
          disabled={!answers.timing || (concluido && !erroEnvio)}
          loading={enviando}
        >
          {erroEnvio ? 'Tentar de novo' : 'Destravar a demo completa'}
        </PrimaryButton>
      </div>
    </div>
  )
}

function Concluido({
  vaiReceberWhats,
  whatsapp,
  nome,
}: {
  vaiReceberWhats: boolean
  whatsapp: string
  nome: string
}) {
  const primeiro = firstName(nome) || 'você'
  const linkWhats = `https://wa.me/${SITE.whatsappNumeroWa}?text=${encodeURIComponent(
    `Oi! Sou ${primeiro}, acabei de destravar minha demo no quiz da PlugFlow e quero solicitar uma demonstração.`,
  )}`

  return (
    <div className="text-center">
      <h2 className="font-display text-[20px] font-black leading-tight">
        Demo destravada
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-snug text-white/70">
        {vaiReceberWhats
          ? `Fica de olho no WhatsApp ${whatsapp}, a mensagem sai em instantes.`
          : `Alguém do time da ${SITE.brand} vai olhar suas respostas e falar com você.`}
      </p>
      <p className="mt-3 text-[11px] font-semibold text-white/45">
        Continue assistindo aqui em cima
      </p>

      <a
        href={linkWhats}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-[#0C0024] shadow-lg shadow-[#25D366]/20 transition-transform active:scale-95"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.27 4.9L2 22l5.25-1.38a9.96 9.96 0 0 0 4.79 1.22h.01c5.52 0 10-4.48 10-10s-4.49-9.84-10.01-9.84Zm0 18.15h-.01a8.14 8.14 0 0 1-4.16-1.14l-.3-.18-3.11.82.83-3.03-.2-.31a8.15 8.15 0 0 1-1.25-4.31c0-4.51 3.67-8.18 8.19-8.18a8.14 8.14 0 0 1 8.18 8.18c0 4.51-3.68 8.15-8.17 8.15Zm4.48-6.12c-.25-.12-1.45-.71-1.67-.8-.22-.08-.39-.12-.55.13-.16.24-.63.79-.78.96-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.45-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.24-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42-.14-.01-.31-.01-.47-.01-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.16 1.73 2.64 4.2 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28Z" />
        </svg>
        Solicitar demo
      </a>
    </div>
  )
}
