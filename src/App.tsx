import { useState } from 'react'
import { frontend, grafoFrontend } from './carreiraFrontend'
import Cabecalho from './componentes/Cabecalho'
import ChipEstado from './componentes/ChipEstado'
import EscolhaCarreira from './componentes/EscolhaCarreira'
import Icone from './componentes/Icones'
import ModalConhecimentos from './componentes/ModalConhecimentos'
import ModalOrdem from './componentes/ModalOrdem'
import ModalSugestao from './componentes/ModalSugestao'
import PainelHabilidade from './componentes/PainelHabilidade'
import TrilhaEtapas from './componentes/trilha/TrilhaEtapas'
import { useMarcacao } from './componentes/useMarcacao'
import { alternarTopico } from './dominio/progresso'

type Tela = 'carreira' | 'trilha'

export default function App() {
  const [tela, setTela] = useState<Tela>('carreira')
  const [editando, setEditando] = useState(false)
  const [verOrdem, setVerOrdem] = useState(false)
  const [selecionada, setSelecionada] = useState<string | null>(null)
  // Única fonte de verdade: os tópicos que a pessoa concluiu. O resto é calculado.
  const [topicos, setTopicos] = useState<ReadonlySet<string>>(new Set())

  // Marcar/desmarcar uma habilidade inteira (botão do painel), com a sugestão de pré-requisitos.
  const marcacao = useMarcacao(grafoFrontend, topicos, setTopicos)

  function comecar() {
    setTela('trilha')
    setEditando(true)
  }

  return (
    <div className="app st">
      <Cabecalho
        comMenu={tela === 'trilha'}
        onLogo={() => setTela('carreira')}
        onEditarConhecimentos={() => setEditando(true)}
        onTrocarCarreira={() => {
          setSelecionada(null)
          setTela('carreira')
        }}
      />

      {tela === 'carreira' && (
        <EscolhaCarreira
          nome={frontend.carreira.nome}
          descricao={frontend.carreira.descricao}
          totalAreas={frontend.areas.length}
          totalHabilidades={frontend.habilidades.length}
          onComecar={comecar}
        />
      )}

      {tela === 'trilha' && (
        <main className={`trilha-area${editando ? ' blur' : ''}${selecionada ? ' com-painel' : ''}`}>
          <div className="sb">
            <div>
              <h2>Trilha · {frontend.carreira.nome}</h2>
              <p>
                {marcacao.concluidas.size} de {frontend.habilidades.length} habilidades concluídas. Clique numa
                habilidade para ver o guia de estudo.
              </p>
            </div>
            <div className="legend">
              <ChipEstado estado="concluida" />
              <ChipEstado estado="disponivel" />
              <ChipEstado estado="bloqueada" />
              <button type="button" className="btn out sm" onClick={() => setVerOrdem(true)}>
                <Icone nome="livro" /> Ver ordem de estudo
              </button>
            </div>
          </div>
          <TrilhaEtapas
            carreira={frontend}
            grafo={grafoFrontend}
            concluidas={marcacao.concluidas}
            topicos={topicos}
            selecionada={selecionada}
            onSelecionar={setSelecionada}
          />
        </main>
      )}

      {tela === 'trilha' && selecionada && (
        <PainelHabilidade
          grafo={grafoFrontend}
          areas={frontend.areas}
          habilidadeId={selecionada}
          topicos={topicos}
          concluidas={marcacao.concluidas}
          onAlternarTopico={(id) => setTopicos(alternarTopico(topicos, id))}
          onAlternarHabilidade={marcacao.alternarHabilidade}
          onSelecionar={setSelecionada}
          onFechar={() => setSelecionada(null)}
        />
      )}

      {verOrdem && (
        <ModalOrdem
          carreira={frontend}
          grafo={grafoFrontend}
          concluidas={marcacao.concluidas}
          topicos={topicos}
          onSelecionar={(id) => {
            setVerOrdem(false)
            setSelecionada(id)
          }}
          onFechar={() => setVerOrdem(false)}
        />
      )}

      {editando && (
        <ModalConhecimentos
          carreira={frontend}
          grafo={grafoFrontend}
          topicosAtuais={topicos}
          onSalvar={(novos) => {
            setTopicos(novos)
            setEditando(false)
          }}
          onCancelar={() => setEditando(false)}
        />
      )}

      {marcacao.pendencia && (
        <ModalSugestao
          pendencia={marcacao.pendencia}
          onAceitar={() => marcacao.responder(true)}
          onRecusar={() => marcacao.responder(false)}
          onFechar={marcacao.fecharPendencia}
        />
      )}
    </div>
  )
}
