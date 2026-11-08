import { sugerirPrerequisitos } from './estados'
import type { Grafo } from './grafo'
import type { Habilidade } from './tipos'

// O que a pessoa guarda são os ids dos TÓPICOS concluídos. Tudo o mais
// ("habilidade concluída", progresso, estados) é calculado a partir deles.
// As funções abaixo nunca alteram o conjunto recebido: devolvem um novo Set,
// que é o que o React precisa para perceber a mudança e redesenhar.
type Topicos = ReadonlySet<string>

function habilidadeDe(grafo: Grafo, id: string): Habilidade {
  const h = grafo.habilidades.get(id)
  if (!h) throw new Error(`Habilidade inexistente: "${id}"`)
  return h
}

// Concluída = todos os tópicos marcados. Sem tópicos nunca conta como concluída
// (os dados garantem pelo menos 1 por habilidade).
export function calcularConcluidas(grafo: Grafo, topicosConcluidos: Topicos): Set<string> {
  const concluidas = new Set<string>()
  for (const h of grafo.habilidades.values()) {
    if (h.topicos.length > 0 && h.topicos.every((t) => topicosConcluidos.has(t.id))) {
      concluidas.add(h.id)
    }
  }
  return concluidas
}

export function progressoDaHabilidade(
  habilidade: Habilidade,
  topicosConcluidos: Topicos,
): { feitos: number; total: number } {
  const feitos = habilidade.topicos.filter((t) => topicosConcluidos.has(t.id)).length
  return { feitos, total: habilidade.topicos.length }
}

export function marcarHabilidade(grafo: Grafo, id: string, topicosConcluidos: Topicos): Set<string> {
  const novo = new Set(topicosConcluidos)
  for (const t of habilidadeDe(grafo, id).topicos) novo.add(t.id)
  return novo
}

export function desmarcarHabilidade(grafo: Grafo, id: string, topicosConcluidos: Topicos): Set<string> {
  const novo = new Set(topicosConcluidos)
  for (const t of habilidadeDe(grafo, id).topicos) novo.delete(t.id)
  return novo
}

export function alternarTopico(topicosConcluidos: Topicos, topicoId: string): Set<string> {
  const novo = new Set(topicosConcluidos)
  if (!novo.delete(topicoId)) novo.add(topicoId)
  return novo
}

// Ação "Sim, marcar todas" do modal de sugestão: a habilidade e os pré-requisitos
// que ainda estavam pendentes (o que já estava concluído continua como está).
export function marcarComPrerequisitos(
  grafo: Grafo,
  id: string,
  topicosConcluidos: Topicos,
): Set<string> {
  const pendentes = sugerirPrerequisitos(grafo, id, calcularConcluidas(grafo, topicosConcluidos))
  let novo = new Set(topicosConcluidos)
  for (const alvo of [...pendentes, id]) novo = marcarHabilidade(grafo, alvo, novo)
  return novo
}
