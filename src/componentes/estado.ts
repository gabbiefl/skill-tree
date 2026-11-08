import type { Estado } from '../dominio/estados'

// Classes do design para cada estado (is-done, is-avail, is-locked) e o texto mostrado.
export const CLASSE_DO_ESTADO: Record<Estado, string> = {
  concluida: 'is-done',
  disponivel: 'is-avail',
  bloqueada: 'is-locked',
}

export const ROTULO_DO_ESTADO: Record<Estado, string> = {
  concluida: 'Concluída',
  disponivel: 'Disponível',
  bloqueada: 'Bloqueada',
}
