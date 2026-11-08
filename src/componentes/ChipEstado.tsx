import type { Estado } from '../dominio/estados'
import { CLASSE_DO_ESTADO, ROTULO_DO_ESTADO } from './estado'
import { IconeEstado } from './Icones'

interface Props {
  estado: Estado
  grande?: boolean
}

export default function ChipEstado({ estado, grande = false }: Props) {
  return (
    <span className={`chip ${CLASSE_DO_ESTADO[estado]}${grande ? ' lg' : ''}`}>
      <IconeEstado estado={estado} />
      {ROTULO_DO_ESTADO[estado]}
    </span>
  )
}
