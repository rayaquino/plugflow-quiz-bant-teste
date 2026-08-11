/**
 * Logo oficial da PlugFlow, versao gradiente: e a que o site real usa no
 * header (P em gradiente rosa/magenta + wordmark + "powered by dtcode").
 * Arquivo em `public/plugflow-logo-gradiente.svg`, vindo de
 * `E:\CLAUDE\PLUGFLOW\_assets\plugflow_logo_gradiente.svg`.
 *
 * A versao branca (`plugflow-logo.svg`) continua no projeto e e a usada na
 * marca d'agua do palco, onde o gradiente sumiria.
 *
 * Entrou no lugar do texto "PLUGFLOW · ORQUESTRADOR DA JORNADA DO CLIENTE", que
 * quebrava em duas linhas e ainda repetia o nome do produto que ja esta no
 * titulo logo abaixo.
 */
export default function Logo({ className = 'h-5' }: { className?: string }) {
  return (
    <img
      src="/plugflow-logo-gradiente.svg"
      alt="PlugFlow"
      className={className}
      width={1500}
      height={313}
      style={{ width: 'auto' }}
    />
  )
}
