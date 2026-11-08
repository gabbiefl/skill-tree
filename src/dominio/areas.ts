import type { Estado } from './estados'
import type { Habilidade } from './tipos'

export interface LigacaoDeAreas {
  de: string
  para: string
}

// Resume as ligações entre habilidades em ligações entre ÁREAS, sem repetir.
// É a visão "de longe" da trilha: 28 ligações entre habilidades viram 10 entre áreas.
export function ligacoesEntreAreas(habilidades: Habilidade[]): LigacaoDeAreas[] {
  const areaDe = new Map(habilidades.map((h) => [h.id, h.area]))
  const vistas = new Set<string>()
  const ligacoes: LigacaoDeAreas[] = []

  for (const h of habilidades) {
    for (const p of h.prerequisitos) {
      const de = areaDe.get(p)!
      if (de === h.area) continue // ligação dentro da mesma área não aparece de longe
      const chave = `${de}>${h.area}`
      if (vistas.has(chave)) continue
      vistas.add(chave)
      ligacoes.push({ de, para: h.area })
    }
  }
  return ligacoes
}

// Estado do bloco de uma área, a partir do estado das habilidades dela:
// concluída se todas estão; disponível se há algo concluído ou disponível; senão bloqueada.
export function estadoDaArea(estadosDasHabilidades: Estado[]): Estado {
  if (estadosDasHabilidades.every((e) => e === 'concluida')) return 'concluida'
  if (estadosDasHabilidades.some((e) => e === 'concluida' || e === 'disponivel')) return 'disponivel'
  return 'bloqueada'
}
