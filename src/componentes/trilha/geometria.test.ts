import { describe, expect, it } from 'vitest'
import { caminhoArredondado, rotear } from './geometria'
import type { Medidas } from './geometria'

// Três colunas de 100 de largura, com vão de 20 entre elas.
const medidas: Medidas = {
  esquerdaDaEtapa: new Map([[1, 0], [2, 120], [3, 240]]),
  direitaDaEtapa: new Map([[1, 100], [2, 220], [3, 340]]),
  baseDosBlocos: new Map([[1, 150], [2, 400], [3, 200]]),
}

describe('rotear', () => {
  it('entre colunas vizinhas, sobe ou desce no vão entre elas', () => {
    const pts = rotear({ x: 100, y: 50, etapa: 1 }, { x: 120, y: 150, etapa: 2 }, medidas, 2)
    expect(pts).toEqual([
      { x: 100, y: 50, etapa: 1 },
      { x: 110, y: 50 },
      { x: 110, y: 150 },
      { x: 120, y: 150, etapa: 2 },
    ])
  })

  it('entre colunas distantes, passa por um canal abaixo dos blocos da coluna do meio', () => {
    const pts = rotear({ x: 100, y: 50, etapa: 1 }, { x: 240, y: 150, etapa: 3 }, medidas, 0)
    const canal = pts[2].y
    expect(canal).toBeGreaterThan(400) // abaixo do bloco mais baixo da coluna 2
    expect(pts[3].y).toBe(canal)
    expect(pts).toHaveLength(6)
  })

  it('ligações parecidas ganham folgas diferentes para não se sobrepor', () => {
    const a = rotear({ x: 100, y: 50, etapa: 1 }, { x: 120, y: 150, etapa: 2 }, medidas, 0)
    const b = rotear({ x: 100, y: 50, etapa: 1 }, { x: 120, y: 150, etapa: 2 }, medidas, 1)
    expect(a[1].x).not.toBe(b[1].x)
  })
})

describe('caminhoArredondado', () => {
  it('na mesma altura vira uma reta simples', () => {
    const pts = rotear({ x: 100, y: 50, etapa: 1 }, { x: 120, y: 50, etapa: 2 }, medidas, 2)
    expect(caminhoArredondado(pts)).toBe('M 100 50 L 120 50')
  })

  it('arredonda cada canto com uma curva', () => {
    const d = caminhoArredondado([{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }])
    expect(d).toBe('M 0 0 L 88 0 Q 100 0 100 12 L 100 100')
  })

  it('limita o raio à metade do trecho, para a curva não passar do canto seguinte', () => {
    const d = caminhoArredondado([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 100 }], 12)
    expect(d).toContain('L 5 0 Q 10 0 10 5') // raio 5, e não 12
  })

  it('devolve texto vazio com menos de dois pontos', () => {
    expect(caminhoArredondado([{ x: 1, y: 1 }])).toBe('')
  })
})
