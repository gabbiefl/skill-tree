import type { Grafo } from './grafo'
import { progressoDaHabilidade } from './progresso'
import type { Carreira, Habilidade } from './tipos'

export const XP_POR_TOPICO = 10
export const XP_BONUS_HABILIDADE = 50

// XP é DERIVADO do progresso: não existe um contador que só soma. Desmarcar um tópico
// reduz o XP, então marcar e desmarcar repetidamente não rende pontos.
export function calcularXp(grafo: Grafo, topicosConcluidos: ReadonlySet<string>): number {
  let xp = 0
  for (const h of grafo.habilidades.values()) {
    const { feitos, total } = progressoDaHabilidade(h, topicosConcluidos)
    xp += feitos * XP_POR_TOPICO
    if (total > 0 && feitos === total) xp += XP_BONUS_HABILIDADE
  }
  return xp
}

// Quanto XP ainda dá para ganhar nesta habilidade (os tópicos que faltam e o bônus de concluí-la).
export function xpRestanteDaHabilidade(habilidade: Habilidade, topicosConcluidos: ReadonlySet<string>): number {
  const { feitos, total } = progressoDaHabilidade(habilidade, topicosConcluidos)
  const faltam = total - feitos
  return faltam > 0 ? faltam * XP_POR_TOPICO + XP_BONUS_HABILIDADE : 0
}

// Ganho (ou perda, se negativo) de uma ação, comparando o progresso antes e depois.
export function xpDaAcao(grafo: Grafo, antes: ReadonlySet<string>, depois: ReadonlySet<string>): number {
  return calcularXp(grafo, depois) - calcularXp(grafo, antes)
}

// XP total que a carreira inteira oferece (todos os tópicos e todos os bônus).
export function xpTotalDaCarreira(carreira: Carreira): number {
  return carreira.habilidades.reduce((soma, h) => soma + h.topicos.length * XP_POR_TOPICO + XP_BONUS_HABILIDADE, 0)
}

// Limiar de XP de cada nível, calculado dos dados: o nível de uma etapa começa no XP que se
// ganha concluindo aquela etapa e todas as anteriores. Se a carreira ganhar tópicos, os limiares
// acompanham sozinhos.
export function limiaresDosNiveis(carreira: Carreira): number[] {
  const etapaDaArea = new Map(carreira.areas.map((a) => [a.id, a.etapa]))
  const xpPorEtapa = new Map<number, number>()
  for (const h of carreira.habilidades) {
    const etapa = etapaDaArea.get(h.area)!
    const xp = h.topicos.length * XP_POR_TOPICO + XP_BONUS_HABILIDADE
    xpPorEtapa.set(etapa, (xpPorEtapa.get(etapa) ?? 0) + xp)
  }
  return carreira.niveis.map((nivel) => {
    if (nivel.etapa === undefined) return 0
    let soma = 0
    for (const [etapa, xp] of xpPorEtapa) if (etapa <= nivel.etapa) soma += xp
    return soma
  })
}

export interface InfoNivel {
  numero: number // 1 a N
  nome: string
  xpInicio: number
  xpProximo: number | null // null no nível máximo
  fracao: number // quanto do nível já foi percorrido, de 0 a 1
}

export function nivelDoXp(carreira: Carreira, xp: number): InfoNivel {
  const limiares = limiaresDosNiveis(carreira)
  let indice = 0
  limiares.forEach((limiar, i) => {
    if (xp >= limiar) indice = i
  })
  const xpInicio = limiares[indice]
  const xpProximo = limiares[indice + 1] ?? null
  const fracao = xpProximo === null ? 1 : Math.min(1, Math.max(0, (xp - xpInicio) / (xpProximo - xpInicio)))
  return { numero: indice + 1, nome: carreira.niveis[indice].nome, xpInicio, xpProximo, fracao }
}
