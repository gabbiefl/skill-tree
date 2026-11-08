import { useState } from 'react'
import type { Grafo } from '../dominio/grafo'
import { progressoDaHabilidade } from '../dominio/progresso'
import type { Carreira } from '../dominio/tipos'
import Icone from './Icones'
import Modal from './Modal'
import ModalSugestao from './ModalSugestao'
import { useMarcacao } from './useMarcacao'

interface Props {
  carreira: Carreira
  grafo: Grafo
  topicosAtuais: ReadonlySet<string>
  onSalvar: (topicos: ReadonlySet<string>) => void
  onCancelar: () => void
}

// Trabalha sobre um RASCUNHO: só "Salvar" altera o progresso real; "Cancelar" descarta.
export default function ModalConhecimentos({ carreira, grafo, topicosAtuais, onSalvar, onCancelar }: Props) {
  const [rascunho, setRascunho] = useState<ReadonlySet<string>>(topicosAtuais)
  const { concluidas, pendencia, alternarHabilidade, responder, fecharPendencia } = useMarcacao(
    grafo,
    rascunho,
    setRascunho,
  )
  const totalTopicos = carreira.habilidades.reduce((n, h) => n + h.topicos.length, 0)

  return (
    <>
      <Modal
        larga
        titulo="O que você já conhece?"
        descricao="Marque as habilidades que você já domina. Marcar uma habilidade marca todos os tópicos dela, e a trilha se ajusta ao que você já sabe."
        onFechar={onCancelar}
        rodape={
          <>
            <div className="resumo">
              <span className="resumo-t">
                {concluidas.size} de {carreira.habilidades.length} habilidades marcadas
              </span>
              <span className="resumo-s">
                {rascunho.size} de {totalTopicos} tópicos concluídos
              </span>
            </div>
            <span className="grow" />
            <button type="button" className="btn ghost" onClick={() => setRascunho(new Set())}>
              Limpar tudo
            </button>
            <button type="button" className="btn out" onClick={onCancelar}>
              Cancelar
            </button>
            <button type="button" className="btn pri" onClick={() => onSalvar(rascunho)}>
              Salvar e ver minha trilha <Icone nome="setaDireita" />
            </button>
          </>
        }
      >
        <div className="md-cols">
          {carreira.areas.map((area) => {
            const habilidades = carreira.habilidades.filter((h) => h.area === area.id)
            const marcadas = habilidades.filter((h) => concluidas.has(h.id)).length
            return (
              <div className="grp" key={area.id}>
                <div className="grp-h">
                  <h3>{area.nome}</h3>
                  <span>
                    {marcadas} de {habilidades.length}
                  </span>
                </div>
                {habilidades.map((h) => {
                  const { feitos, total } = progressoDaHabilidade(h, rascunho)
                  const completa = concluidas.has(h.id)
                  const parcial = !completa && feitos > 0
                  return (
                    <label className="cb row" key={h.id}>
                      <input
                        type="checkbox"
                        checked={completa}
                        ref={(el) => {
                          if (el) el.indeterminate = parcial
                        }}
                        onChange={() => alternarHabilidade(h.id)}
                      />
                      <span className={`bx${parcial ? ' part' : ''}`}>
                        <Icone nome={parcial ? 'menos' : 'check'} />
                      </span>
                      <span className="nm">{h.nome}</span>
                      <span className="mt">{parcial ? `${feitos} de ${total}` : `${total} tópicos`}</span>
                    </label>
                  )
                })}
              </div>
            )
          })}
        </div>
      </Modal>

      {pendencia && (
        <ModalSugestao
          pendencia={pendencia}
          onAceitar={() => responder(true)}
          onRecusar={() => responder(false)}
          onFechar={fecharPendencia}
        />
      )}
    </>
  )
}
