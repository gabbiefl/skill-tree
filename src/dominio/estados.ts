import type { Grafo } from './grafo'

export type Estado = 'concluida' | 'disponivel' | 'bloqueada'

// Só guardamos o que a pessoa concluiu. "Disponível" e "bloqueada" são calculadas,
// então os dados nunca se contradizem.
export function calcularEstados(
  grafo: Grafo,
  concluidas: ReadonlySet<string>,
): Map<string, Estado> {
  const estados = new Map<string, Estado>()

  for (const h of grafo.habilidades.values()) {
    if (concluidas.has(h.id)) {
      estados.set(h.id, 'concluida')
    } else if (h.prerequisitos.every((p) => concluidas.has(p))) {
      // every() é verdadeiro para lista vazia: uma raiz já nasce disponível.
      estados.set(h.id, 'disponivel')
    } else {
      estados.set(h.id, 'bloqueada')
    }
  }

  return estados
}

// Ao marcar uma habilidade, devolve os pré-requisitos (diretos e indiretos) ainda
// não concluídos, com os mais básicos primeiro. Só calcula; quem decide é a pessoa.
export function sugerirPrerequisitos(
  grafo: Grafo,
  id: string,
  concluidas: ReadonlySet<string>,
): string[] {
  const alvo = grafo.habilidades.get(id)
  if (!alvo) {
    throw new Error(`Habilidade inexistente: "${id}"`)
  }

  const visitados = new Set<string>()
  const sugestoes: string[] = []

  // DFS que sobe pelos pré-requisitos. Para ao chegar em algo já concluído:
  // a pessoa já decidiu sobre aquele ramo.
  function subir(atual: string) {
    for (const p of grafo.habilidades.get(atual)!.prerequisitos) {
      if (visitados.has(p) || concluidas.has(p)) continue
      visitados.add(p)
      subir(p)
      // Adiciona depois de visitar os pré-requisitos dele (pós-ordem):
      // por isso os mais básicos saem primeiro.
      sugestoes.push(p)
    }
  }

  subir(alvo.id)
  return sugestoes
}
