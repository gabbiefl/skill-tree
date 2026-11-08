import { useEffect, useRef, useState } from 'react'
import logo from '../assets/skilltree-logo.png'
import Icone from './Icones'

interface Props {
  // Na escolha da carreira não há menu de configurações.
  comMenu: boolean
  onLogo: () => void
  onEditarConhecimentos: () => void
  onTrocarCarreira: () => void
}

export default function Cabecalho({ comMenu, onLogo, onEditarConhecimentos, onTrocarCarreira }: Props) {
  const [aberto, setAberto] = useState(false)
  const area = useRef<HTMLDivElement>(null)

  // Fecha o menu ao clicar fora ou apertar Esc.
  useEffect(() => {
    if (!aberto) return
    const fora = (e: MouseEvent) => {
      if (!area.current?.contains(e.target as Node)) setAberto(false)
    }
    const esc = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && setAberto(false)
    document.addEventListener('mousedown', fora)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', fora)
      document.removeEventListener('keydown', esc)
    }
  }, [aberto])

  function escolher(acao: () => void) {
    setAberto(false)
    acao()
  }

  return (
    <header className="hd">
      <button type="button" className="hd-logo-btn" onClick={onLogo} aria-label="SkillTree, voltar à escolha da carreira">
        <img className="hd-logo" src={logo} alt="" />
      </button>
      <span className="grow" />
      {comMenu && (
        <div className="hd-menu" ref={area}>
          <button
            type="button"
            className="icb"
            aria-label="Configurações"
            aria-haspopup="menu"
            aria-expanded={aberto}
            onClick={() => setAberto(!aberto)}
          >
            <Icone nome="engrenagem" />
          </button>
          {aberto && (
            <div className="menu" role="menu">
              <button type="button" role="menuitem" onClick={() => escolher(onEditarConhecimentos)}>
                <Icone nome="lapis" /> Editar conhecimentos
              </button>
              <button type="button" role="menuitem" onClick={() => escolher(onTrocarCarreira)}>
                <Icone nome="trocar" /> Trocar carreira
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
