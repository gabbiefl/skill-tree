import { sugerirPrerequisitos } from './estados'
import type { Grafo } from './grafo'

export interface ResultadoOrdenacao {
  // Habilidades numa ordem de estudo válida: cada uma depois de todos os seus pré-requisitos.
  ordem: string[]
  // Habilidades que não conseguiram entrar na ordem: estão num ciclo ou dependem de um.
  sobraram: string[]
}

// Algoritmo de Kahn. A ideia: uma habilidade só pode entrar na lista quando não
// tem mais nenhum pré-requisito pendente.
export function ordenacaoTopologica(grafo: Grafo): ResultadoOrdenacao {
  // Grau de entrada: quantos pré-requisitos ainda faltam entrar na lista.
  const grau = new Map<string, number>()
  const ordem: string[] = []

  for (const h of grafo.habilidades.values()) {
    grau.set(h.id, h.prerequisitos.length)
    // Quem não tem pré-requisito (grau 0) pode começar já.
    if (h.prerequisitos.length === 0) ordem.push(h.id)
  }

  // "ordem" também serve de fila: "i" aponta para a próxima habilidade a processar,
  // e novas habilidades prontas são acrescentadas ao final (primeiro a entrar, primeiro a sair).
  for (let i = 0; i < ordem.length; i++) {
    for (const dependente of grafo.dependentes.get(ordem[i])!) {
      const faltam = grau.get(dependente)! - 1
      grau.set(dependente, faltam)
      // Chegou a zero: todos os pré-requisitos dela já estão na lista.
      if (faltam === 0) ordem.push(dependente)
    }
  }

  // Quem ficou com grau acima de zero nunca foi liberado: há ciclo.
  const sobraram = [...grafo.habilidades.keys()].filter((id) => grau.get(id)! > 0)
  return { ordem, sobraram }
}

export function validarSemCiclos(grafo: Grafo): void {
  const { sobraram } = ordenacaoTopologica(grafo)
  if (sobraram.length > 0) {
    throw new Error(`Ciclo de pré-requisitos envolvendo: ${sobraram.join(', ')}`)
  }
}

// O que ainda falta estudar, na ordem certa. Com "meta", só a meta e os
// pré-requisitos pendentes dela (ex.: "quero chegar em React").
export function trilhaPersonalizada(
  grafo: Grafo,
  concluidas: ReadonlySet<string>,
  meta?: string,
): string[] {
  validarSemCiclos(grafo)
  const { ordem } = ordenacaoTopologica(grafo)

  if (meta === undefined) {
    return ordem.filter((id) => !concluidas.has(id))
  }

  if (!grafo.habilidades.has(meta)) {
    throw new Error(`Habilidade inexistente: "${meta}"`)
  }
  if (concluidas.has(meta)) return []

  const necessarias = new Set([meta, ...sugerirPrerequisitos(grafo, meta, concluidas)])
  // Filtrar a ordem global mantém a ordem válida: tirar itens não quebra "pré-requisito antes".
  return ordem.filter((id) => necessarias.has(id))
}
