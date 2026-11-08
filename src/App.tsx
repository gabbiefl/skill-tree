import { useEffect, useState } from 'react'
import { carregarProgresso, salvarProgresso } from './armazenamento'
import { frontend, grafoFrontend, idsDosTopicos } from './carreiraFrontend'
import Cabecalho from './componentes/Cabecalho'
import type { Ganho } from './componentes/Cabecalho'
import ChipEstado from './componentes/ChipEstado'
import EscolhaCarreira from './componentes/EscolhaCarreira'
import Icone from './componentes/Icones'
import ModalConhecimentos from './componentes/ModalConhecimentos'
import ModalOrdem from './componentes/ModalOrdem'
import ModalRecomecar from './componentes/ModalRecomecar'
import ModalSugestao from './componentes/ModalSugestao'
import PainelHabilidade from './componentes/PainelHabilidade'
import TrilhaEtapas from './componentes/trilha/TrilhaEtapas'
import { useMarcacao } from './componentes/useMarcacao'
import { alternarTopico } from './dominio/progresso'
import { calcularXp, nivelDoXp } from './dominio/xp'

type Tela = 'carreira' | 'trilha'

export default function App() {
  const [tela, setTela] = useState<Tela>('carreira')
  const [editando, setEditando] = useState(false)
  const [verOrdem, setVerOrdem] = useState(false)
  const [recomecando, setRecomecando] = useState(false)
  const [selecionada, setSelecionada] = useState<string | null>(null)
  const [ganho, setGanho] = useState<Ganho | null>(null)
  // Única fonte de verdade: os tópicos que a pessoa concluiu (lidos do navegador ao abrir).
  // Habilidades concluídas, estados, XP e nível são todos calculados a partir deles.
  const [topicos, setTopicos] = useState<ReadonlySet<string>>(() => carregarProgresso(idsDosTopicos))

  const xp = calcularXp(grafoFrontend, topicos)
  const nivel = nivelDoXp(frontend, xp)

  // Guarda no navegador a cada mudança (sincronizar com um sistema externo é o uso certo de efeito).
  useEffect(() => {
    salvarProgresso(topicos)
  }, [topicos])

  // O aviso de ganho some sozinho depois de 2 segundos.
  useEffect(() => {
    if (!ganho) return
    const espera = setTimeout(() => setGanho(null), 2000)
    return () => clearTimeout(espera)
  }, [ganho])

  // Toda alteração de progresso passa por aqui: guarda e, se ganhou XP, mostra o aviso.
  function aplicarTopicos(novos: ReadonlySet<string>) {
    const depois = calcularXp(grafoFrontend, novos)
    if (depois > xp) {
      const nivelDepois = nivelDoXp(frontend, depois)
      setGanho({ xp: depois - xp, nivel: nivelDepois.numero > nivel.numero ? nivelDepois : null })
    }
    setTopicos(novos)
  }

  // Marcar/desmarcar uma habilidade inteira (botão do painel), com a sugestão de pré-requisitos.
  const marcacao = useMarcacao(frontend, grafoFrontend, topicos, aplicarTopicos)

  function comecar() {
    setTela('trilha')
    // Quem já tem progresso salvo continua direto; quem está começando diz o que já sabe.
    if (topicos.size === 0) setEditando(true)
  }

  function recomecar() {
    setTopicos(new Set())
    setGanho(null)
    setSelecionada(null)
    setRecomecando(false)
    setTela('carreira')
  }

  return (
    <div className="app st">
      <Cabecalho
        comMenu={tela === 'trilha'}
        xp={xp}
        nivel={nivel}
        ganho={ganho}
        onLogo={() => setTela('carreira')}
        onEditarConhecimentos={() => setEditando(true)}
        onTrocarCarreira={() => {
          setSelecionada(null)
          setTela('carreira')
        }}
        onRecomecar={() => setRecomecando(true)}
      />

      {tela === 'carreira' && (
        <EscolhaCarreira
          nome={frontend.carreira.nome}
          descricao={frontend.carreira.descricao}
          totalAreas={frontend.areas.length}
          totalHabilidades={frontend.habilidades.length}
          continuar={topicos.size > 0}
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
          onAlternarTopico={(id) => aplicarTopicos(alternarTopico(topicos, id))}
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
            aplicarTopicos(novos)
            setEditando(false)
          }}
          onCancelar={() => setEditando(false)}
        />
      )}

      {recomecando && <ModalRecomecar onConfirmar={recomecar} onCancelar={() => setRecomecando(false)} />}

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
