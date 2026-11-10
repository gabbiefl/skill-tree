import { useEffect, useRef, useState } from 'react'
import logo from '../assets/skilltree-logo.png'
import type { InfoNivel } from '../dominio/xp'
import Icone from './Icones'
import { iconeDoNivel } from './trilha/visualDasAreas'

// Último ganho de XP (aparece por 2 segundos). "nivel" vem preenchido quando o ganho fez subir de nível.
export interface Ganho {
  xp: number
  nivel: InfoNivel | null
}

interface Props {
  // Na escolha da carreira não há menu de configurações nem medidor.
  comMenu: boolean
  xp: number
  nivel: InfoNivel
  ganho: Ganho | null
  onLogo: () => void
  onEditarConhecimentos: () => void
  onTrocarCarreira: () => void
  onRecomecar: () => void
}

export default function Cabecalho({
  comMenu,
  xp,
  nivel,
  ganho,
  onLogo,
  onEditarConhecimentos,
  onTrocarCarreira,
  onRecomecar,
}: Props) {
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

  const percentual = Math.round(nivel.fracao * 100)

  return (
    <header className="hd">
      <button type="button" className="hd-logo-btn" onClick={onLogo} aria-label="SkillTree, voltar à escolha da carreira">
        <img className="hd-logo" src={logo} alt="" />
      </button>
      <span className="grow" />

      {comMenu && (
        <>
          <span className="lvl-badge" role="img" aria-label={`Nível ${nivel.numero}, ${nivel.nome}`}>
            <Icone nome={iconeDoNivel(nivel.numero)} />
          </span>
          <div className="hd-meter">
            <div className="top">
              <span>
                Nível {nivel.numero} · {nivel.nome}
              </span>
              <b>{nivel.xpProximo === null ? `${xp} XP · nível máximo` : `${xp} / ${nivel.xpProximo} XP`}</b>
            </div>
            <div
              className="bar"
              role="progressbar"
              aria-label="XP do nível"
              aria-valuenow={percentual}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <i style={{ width: `${percentual}%` }} />
            </div>
          </div>

          {/* Região "ao vivo": leitores de tela anunciam o ganho de XP sem tirar o foco. */}
          <div className="hd-ganho" aria-live="polite">
            {ganho && (
              <>
                <span className="toast-xp">
                  <Icone nome="raio" /> +{ganho.xp} XP
                </span>
                {ganho.nivel && (
                  <span className="chip lg is-avail">
                    <Icone nome="estrela" /> Nível {ganho.nivel.numero} · {ganho.nivel.nome}
                  </span>
                )}
              </>
            )}
          </div>

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
                <button type="button" role="menuitem" onClick={() => escolher(onRecomecar)}>
                  <Icone nome="lixeira" /> Recomeçar do zero
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  )
}
