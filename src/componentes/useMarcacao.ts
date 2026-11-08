import { useMemo, useState } from 'react'
import { calcularEstados, sugerirPrerequisitos } from '../dominio/estados'
import type { Estado } from '../dominio/estados'
import type { Grafo } from '../dominio/grafo'
import {
  calcularConcluidas,
  desmarcarHabilidade,
  marcarComPrerequisitos,
  marcarHabilidade,
  progressoDaHabilidade,
} from '../dominio/progresso'
import type { Carreira } from '../dominio/tipos'
import { calcularXp, nivelDoXp, xpRestanteDaHabilidade } from '../dominio/xp'
import type { InfoNivel } from '../dominio/xp'

// Um pré-requisito pendente, já com o que o modal de sugestão precisa mostrar.
export interface ItemPendente {
  id: string
  nome: string
  estado: Estado
  faltam: number
  total: number
  xp: number // XP que ainda dá para ganhar nele
}

export interface Pendencia {
  id: string
  nome: string
  xpAlvo: number
  itens: ItemPendente[]
  xpTotal: number // ganho de "Sim, marcar todas"
  nivelDepois: InfoNivel | null // preenchido se marcar todas faz subir de nível
}

// Fluxo de marcar/desmarcar uma habilidade inteira, usado no modal de conhecimentos
// (sobre um rascunho) e no painel lateral (sobre o progresso real). "aplicar" recebe
// o novo conjunto de tópicos concluídos; quem chama decide onde guardá-lo.
export function useMarcacao(
  carreira: Carreira,
  grafo: Grafo,
  topicos: ReadonlySet<string>,
  aplicar: (novos: ReadonlySet<string>) => void,
) {
  const [pendencia, setPendencia] = useState<Pendencia | null>(null)
  const concluidas = useMemo(() => calcularConcluidas(grafo, topicos), [grafo, topicos])

  function alternarHabilidade(id: string) {
    if (concluidas.has(id)) {
      aplicar(desmarcarHabilidade(grafo, id, topicos))
      return
    }
    const sugestoes = sugerirPrerequisitos(grafo, id, concluidas)
    if (sugestoes.length === 0) {
      aplicar(marcarHabilidade(grafo, id, topicos))
      return
    }
    // Há pré-requisitos pendentes: a pessoa decide (o sistema só sugere).
    const estados = calcularEstados(grafo, concluidas)
    const xpAntes = calcularXp(grafo, topicos)
    const xpDepois = calcularXp(grafo, marcarComPrerequisitos(grafo, id, topicos))
    const nivelAntes = nivelDoXp(carreira, xpAntes)
    const nivelDepois = nivelDoXp(carreira, xpDepois)
    setPendencia({
      id,
      nome: grafo.habilidades.get(id)!.nome,
      xpAlvo: xpRestanteDaHabilidade(grafo.habilidades.get(id)!, topicos),
      xpTotal: xpDepois - xpAntes,
      nivelDepois: nivelDepois.numero > nivelAntes.numero ? nivelDepois : null,
      itens: sugestoes.map((s) => {
        const h = grafo.habilidades.get(s)!
        const { feitos, total } = progressoDaHabilidade(h, topicos)
        return {
          id: s,
          nome: h.nome,
          estado: estados.get(s)!,
          faltam: total - feitos,
          total,
          xp: xpRestanteDaHabilidade(h, topicos),
        }
      }),
    })
  }

  function responder(aceitou: boolean) {
    if (!pendencia) return
    aplicar(
      aceitou
        ? marcarComPrerequisitos(grafo, pendencia.id, topicos)
        : marcarHabilidade(grafo, pendencia.id, topicos),
    )
    setPendencia(null)
  }

  return {
    concluidas,
    pendencia,
    alternarHabilidade,
    responder,
    fecharPendencia: () => setPendencia(null),
  }
}
