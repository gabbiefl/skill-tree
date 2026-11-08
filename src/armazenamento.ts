import { lerProgresso, serializarProgresso } from './dominio/armazenamento'

// Leitura e gravação do progresso no localStorage (o armazenamento do navegador, só desta pessoa).
// Pode falhar (modo privado, armazenamento bloqueado ou cheio): nesse caso o app segue funcionando,
// apenas sem salvar. Por isso tudo fica dentro de try/catch.
const CHAVE = 'skilltree:progresso'

export function carregarProgresso(idsValidos: ReadonlySet<string>): Set<string> {
  try {
    return lerProgresso(localStorage.getItem(CHAVE), idsValidos)
  } catch {
    return new Set()
  }
}

export function salvarProgresso(topicosConcluidos: ReadonlySet<string>): void {
  try {
    localStorage.setItem(CHAVE, serializarProgresso(topicosConcluidos))
  } catch {
    // sem armazenamento: o progresso fica só na memória desta sessão
  }
}
