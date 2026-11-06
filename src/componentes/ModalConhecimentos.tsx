import type { Carreira } from '../dominio/tipos'

interface Props {
  carreira: Carreira
  concluidas: ReadonlySet<string>
  onAlternar: (id: string) => void
  onConfirmar: () => void
}

// Lista as habilidades agrupadas por área (a árvore Carreira -> Áreas -> Habilidades).
export default function ModalConhecimentos({ carreira, concluidas, onAlternar, onConfirmar }: Props) {
  return (
    <div className="fundo">
      <div className="modal modal-grande" role="dialog" aria-modal="true" aria-labelledby="titulo-conhecimentos">
        <h2 id="titulo-conhecimentos">O que você já conhece?</h2>
        <p>Marque as tecnologias que você já estudou. A trilha vai considerá-las concluídas.</p>

        <div className="areas">
          {carreira.areas.map((area) => (
            <fieldset key={area.id}>
              <legend>{area.nome}</legend>
              {carreira.habilidades
                .filter((h) => h.area === area.id)
                .map((h) => (
                  <label key={h.id}>
                    <input
                      type="checkbox"
                      checked={concluidas.has(h.id)}
                      onChange={() => onAlternar(h.id)}
                    />
                    {h.nome}
                  </label>
                ))}
            </fieldset>
          ))}
        </div>

        <button type="button" className="botao" onClick={onConfirmar}>
          Ver minha trilha
        </button>
      </div>
    </div>
  )
}
