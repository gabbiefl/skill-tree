import { CLASSE_DO_ESTADO } from './estado'
import Icone, { IconeEstado } from './Icones'
import Modal from './Modal'
import type { Pendencia } from './useMarcacao'

interface Props {
  pendencia: Pendencia
  onAceitar: () => void
  onRecusar: () => void
  onFechar: () => void
}

// O sistema sugere; quem decide é a pessoa.
export default function ModalSugestao({ pendencia, onAceitar, onRecusar, onFechar }: Props) {
  return (
    <Modal
      porCima
      titulo="Marcar também os pré-requisitos?"
      descricao={
        <>
          Para concluir <strong>{pendencia.nome}</strong>, antes vêm estas habilidades. Elas ainda estão pendentes.
        </>
      }
      onFechar={onFechar}
      rodape={
        <>
          <span className="grow" />
          <button type="button" className="btn out" onClick={onRecusar}>
            Não, só esta
          </button>
          <button type="button" className="btn pri" onClick={onAceitar}>
            <Icone nome="check" /> Sim, marcar todas
          </button>
        </>
      }
    >
      <div className="sugestao">
        <div className="sk lg is-done">
          <span className="ico"><Icone nome="check" /></span>
          <span className="nm">
            {pendencia.nome}
            <span className="sub">Você está marcando esta agora</span>
          </span>
          <span className="xp">+{pendencia.xpAlvo} XP</span>
        </div>

        <span className="lbl">Pré-requisitos pendentes · {pendencia.itens.length}</span>
        {pendencia.itens.map((item) => (
          <div key={item.id} className={`sk lg ${CLASSE_DO_ESTADO[item.estado]}`}>
            <span className="ico"><IconeEstado estado={item.estado} /></span>
            <span className="nm">
              {item.nome}
              <span className="sub">
                {item.faltam === item.total
                  ? `Faltam ${item.total} tópicos`
                  : `Faltam ${item.faltam} de ${item.total} tópicos`}
              </span>
            </span>
            <span className="xp">+{item.xp} XP</span>
          </div>
        ))}

        <div className="sugestao-xp">
          <span className="toast-xp">
            <Icone nome="raio" /> +{pendencia.xpTotal} XP
          </span>
          <span>
            {pendencia.nivelDepois
              ? `Marcando todas, você sobe para o nível ${pendencia.nivelDepois.numero} · ${pendencia.nivelDepois.nome}.`
              : 'Esse é o XP que você ganha marcando todas.'}
          </span>
        </div>

        <p className="nota">
          Se escolher “Não, só esta”, os pré-requisitos continuam pendentes e você pode marcá-los depois.
        </p>
      </div>
    </Modal>
  )
}
