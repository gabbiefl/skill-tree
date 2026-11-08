import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { CLASSE_DO_ESTADO } from './estado'
import ChipEstado from './ChipEstado'
import Icone, { IconeEstado } from './Icones'
import { calcularEstados } from '../dominio/estados'
import type { Grafo } from '../dominio/grafo'
import { progressoDaHabilidade } from '../dominio/progresso'
import { XP_BONUS_HABILIDADE, XP_POR_TOPICO } from '../dominio/xp'
import type { Area } from '../dominio/tipos'

interface Props {
  grafo: Grafo
  areas: Area[]
  habilidadeId: string
  topicos: ReadonlySet<string>
  concluidas: ReadonlySet<string>
  onAlternarTopico: (topicoId: string) => void
  onAlternarHabilidade: (id: string) => void
  onSelecionar: (id: string) => void
  onFechar: () => void
}

export default function PainelHabilidade({
  grafo,
  areas,
  habilidadeId,
  topicos,
  concluidas,
  onAlternarTopico,
  onAlternarHabilidade,
  onSelecionar,
  onFechar,
}: Props) {
  const painel = useRef<HTMLElement>(null)
  const habilidade = grafo.habilidades.get(habilidadeId)!
  const estados = calcularEstados(grafo, concluidas)
  const estado = estados.get(habilidadeId)!
  const { feitos, total } = progressoDaHabilidade(habilidade, topicos)
  const liberadas = grafo.dependentes.get(habilidadeId)!
  const area = areas.find((a) => a.id === habilidade.area)!

  // Leva o foco ao painel ao abrir e ao trocar de habilidade (leitores de tela anunciam o título).
  useEffect(() => {
    painel.current?.focus()
  }, [habilidadeId])

  function aoTeclar(e: KeyboardEvent) {
    if (e.key === 'Escape') onFechar()
  }

  // Chip clicável de outra habilidade (pré-requisito ou "libera"), com o estado dela.
  const chip = (id: string) => (
    <button
      type="button"
      key={id}
      className={`chip ${CLASSE_DO_ESTADO[estados.get(id)!]}`}
      onClick={() => onSelecionar(id)}
    >
      <IconeEstado estado={estados.get(id)!} />
      {grafo.habilidades.get(id)!.nome}
    </button>
  )

  return (
    <aside
      ref={painel}
      className="pn"
      aria-label="Detalhes da habilidade"
      tabIndex={-1}
      onKeyDown={aoTeclar}
    >
      <div className="pn-top">
        <ChipEstado estado={estado} grande />
        <button type="button" className="icb" aria-label="Fechar painel" onClick={onFechar}>
          <Icone nome="fechar" />
        </button>
      </div>

      <span className="lbl">Área · {area.nome}</span>
      <h2>{habilidade.nome}</h2>
      <p className="desc">{habilidade.descricao}</p>

      <div className="sec">
        <span className="lbl">Pré-requisitos</span>
        <div className="chips">
          {habilidade.prerequisitos.length > 0 ? (
            habilidade.prerequisitos.map(chip)
          ) : (
            <span className="desc">Nenhum: é um ponto de partida.</span>
          )}
        </div>
      </div>

      <div className="sec">
        <span className="lbl">Libera</span>
        <div className="chips">
          {liberadas.length > 0 ? liberadas.map(chip) : <span className="desc">Nenhuma habilidade depende desta.</span>}
        </div>
      </div>

      <div className="pn-prog">
        <div className="pn-prog-t">
          <span className="lbl">Tópicos</span>
          <b>
            {feitos} de {total} concluídos
          </b>
        </div>
        <div
          className="bar"
          role="progressbar"
          aria-label="Progresso da habilidade"
          aria-valuenow={feitos}
          aria-valuemin={0}
          aria-valuemax={total}
        >
          <i style={{ width: `${(feitos / total) * 100}%` }} />
        </div>
        <p className="pn-xp">
          +{XP_POR_TOPICO} XP por tópico · +{XP_BONUS_HABILIDADE} XP ao concluir a habilidade
        </p>
      </div>

      <div className="tps">
        {habilidade.topicos.map((t) => (
          <label className="cb row" key={t.id}>
            <input type="checkbox" checked={topicos.has(t.id)} onChange={() => onAlternarTopico(t.id)} />
            <span className="bx">
              <Icone nome="check" />
            </span>
            <span className="nm">{t.nome}</span>
          </label>
        ))}
      </div>

      <button
        type="button"
        className={`btn lg cheio ${estado === 'concluida' ? 'out' : 'ok'}`}
        onClick={() => onAlternarHabilidade(habilidadeId)}
      >
        <Icone nome="check" />
        {estado === 'concluida' ? 'Desmarcar todos os tópicos' : 'Marcar todos como concluídos'}
      </button>
    </aside>
  )
}
