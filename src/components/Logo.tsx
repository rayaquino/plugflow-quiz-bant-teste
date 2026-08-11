/**
 * Logo oficial da PlugFlow (lockup branco, com o "powered by dtcode" que faz
 * parte da marca). Arquivo em `public/plugflow-logo.svg`, vindo de
 * `E:\CLAUDE\PLUGFLOW\_assets\plugflow_logo_branco.svg`.
 *
 * Entrou no lugar do texto "PLUGFLOW · ORQUESTRADOR DA JORNADA DO CLIENTE", que
 * quebrava em duas linhas e ainda repetia o nome do produto que ja esta no
 * titulo logo abaixo.
 */
export default function Logo({ className = 'h-5' }: { className?: string }) {
  return (
    <img
      src="/plugflow-logo.svg"
      alt="PlugFlow"
      className={className}
      width={1500}
      height={313}
      style={{ width: 'auto' }}
    />
  )
}
