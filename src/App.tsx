import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
import { sendLead } from './lib/submit'
import { isValidName, isValidPhone, maskPhone } from './lib/utils'

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
  const parcialEnviado = useRef(false)
  const formRef = useRef<HTMLDivElement>(null)

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) =>
    setAnswers((a) => ({ ...a, [k]: v }))

  // Cena = quantos passos ja foram destravados. 0 e a tela de espera.
  const scene = desfecho > 0 ? desfecho : concluido || enviando ? 5 : step

  const nomeOk = isValidName(answers.nome)
  const foneOk = isValidPhone(answers.whatsapp)

  const avancarStep0 = useCallback(() => {
    setTentouStep0(true)
    if (!nomeOk || !foneOk) return
    setStep(1)
    // Lead parcial: garante que quem abandonar no meio ainda chega no CRM.
    if (!parcialEnviado.current) {
      parcialEnviado.current = true
      void sendLead({ ...answers, nome: answers.nome, whatsapp: answers.whatsapp }, 'parcial')
    }
  }, [answers, nomeOk, foneOk])

  // Cada escolha destrava a proxima cena sozinha, sem botao no meio do caminho.
  const escolher = (campo: keyof Answers, valor: string, proximo: number) => {
    set(campo, valor)
    window.setTimeout(() => setStep(proximo), 260)
  }

  const finalizar = async (timing: string) => {
    set('timing', timing)
    setEnviando(true)
    const r = await sendLead({ ...answers, timing }, 'completo')
    setVaiReceberWhats(r.whatsappEnviado)
    setEnviando(false)
    setConcluido(true)
  }

  // Deixa a tela de "pronto" respirar, depois mostra o motor distribuindo e,
  // por fim, o lead andando no CRM.
  useEffect(() => {
    if (!concluido) return
    const t1 = window.setTimeout(() => setDesfecho(6), 3000)
    const t2 = window.setTimeout(() => setDesfecho(7), 8000)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [concluido])

  // Rola o passo novo pra vista assim que ele aparece.
  useEffect(() => {
    // No passo 0 nao rola nada: rolar na abertura empurra o nome do produto e a
    // headline pra fora da tela, que e justamente o que precisa ser lido primeiro.
    if (step === 0) return
    const el = formRef.current?.querySelector(`[data-step="${step}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [step])

  return (
    <div className="mx-auto flex h-[100dvh] max-w-5xl flex-col lg:max-w-6xl lg:flex-row lg:items-center lg:gap-8 lg:px-8">
      {/* PALCO: fixo no topo no mobile, coluna esquerda no desktop */}
      <div className="shrink-0 px-3 pt-3 lg:w-[46%] lg:px-0 lg:pt-0">
        <div className="h-[38dvh] min-h-[240px] lg:h-[560px]">
          <Stage
            scene={scene}
            answers={answers}
            enviando={enviando}
            whatsappEnviado={vaiReceberWhats}
          />
        </div>
      </div>

      {/* FORMULARIO: a unica parte que rola */}
      <div
        ref={formRef}
        className="no-scrollbar flex-1 overflow-y-auto px-4 pb-10 pt-5 lg:pt-0"
      >
        <header className="mb-5">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-rosa">
            {SITE.brand} · {SITE.produto}
          </p>
          <h1 className="font-display text-[22px] font-black leading-[1.15] lg:text-3xl">
            {SITE.headline}
          </h1>
          <p className="mt-2 text-[13px] leading-snug text-white/65">{SITE.sub}</p>
        </header>

        <div className="space-y-6">
          {/* PASSO 0: identificacao */}
          <section data-step={0}>
            {/* Nao promete "mandamos a demo no WhatsApp": o disparo so acontece
                pra parte dos leads, entao a promessa aqui fica no que sempre
                vale, que e a conversa continuar por ali. */}
            <Label hint="É por onde a gente continua a conversa depois">
              Como você se chama e qual o seu WhatsApp?
            </Label>
            <div className="space-y-2">
              <TextField
                value={answers.nome}
                onChange={(v) => set('nome', v)}
                placeholder="Seu nome"
                autoComplete="name"
                invalid={tentouStep0 && !nomeOk}
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
              {tentouStep0 && (!nomeOk || !foneOk) && (
                <p className="text-[12px] text-rosa">
                  {!nomeOk
                    ? 'Escreve seu nome pra gente continuar'
                    : 'Confere o WhatsApp com DDD, parece incompleto'}
                </p>
              )}
            </div>
            {step === 0 && (
              <div className="mt-3">
                <PrimaryButton onClick={avancarStep0}>
                  Destravar a minha demo
                </PrimaryButton>
              </div>
            )}
          </section>

          <AnimatePresence>
            {step >= 1 && (
              <Reveal key="s1" step={1}>
                <Label hint="Isso define o tamanho da operação que a gente vai desenhar">
                  Quanto a sua empresa fatura por ano?
                </Label>
                <ChoiceGrid
                  options={ANNUAL_REVENUE_RANGES}
                  value={answers.faturamento}
                  onChange={(v) => escolher('faturamento', v, 2)}
                />
              </Reveal>
            )}

            {step >= 2 && (
              <Reveal key="s2" step={2}>
                <Label hint="Escolha o que mais dói hoje">
                  O que mais trava o seu atendimento?
                </Label>
                <ChoiceGrid
                  options={PAIN_OPTIONS}
                  value={answers.dor}
                  onChange={(v) => escolher('dor', v, 3)}
                />
              </Reveal>
            )}

            {step >= 3 && (
              <Reveal key="s3" step={3}>
                <Label>Quem decide sobre automação de atendimento aí?</Label>
                <ChoiceGrid
                  options={AUTHORITY_OPTIONS}
                  value={answers.authority}
                  onChange={(v) => escolher('authority', v, 4)}
                />
              </Reveal>
            )}

            {step >= 4 && (
              <Reveal key="s4" step={4}>
                <Label hint="Último passo pra destravar a demo completa">
                  Pra quando você quer isso resolvido?
                </Label>
                <ChoiceGrid
                  options={TIMING_OPTIONS}
                  value={answers.timing}
                  onChange={(v) => set('timing', v)}
                />
                <div className="mt-3">
                  <PrimaryButton
                    onClick={() => void finalizar(answers.timing)}
                    disabled={!answers.timing || concluido}
                    loading={enviando}
                  >
                    {concluido ? 'Demo destravada' : 'Destravar a demo completa'}
                  </PrimaryButton>
                </div>
              </Reveal>
            )}
          </AnimatePresence>

          {concluido && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-[13px] leading-snug text-emerald-100"
            >
              {vaiReceberWhats ? (
                <>
                  Recebemos. Fica de olho no WhatsApp {answers.whatsapp}, a mensagem sai
                  em instantes.
                </>
              ) : (
                <>
                  Recebemos, obrigado. Alguém do time da {SITE.brand} vai olhar suas
                  respostas e falar com você.
                </>
              )}
            </motion.p>
          )}

          <p className="safe-bottom pt-2 text-center text-[11px] leading-snug text-white/35">
            Seus dados servem só pro contato comercial da {SITE.brand}. Nada de spam.
          </p>
        </div>
      </div>
    </div>
  )
}

function Reveal({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <motion.section
      data-step={step}
      initial={{ opacity: 0, y: 20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="overflow-hidden"
    >
      {children}
    </motion.section>
  )
}
