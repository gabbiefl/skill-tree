import type { ReactElement } from 'react'
import type { Estado } from '../dominio/estados'

// Ícones do design (traço de 2,4 px, cantos arredondados), sem biblioteca externa.
// O tamanho vem do CSS: a classe "i" usa 1em, então basta ajustar o font-size do pai.
const FORMAS = {
  cadeado: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  menos: <path d="M6 12h12" />,
  play: <path d="M8.5 5.5v13l10-6.5z" />,
  setaBaixo: <path d="M6 9l6 6 6-6" />,
  setaCima: <path d="M6 15l6-6 6 6" />,
  setaDireita: <path d="M5 12h14M13 6l6 6-6 6" />,
  fechar: <path d="M6 6l12 12M18 6L6 18" />,
  relogio: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  livro: (
    <>
      <path d="M4 5.5C6.5 4 9.5 4 12 6c2.5-2 5.5-2 8-.5V18c-2.5-1.5-5.5-1.5-8 .5-2.5-2-5.5-2-8-.5z" />
      <path d="M12 6v12.5" />
    </>
  ),
  ajuda: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.5a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.2 1-1.2 1.8M12 17h.01" />
    </>
  ),
  raio: <path d="M13 3L5 14h6l-1 7 8-11h-6z" />,
  estrela: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  lapis: <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z" />,
  trocar: <path d="M4 8h14M14 4l4 4-4 4M20 16H6M10 12l-4 4 4 4" />,
  lixeira: <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" />,
  engrenagem: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
} satisfies Record<string, ReactElement>

export type NomeIcone = keyof typeof FORMAS

interface Props {
  nome: NomeIcone
  preenchido?: boolean
  className?: string
}

export default function Icone({ nome, preenchido = false, className }: Props) {
  const classes = ['i', preenchido ? 'f' : '', className ?? ''].filter(Boolean).join(' ')
  return (
    <svg className={classes} viewBox="0 0 24 24" aria-hidden="true">
      {FORMAS[nome]}
    </svg>
  )
}

// O estado nunca depende só da cor: cada um tem também um ícone e um estilo de borda.
const ICONE_DO_ESTADO: Record<Estado, NomeIcone> = {
  concluida: 'check',
  disponivel: 'play',
  bloqueada: 'cadeado',
}

export function IconeEstado({ estado }: { estado: Estado }) {
  return <Icone nome={ICONE_DO_ESTADO[estado]} preenchido={estado === 'disponivel'} />
}
