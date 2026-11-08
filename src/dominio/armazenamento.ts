// Formato do progresso guardado no navegador. Funções puras: quem de fato lê e grava
// no localStorage fica em src/armazenamento.ts.
const VERSAO = 1

export function serializarProgresso(topicosConcluidos: ReadonlySet<string>): string {
  return JSON.stringify({ versao: VERSAO, topicos: [...topicosConcluidos].sort() })
}

// O texto guardado NÃO é confiável: pode estar corrompido, ser de outra versão ou citar
// tópicos que não existem mais. Qualquer problema vira "sem progresso", nunca um erro.
export function lerProgresso(texto: string | null, idsValidos: ReadonlySet<string>): Set<string> {
  if (!texto) return new Set()
  try {
    const dado: unknown = JSON.parse(texto)
    if (typeof dado !== 'object' || dado === null) return new Set()
    const { versao, topicos } = dado as { versao?: unknown; topicos?: unknown }
    if (versao !== VERSAO || !Array.isArray(topicos)) return new Set()
    return new Set(topicos.filter((t): t is string => typeof t === 'string' && idsValidos.has(t)))
  } catch {
    return new Set()
  }
}
