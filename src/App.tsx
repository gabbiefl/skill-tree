import { useState } from 'react'
import { frontend, grafoFrontend } from './carreiraFrontend'
import { sugerirPrerequisitos } from './dominio/estados'
import {
  calcularConcluidas,
  desmarcarHabilidade,
  marcarComPrerequisitos,
  marcarHabilidade,
} from './dominio/progresso'
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
  // Única fonte de verdade: os tópicos que a pessoa concluiu. O resto é calculado.
  const [topicos, setTopicos] = useState<ReadonlySet<string>>(new Set())
  const concluidas = calcularConcluidas(grafoFrontend, topicos)
  const [pendencia, setPendencia] = useState<Pendencia | null>(null)

  const nomeDe = (id: string) => grafoFrontend.habilidades.get(id)!.nome

  // Usada pelo modal de conhecimentos e pela trilha: o mesmo fluxo nos dois lugares.
  function alternar(id: string) {
    if (concluidas.has(id)) {
      setTopicos(desmarcarHabilidade(grafoFrontend, id, topicos))
      return
    }
    const sugestoes = sugerirPrerequisitos(grafoFrontend, id, concluidas)
    if (sugestoes.length === 0) {
      setTopicos(marcarHabilidade(grafoFrontend, id, topicos))
    } else {
      setPendencia({ id, sugestoes })
    }
  }

  function responder(aceitou: boolean) {
    if (!pendencia) return
    setTopicos(
      aceitou
        ? marcarComPrerequisitos(grafoFrontend, pendencia.id, topicos)
        : marcarHabilidade(grafoFrontend, pendencia.id, topicos),
    )
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
