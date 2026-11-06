import frontendJson from '../dados/frontend.json'
import { criarGrafo } from './dominio/grafo'
import type { Carreira } from './dominio/tipos'

// Carrega o JSON uma vez e monta o grafo. A interface só consome estes dois valores.
export const frontend = frontendJson as Carreira
export const grafoFrontend = criarGrafo(frontend.habilidades)
