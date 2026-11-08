import Icone from './Icones'
import Modal from './Modal'

interface Props {
  onConfirmar: () => void
  onCancelar: () => void
}

export default function ModalRecomecar({ onConfirmar, onCancelar }: Props) {
  return (
    <Modal
      titulo="Recomeçar do zero?"
      descricao="Isso apaga todos os tópicos concluídos e o XP deste navegador. Não dá para desfazer."
      onFechar={onCancelar}
      rodape={
        <>
          <span className="grow" />
          <button type="button" className="btn out" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="button" className="btn pri" onClick={onConfirmar}>
            <Icone nome="lixeira" /> Apagar progresso
          </button>
        </>
      }
    >
      <p className="aviso">Você volta à escolha da carreira, e a trilha começa vazia.</p>
    </Modal>
  )
}
