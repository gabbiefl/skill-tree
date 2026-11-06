import { useState } from 'react'
import { frontend, grafoFrontend } from './carreiraFrontend'
import { sugerirPrerequisitos } from './dominio/estados'
import EscolhaCarreira from './componentes/EscolhaCarreira'
import ModalConhecimentos from './componentes/ModalConhecimentos'
import ModalSugestao from './componentes/ModalSugestao'
import Trilha from './componentes/Trilha'
import logo from './assets/horizontal-light-1200.png'
import './App.css'

type Etapa = 'carreira' | 'conhecimentos' | 'trilha'

// Habilidade que a pessoa marcou e que tem pré-requisitos pendentes (esperando a resposta).
interface Pendencia {
  id: string
  sugestoes: string[]
}

export default function App() {
  const [etapa, setEtapa] = useState<Etapa>('carreira')
  // Única fonte de verdade: o que a pessoa concluiu. O resto é calculado.
  const [concluidas, setConcluidas] = useState<ReadonlySet<string>>(new Set())
  const [pendencia, setPendencia] = useState<Pendencia | null>(null)

  const nomeDe = (id: string) => grafoFrontend.habilidades.get(id)!.nome

  // Usada pelo modal de conhecimentos e pela trilha: o mesmo fluxo nos dois lugares.
  function alternar(id: string) {
    if (concluidas.has(id)) {
      const novo = new Set(concluidas)
      novo.delete(id)
      setConcluidas(novo)
      return
    }
    const sugestoes = sugerirPrerequisitos(grafoFrontend, id, concluidas)
    if (sugestoes.length === 0) {
      setConcluidas(new Set(concluidas).add(id))
    } else {
      setPendencia({ id, sugestoes })
    }
  }

  function responder(aceitou: boolean) {
    if (!pendencia) return
    const novo = new Set(concluidas).add(pendencia.id)
    if (aceitou) pendencia.sugestoes.forEach((s) => novo.add(s))
    setConcluidas(novo)
    setPendencia(null)
  }

  return (
    <div className="app">
      <header className="topo">
        <img src={logo} alt="SkillTree" className="logo" />
        {etapa !== 'carreira' && (
          <div className="topo-info">
            <span>
              {frontend.carreira.nome}: {concluidas.size} de {frontend.habilidades.length} habilidades concluídas
            </span>
            <button type="button" className="botao botao-claro" onClick={() => setEtapa('conhecimentos')}>
              Editar conhecimentos
            </button>
          </div>
        )}
      </header>

      {etapa === 'carreira' && (
        <EscolhaCarreira
          nome={frontend.carreira.nome}
          descricao={frontend.carreira.descricao}
          onEscolher={() => setEtapa('conhecimentos')}
        />
      )}

      {etapa !== 'carreira' && (
        <main>
          <ul className="legenda" aria-label="Legenda">
            <li><span className="cor cor-concluida" /> Concluída</li>
            <li><span className="cor cor-disponivel" /> Disponível</li>
            <li><span className="cor cor-bloqueada" /> Bloqueada</li>
            <li className="legenda-dica">Clique numa habilidade para marcar ou desmarcar.</li>
          </ul>
          <Trilha
            grafo={grafoFrontend}
            areas={frontend.areas}
            concluidas={concluidas}
            onAlternar={alternar}
          />
        </main>
      )}

      {etapa === 'conhecimentos' && (
        <ModalConhecimentos
          carreira={frontend}
          concluidas={concluidas}
          onAlternar={alternar}
          onConfirmar={() => setEtapa('trilha')}
        />
      )}

      {pendencia && (
        <ModalSugestao
          nome={nomeDe(pendencia.id)}
          sugestoes={pendencia.sugestoes.map(nomeDe)}
          onAceitar={() => responder(true)}
          onRecusar={() => responder(false)}
        />
      )}
    </div>
  )
}
