import { describe, expect, it } from 'vitest'
import frontendJson from '../../dados/frontend.json'
import { hab } from './fixtures'
import { criarGrafo } from './grafo'
import { alternarTopico, marcarComPrerequisitos, marcarHabilidade } from './progresso'
import {
  calcularXp,
  limiaresDosNiveis,
  nivelDoXp,
  xpDaAcao,
  xpRestanteDaHabilidade,
  xpTotalDaCarreira,
} from './xp'
import type { Carreira } from './tipos'

const frontend = frontendJson as Carreira
const real = criarGrafo(frontend.habilidades)

// a (2 tópicos) -> b (3 tópicos)
const pequeno = criarGrafo([hab('a', [], 'x', ['t1', 't2']), hab('b', ['a'], 'x', ['t1', 't2', 't3'])])

describe('calcularXp', () => {
  it('sem progresso é 0', () => {
    expect(calcularXp(pequeno, new Set())).toBe(0)
  })

  it('cada tópico vale 10', () => {
    expect(calcularXp(pequeno, new Set(['a.t1', 'b.t2', 'b.t3']))).toBe(30)
  })

  it('concluir uma habilidade soma 50 de bônus', () => {
    // a inteira: 2 tópicos (20) + bônus (50)
    expect(calcularXp(pequeno, marcarHabilidade(pequeno, 'a', new Set()))).toBe(70)
  })

  it('desmarcar reduz o XP (não dá para ganhar pontos repetindo a ação)', () => {
    const completo = marcarHabilidade(pequeno, 'a', new Set())
    const semUm = alternarTopico(completo, 'a.t1')
    expect(calcularXp(pequeno, semUm)).toBe(10) // perde o tópico e o bônus
    expect(calcularXp(pequeno, alternarTopico(semUm, 'a.t1'))).toBe(70) // marcar de novo volta ao mesmo valor
  })

  it('ignora ids que não pertencem ao mapa', () => {
    expect(calcularXp(pequeno, new Set(['nada.x']))).toBe(0)
  })
})

describe('xpRestanteDaHabilidade e xpDaAcao', () => {
  it('restante = tópicos que faltam × 10 + bônus; zero se já concluída', () => {
    const b = pequeno.habilidades.get('b')!
    expect(xpRestanteDaHabilidade(b, new Set())).toBe(3 * 10 + 50)
    expect(xpRestanteDaHabilidade(b, new Set(['b.t1']))).toBe(2 * 10 + 50)
    expect(xpRestanteDaHabilidade(b, marcarHabilidade(pequeno, 'b', new Set()))).toBe(0)
  })

  it('xpDaAcao é a diferença entre o XP depois e antes', () => {
    const antes = new Set(['a.t1'])
    const depois = marcarComPrerequisitos(pequeno, 'b', antes)
    expect(xpDaAcao(pequeno, antes, depois)).toBe(calcularXp(pequeno, depois) - calcularXp(pequeno, antes))
    // a: falta 1 tópico (10) + bônus 50; b: 3 tópicos (30) + bônus 50
    expect(xpDaAcao(pequeno, antes, depois)).toBe(10 + 50 + 30 + 50)
  })
})

describe('XP e níveis com os dados reais do Front-end', () => {
  it('marcar tudo dá o XP total de 2440', () => {
    let topicos = new Set<string>()
    for (const h of frontend.habilidades) topicos = marcarHabilidade(real, h.id, topicos)
    expect(calcularXp(real, topicos)).toBe(2440)
    expect(xpTotalDaCarreira(frontend)).toBe(2440)
  })

  it('os limiares vêm das etapas: 0, 280, 670, 1560 e o total', () => {
    expect(limiaresDosNiveis(frontend)).toEqual([0, 280, 670, 1560, 2440])
  })

  it('os limiares são crescentes e o último é o XP total', () => {
    const limiares = limiaresDosNiveis(frontend)
    for (let i = 1; i < limiares.length; i++) expect(limiares[i]).toBeGreaterThan(limiares[i - 1])
    expect(limiares.at(-1)).toBe(xpTotalDaCarreira(frontend))
  })

  it('na fronteira de cada nível, sobe exatamente no limiar', () => {
    expect(nivelDoXp(frontend, 0).nome).toBe('Semente')
    expect(nivelDoXp(frontend, 279).nome).toBe('Semente')
    expect(nivelDoXp(frontend, 280).nome).toBe('Broto')
    expect(nivelDoXp(frontend, 670).nome).toBe('Muda')
    expect(nivelDoXp(frontend, 1559).nome).toBe('Muda')
    expect(nivelDoXp(frontend, 1560).nome).toBe('Galho')
    expect(nivelDoXp(frontend, 2439).nome).toBe('Galho')
    expect(nivelDoXp(frontend, 2440).nome).toBe('Árvore')
  })

  it('descreve o nível: número, próximo limiar e fração percorrida', () => {
    const n = nivelDoXp(frontend, 475) // Broto: de 280 a 670
    expect(n).toMatchObject({ numero: 2, nome: 'Broto', xpInicio: 280, xpProximo: 670 })
    expect(n.fracao).toBeCloseTo((475 - 280) / (670 - 280))
  })

  it('no nível máximo não há próximo nível e a barra está cheia', () => {
    expect(nivelDoXp(frontend, 2440)).toMatchObject({ numero: 5, xpProximo: null, fracao: 1 })
  })

  it('concluir as etapas em ordem leva exatamente ao nível de cada etapa', () => {
    const etapaDaArea = new Map(frontend.areas.map((a) => [a.id, a.etapa]))
    let topicos = new Set<string>()
    const nomes: string[] = []
    for (const etapa of [1, 2, 3]) {
      for (const h of frontend.habilidades.filter((x) => etapaDaArea.get(x.area) === etapa)) {
        topicos = marcarHabilidade(real, h.id, topicos)
      }
      nomes.push(nivelDoXp(frontend, calcularXp(real, topicos)).nome)
    }
    expect(nomes).toEqual(['Broto', 'Muda', 'Galho'])
  })

  it('se a carreira ganhar tópicos, os limiares acompanham (calculados dos dados)', () => {
    const maior: Carreira = {
      ...frontend,
      habilidades: frontend.habilidades.map((h) =>
        h.id === 'internet' ? { ...h, topicos: [...h.topicos, { id: 'internet.extra', nome: 'Extra' }] } : h,
      ),
    }
    // "internet" está na etapa 1: ganha 10 XP, e todos os limiares seguintes sobem 10
    expect(limiaresDosNiveis(maior)).toEqual([0, 290, 680, 1570, 2450])
  })
})
