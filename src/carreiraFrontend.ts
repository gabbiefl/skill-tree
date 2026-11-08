import frontendJson from '../dados/frontend.json'
import { criarGrafo } from './dominio/grafo'
import type { Carreira } from './dominio/tipos'

// Carrega o JSON uma vez e monta o grafo. A interface só consome estes valores.
export const frontend = frontendJson as Carreira
export const grafoFrontend = criarGrafo(frontend.habilidades)

// Todos os ids de tópicos que existem: usados para validar o progresso lido do navegador.
export const idsDosTopicos: ReadonlySet<string> = new Set(
  frontend.habilidades.flatMap((h) => h.topicos.map((t) => t.id)),
)
