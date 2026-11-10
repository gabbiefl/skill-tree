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

  // Ícones das áreas (identidade visual, desenhados para este projeto).
  camadas: (
    <>
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 12.5l9 5 9-5M3 17l9 5 9-5" />
    </>
  ),
  codigo: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  gota: <path d="M12 3c3.2 4 6 7 6 10.5a6 6 0 0 1-12 0C6 10 8.8 7 12 3z" />,
  chaves: (
    <path d="M9 4C6.5 4 6.5 6 6.5 8s0 3-3 4c3 1 3 2 3 4s0 4 2.5 4M15 4c2.5 0 2.5 2 2.5 4s0 3 3 4c-3 1-3 2-3 4s0 4-2.5 4" />
  ),
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M7 10l3 2.5-3 2.5M12.5 15.5H17" />
    </>
  ),
  escudo: (
    <>
      <path d="M12 3l7 3v5.5c0 4.5-3 7.5-7 9.5-4-2-7-5-7-9.5V6z" />
      <path d="M8.8 12l2.3 2.3 4.2-4.5" />
    </>
  ),
  atomo: (
    <>
      <circle cx="12" cy="12" r="1.6" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
    </>
  ),

  // Ícones das prévias das carreiras "em breve".
  servidor: (
    <>
      <rect x="3" y="4" width="18" height="6.5" rx="2" />
      <rect x="3" y="13.5" width="18" height="6.5" rx="2" />
      <path d="M7 7.25h.01M7 16.75h.01" />
    </>
  ),
  banco: (
    <>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </>
  ),
  nuvem: <path d="M7 18a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 9.5 4.3 4.3 0 0 1 17.5 18z" />,
  grafico: <path d="M4 20h16M7 20v-7M12 20V5M17 20V10" />,
  tabela: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M3 15h18M9.5 10v10" />
    </>
  ),
  celular: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </>
  ),

  // Ícones dos níveis: a planta cresce de Semente (1) a Árvore (5).
  semente: (
    <>
      <path d="M3 20h18" />
      <path d="M12 18c-3 0-4.5-2-4.5-4.5S9.5 8 12 8s4.5 3 4.5 5.5S15 18 12 18z" />
      <path d="M12 8V5" />
    </>
  ),
  broto: (
    <>
      <path d="M12 21v-9" />
      <path d="M12 12c0-4-3-6.5-7.5-6.5C4.5 9.5 7 12 12 12z" />
      <path d="M12 14c0-3 2.5-5 6.5-5 0 3-2.5 5-6.5 5z" />
    </>
  ),
  muda: (
    <>
      <path d="M12 21V6" />
      <path d="M12 14c-1-3.5-4-5-8-4 1 4 4 5.5 8 4z" />
      <path d="M12 10.5c1-3.5 4-5 8-4-1 4-4 5.5-8 4z" />
      <path d="M12 6c0-1.5.5-2.5 1.5-3" />
    </>
  ),
  galho: (
    <>
      <path d="M4 21c3-1 9-5 13-14" />
      <path d="M8.5 16.5c-.5-3 1-5.5 5-6" />
      <path d="M12 12c2-2.5 5-3 7.5-2.5" />
      <path d="M15 7c.5-2 2-3.5 4.5-3.5 0 2.5-1.5 4-4.5 3.5z" />
    </>
  ),
  arvore: (
    <>
      <path d="M12 21v-7" />
      <path d="M12 17l-3-3M12 15l3-3" />
      <circle cx="12" cy="9" r="6" />
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
