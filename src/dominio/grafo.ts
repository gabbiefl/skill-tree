import type { Habilidade } from './tipos'

// O grafo guarda os dois sentidos das setas:
// - habilidades: cada id aponta para a habilidade (com seus pré-requisitos);
// - dependentes: o caminho inverso, "o que esta habilidade libera".
export interface Grafo {
  habilidades: Map<string, Habilidade>
  dependentes: Map<string, string[]>
}

export function criarGrafo(lista: Habilidade[]): Grafo {
  const habilidades = new Map<string, Habilidade>()
  const dependentes = new Map<string, string[]>()

  for (const h of lista) {
    if (habilidades.has(h.id)) {
      throw new Error(`Habilidade repetida: "${h.id}"`)
    }
    habilidades.set(h.id, h)
    dependentes.set(h.id, [])
  }

  // Segunda passada: só agora todos os ids existem, então dá para validar as setas.
  for (const h of lista) {
    for (const p of h.prerequisitos) {
      const dependentesDeP = dependentes.get(p)
      if (!dependentesDeP) {
        throw new Error(`"${h.id}" exige "${p}", que não existe`)
      }
      dependentesDeP.push(h.id)
    }
  }

  return { habilidades, dependentes }
}
