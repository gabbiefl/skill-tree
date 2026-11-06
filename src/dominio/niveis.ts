import type { Grafo } from './grafo'

// Nível = posição da habilidade na trilha: raízes são 0; as demais ficam
// uma coluna depois do pré-requisito mais "profundo" (1 + o maior nível entre eles).
// Ex.: logica 0 -> js-basico 1 -> dom 2.
export function calcularNiveis(grafo: Grafo): Map<string, number> {
  const niveis = new Map<string, number>()
  const emAndamento = new Set<string>()

  // Recursão com memória: cada nível é calculado uma vez e guardado em "niveis".
  function nivelDe(id: string): number {
    const pronto = niveis.get(id)
    if (pronto !== undefined) return pronto

    // Voltar a um nó que ainda estamos calculando significa que há um ciclo.
    if (emAndamento.has(id)) {
      throw new Error(`Ciclo de pré-requisitos envolvendo "${id}"`)
    }
    emAndamento.add(id)

    const prerequisitos = grafo.habilidades.get(id)!.prerequisitos
    const nivel =
      prerequisitos.length === 0 ? 0 : 1 + Math.max(...prerequisitos.map(nivelDe))

    emAndamento.delete(id)
    niveis.set(id, nivel)
    return nivel
  }

  for (const id of grafo.habilidades.keys()) nivelDe(id)
  return niveis
}
