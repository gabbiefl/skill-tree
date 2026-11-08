import { useMemo, useState } from 'react'
import { calcularEstados } from '../dominio/estados'
import type { Grafo } from '../dominio/grafo'
import { trilhaPersonalizada } from '../dominio/ordenacao'
import { progressoDaHabilidade } from '../dominio/progresso'
import type { Carreira } from '../dominio/tipos'
import { CLASSE_DO_ESTADO } from './estado'
import { IconeEstado } from './Icones'
import Modal from './Modal'

interface Props {
  carreira: Carreira
  grafo: Grafo
  concluidas: ReadonlySet<string>
  topicos: ReadonlySet<string>
  onSelecionar: (id: string) => void
  onFechar: () => void
}

// Mostra a ordem de estudo calculada pela ordenação topológica (algoritmo de Kahn):
// o que ainda falta, cada habilidade depois dos seus pré-requisitos.
// Com uma "meta", só o caminho até ela ("quero chegar em React").
export default function ModalOrdem({ carreira, grafo, concluidas, topicos, onSelecionar, onFechar }: Props) {
  const [meta, setMeta] = useState('')
  const estados = useMemo(() => calcularEstados(grafo, concluidas), [grafo, concluidas])
  const ordem = useMemo(
    () => trilhaPersonalizada(grafo, concluidas, meta || undefined),
    [grafo, concluidas, meta],
  )
  const nomeDaArea = (id: string) => carreira.areas.find((a) => a.id === id)!.nome

  return (
    <Modal
      titulo="Ordem de estudo"
      descricao="A sequência sugerida do que ainda falta, sempre com os pré-requisitos antes. Muda conforme você conclui tópicos."
      onFechar={onFechar}
      rodape={
        <>
          <span className="resumo-t">
            {ordem.length === 0
              ? 'Nada pendente'
              : `${ordem.length} ${ordem.length === 1 ? 'habilidade' : 'habilidades'} para estudar`}
          </span>
          <span className="grow" />
          <button type="button" className="btn pri" onClick={onFechar}>
            Fechar
          </button>
        </>
      }
    >
      <div className="ordem">
        <label className="campo">
          <span className="lbl">Quero chegar em</span>
          <select value={meta} onChange={(e) => setMeta(e.target.value)}>
            <option value="">Tudo o que falta na carreira</option>
            {carreira.areas.map((area) => (
              <optgroup key={area.id} label={area.nome}>
                {carreira.habilidades
                  .filter((h) => h.area === area.id)
                  .map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.nome}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </label>

        {ordem.length === 0 ? (
          <p className="vazio">
            {meta ? 'Você já concluiu essa habilidade.' : 'Você concluiu todas as habilidades desta carreira.'}
          </p>
        ) : (
          <ol className="ordem-lista">
            {ordem.map((id, i) => {
              const h = grafo.habilidades.get(id)!
              const estado = estados.get(id)!
              const { feitos, total } = progressoDaHabilidade(h, topicos)
              return (
                <li key={id}>
                  <button type="button" className={`sk lg ${CLASSE_DO_ESTADO[estado]}`} onClick={() => onSelecionar(id)}>
                    <span className="ico">
                      <IconeEstado estado={estado} />
                    </span>
                    <span className="nm">
                      {i + 1}. {h.nome}
                      <span className="sub">
                        {nomeDaArea(h.area)} · {feitos} de {total} tópicos
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </Modal>
  )
}
