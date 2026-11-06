import { describe, expect, it } from 'vitest'
import frontendJson from '../../dados/frontend.json'
import { criarGrafo } from './grafo'
import { calcularNiveis } from './niveis'
import type { Carreira, Habilidade } from './tipos'

function hab(id: string, prerequisitos: string[] = []): Habilidade {
  return { id, nome: id, area: 'x', descricao: '', prerequisitos, origem: 'autores', fontes: [] }
}

describe('calcularNiveis', () => {
  it('raízes ficam no nível 0 e cada habilidade, uma coluna após o pré-requisito', () => {
    const g = criarGrafo([hab('logica'), hab('js', ['logica']), hab('dom', ['js'])])
    const n = calcularNiveis(g)
    expect(n.get('logica')).toBe(0)
    expect(n.get('js')).toBe(1)
    expect(n.get('dom')).toBe(2)
  })

  it('com vários pré-requisitos, vale o caminho mais longo', () => {
    // dom exige js (nível 1) e html-sem (nível 2): fica no nível 3
    const g = criarGrafo([
      hab('logica'),
      hab('html'),
      hab('js', ['logica']),
      hab('html-sem', ['html']),
      hab('html-aprof', ['html-sem']),
      hab('dom', ['js', 'html-aprof']),
    ])
    expect(calcularNiveis(g).get('dom')).toBe(3)
  })

  it('não depende da ordem em que as habilidades aparecem na lista', () => {
    const g = criarGrafo([hab('dom', ['js']), hab('js', ['logica']), hab('logica')])
    expect(calcularNiveis(g).get('dom')).toBe(2)
  })

  it('dá erro se houver ciclo de pré-requisitos', () => {
    const g = criarGrafo([hab('a', ['b']), hab('b', ['a'])])
    expect(() => calcularNiveis(g)).toThrow('Ciclo')
  })

  it('nos dados reais, o DOM fica abaixo de JavaScript e HTML semântico', () => {
    const frontend = frontendJson as Carreira
    const n = calcularNiveis(criarGrafo(frontend.habilidades))
    expect(n.get('dom')).toBeGreaterThan(n.get('js-basico')!)
    expect(n.get('dom')).toBeGreaterThan(n.get('html-semantico')!)
    expect(n.size).toBe(frontend.habilidades.length)
  })
})
