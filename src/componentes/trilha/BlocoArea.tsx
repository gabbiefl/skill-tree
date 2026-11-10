import { CLASSE_DO_ESTADO } from '../estado'
import type { Estado } from '../../dominio/estados'
import { estadoDaArea } from '../../dominio/areas'
import { progressoDaHabilidade } from '../../dominio/progresso'
import type { Area, Habilidade } from '../../dominio/tipos'
import Icone, { IconeEstado } from '../Icones'
import { iconeDaArea } from './visualDasAreas'

interface Props {
  area: Area
  habilidades: Habilidade[]
  estados: ReadonlyMap<string, Estado>
  topicos: ReadonlySet<string>
  aberta: boolean
  selecionada: string | null
  // Habilidades desta área ligadas à selecionada (usadas como rótulos quando o bloco está fechado).
  vem: Habilidade[]
  libera: Habilidade[]
  // Registra o elemento no mapa de medidas (usado para desenhar as ligações).
  registrar: (chave: string, el: HTMLElement | null) => void
  onAlternar: () => void
  onSelecionar: (id: string) => void
}

// Um bloco de área: fechado mostra o resumo (mini-mapa e progresso); aberto mostra as habilidades.
export default function BlocoArea({
  area,
  habilidades,
  estados,
  topicos,
  aberta,
  selecionada,
  vem,
  libera,
  registrar,
  onAlternar,
  onSelecionar,
}: Props) {
  const estadosDaArea = habilidades.map((h) => estados.get(h.id)!)
  const estado = estadoDaArea(estadosDaArea)
  const concluidas = estadosDaArea.filter((e) => e === 'concluida').length
  const percentual = (concluidas / habilidades.length) * 100

  const rotulo = (h: Habilidade) => (
    <button
      type="button"
      key={h.id}
      className={`chip sm ${CLASSE_DO_ESTADO[estados.get(h.id)!]}`}
      onClick={() => onSelecionar(h.id)}
    >
      <IconeEstado estado={estados.get(h.id)!} />
      {h.nome}
    </button>
  )

  return (
    <div className="ar-wrap">
      <div
        className={`ar ${CLASSE_DO_ESTADO[estado]}${aberta ? ' open' : ''}`}
        data-area={area.id}
        ref={(el) => registrar(`area:${area.id}`, el)}
      >
        <button type="button" className="ar-cab" aria-expanded={aberta} onClick={onAlternar}>
          <span className="ar-t">
            <span className="ar-nome">
              <span className="ar-ico" aria-hidden="true">
                <Icone nome={iconeDaArea(area.id)} />
              </span>
              {estado === 'bloqueada' && <Icone nome="cadeado" />}
              {area.nome}
            </span>
            <Icone nome={aberta ? 'setaCima' : 'setaBaixo'} />
          </span>
          {!aberta && (
            <span className="ar-gl" aria-hidden="true">
              {estadosDaArea.map((e, i) => (
                <span key={habilidades[i].id} className={`gl ${CLASSE_DO_ESTADO[e]}`}>
                  {e === 'concluida' && <Icone nome="check" />}
                  {e === 'bloqueada' && <Icone nome="cadeado" />}
                </span>
              ))}
            </span>
          )}
          <span className="ar-f">
            <span>
              {concluidas}/{habilidades.length}
            </span>
            <span
              className="bar sm"
              role="progressbar"
              aria-label={`Habilidades concluídas em ${area.nome}`}
              aria-valuenow={concluidas}
              aria-valuemin={0}
              aria-valuemax={habilidades.length}
            >
              <i style={{ width: `${percentual}%` }} />
            </span>
          </span>
        </button>

        {aberta && (
          <div className="ar-rows">
            {habilidades.map((h) => {
              const e = estados.get(h.id)!
              const { feitos, total } = progressoDaHabilidade(h, topicos)
              return (
                <button
                  type="button"
                  key={h.id}
                  ref={(el) => registrar(`hab:${h.id}`, el)}
                  className={`sk ${CLASSE_DO_ESTADO[e]}${h.id === selecionada ? ' is-sel' : ''}`}
                  aria-label={`${h.nome}, ${feitos} de ${total} tópicos`}
                  onClick={() => onSelecionar(h.id)}
                >
                  <span className="ico">
                    <IconeEstado estado={e} />
                  </span>
                  <span className="nm">{h.nome}</span>
                  <span className="ct">
                    {feitos}/{total}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {!aberta && (vem.length > 0 || libera.length > 0) && (
        <div className="tags">
          {vem.length > 0 && (
            <>
              <span className="lbl">De onde vem</span>
              {vem.map(rotulo)}
            </>
          )}
          {libera.length > 0 && (
            <>
              <span className="lbl">O que libera</span>
              {libera.map(rotulo)}
            </>
          )}
        </div>
      )}
    </div>
  )
}
