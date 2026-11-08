import { describe, expect, it } from 'vitest'
import frontendJson from '../../dados/frontend.json'
import { estadoDaArea, ligacoesEntreAreas } from './areas'
import { hab } from './fixtures'
import { criarGrafo } from './grafo'
import { validarSemCiclos } from './ordenacao'
import type { Carreira } from './tipos'

describe('ligacoesEntreAreas', () => {
  it('resume as ligações entre habilidades em ligações entre áreas, sem repetir', () => {
    const habilidades = [
      hab('a1', [], 'A'),
      hab('a2', ['a1'], 'A'), // dentro da mesma área: não conta
      hab('b1', ['a1'], 'B'),
      hab('b2', ['a1', 'a2'], 'B'), // repete A -> B: conta uma vez só
      hab('c1', ['b1'], 'C'),
    ]
    expect(ligacoesEntreAreas(habilidades)).toEqual([
      { de: 'A', para: 'B' },
      { de: 'B', para: 'C' },
    ])
  })
})

describe('estadoDaArea', () => {
  it('é concluída quando todas as habilidades estão concluídas', () => {
    expect(estadoDaArea(['concluida', 'concluida'])).toBe('concluida')
  })

  it('é disponível quando há alguma concluída ou disponível', () => {
    expect(estadoDaArea(['concluida', 'bloqueada'])).toBe('disponivel')
    expect(estadoDaArea(['bloqueada', 'disponivel'])).toBe('disponivel')
  })

  it('é bloqueada quando todas estão bloqueadas', () => {
    expect(estadoDaArea(['bloqueada', 'bloqueada'])).toBe('bloqueada')
  })
})

describe('áreas e etapas nos dados reais do Front-end', () => {
  const frontend = frontendJson as Carreira
  const ligacoes = ligacoesEntreAreas(frontend.habilidades)
  const etapaDe = new Map(frontend.areas.map((a) => [a.id, a.etapa]))

  it('as 28 ligações entre habilidades viram 10 ligações entre áreas', () => {
    expect(frontend.habilidades.flatMap((h) => h.prerequisitos)).toHaveLength(28)
    expect(ligacoes).toHaveLength(10)
  })

  it('toda área pertence a uma etapa que existe, e toda etapa tem alguma área', () => {
    const etapas = frontend.etapas.map((e) => e.id)
    for (const a of frontend.areas) expect(etapas, a.id).toContain(a.etapa)
    for (const e of etapas) expect(frontend.areas.some((a) => a.etapa === e), `etapa ${e} vazia`).toBe(true)
  })

  it('cada ligação entre áreas avança de etapa (a trilha só anda para a direita)', () => {
    for (const l of ligacoes) {
      expect(etapaDe.get(l.de)!, `${l.de} -> ${l.para}`).toBeLessThan(etapaDe.get(l.para)!)
    }
  })

  it('o grafo de áreas também não tem ciclos', () => {
    // Reaproveita o grafo e a validação de ciclos, agora com as áreas como nós.
    const dependeDe = new Map<string, string[]>(frontend.areas.map((a) => [a.id, []]))
    for (const l of ligacoes) dependeDe.get(l.para)!.push(l.de)
    const grafoAreas = criarGrafo(frontend.areas.map((a) => hab(a.id, dependeDe.get(a.id)!, a.id)))
    expect(() => validarSemCiclos(grafoAreas)).not.toThrow()
  })
})
