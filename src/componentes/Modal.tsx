import { useEffect, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import Icone from './Icones'

interface Props {
  titulo: string
  descricao?: ReactNode
  larga?: boolean
  // Modal aberto por cima de outro (ex.: sugestão sobre o modal de conhecimentos).
  porCima?: boolean
  onFechar: () => void
  rodape: ReactNode
  children: ReactNode
}

// Casca comum dos modais: fundo escurecido, cabeçalho, corpo rolável e rodapé.
// Acessibilidade: foco vai para o modal ao abrir e volta ao elemento anterior ao fechar;
// Esc fecha (o evento só chega ao modal que está com o foco, o de cima).
export default function Modal({ titulo, descricao, larga, porCima, onFechar, rodape, children }: Props) {
  const caixa = useRef<HTMLElement>(null)

  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null
    caixa.current?.focus()
    return () => anterior?.focus?.()
  }, [])

  function aoTeclar(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onFechar()
    }
  }

  return (
    <div className={`scrim${porCima ? ' topo' : ''}`}>
      <section
        ref={caixa}
        className={`md${larga ? ' larga' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal"
        tabIndex={-1}
        onKeyDown={aoTeclar}
      >
        <div className="md-h">
          <h2 id="titulo-modal">{titulo}</h2>
          {descricao && <p>{descricao}</p>}
          <button type="button" className="icb md-x" aria-label="Fechar" onClick={onFechar}>
            <Icone nome="fechar" />
          </button>
        </div>
        <div className="md-b">{children}</div>
        <div className="md-f">{rodape}</div>
      </section>
    </div>
  )
}
