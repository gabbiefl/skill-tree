import { describe, expect, it } from 'vitest'
import frontendJson from '../../dados/frontend.json'
import { criarGrafo } from './grafo'
import { calcularEstados, sugerirPrerequisitos } from './estados'
import type { Carreira, Habilidade } from './tipos'

// Atalho para montar habilidades de teste sem repetir campos irrelevantes.
function hab(id: string, prerequisitos: string[] = []): Habilidade {
  return { id, nome: id, area: 'x', descricao: '', prerequisitos, origem: 'autores', fontes: [] }
}

// Grafo pequeno, igual ao exemplo da explicação:
// logica -> js -> dom -> react    e    html -> html-sem -> dom
const pequeno = criarGrafo([
  hab('logica'),
  hab('html'),
  hab('js', ['logica']),
  hab('html-sem', ['html']),
  hab('dom', ['js', 'html-sem']),
  hab('react', ['dom']),
])

describe('calcularEstados', () => {
  it('sem nada concluído, só as raízes ficam disponíveis', () => {
    const e = calcularEstados(pequeno, new Set())
    expect(e.get('logica')).toBe('disponivel')
    expect(e.get('html')).toBe('disponivel')
    expect(e.get('js')).toBe('bloqueada')
    expect(e.get('dom')).toBe('bloqueada')
  })

  it('concluir só JavaScript NÃO libera o DOM (falta o HTML semântico)', () => {
    const e = calcularEstados(pequeno, new Set(['logica', 'js']))
    expect(e.get('dom')).toBe('bloqueada')
  })

  it('concluir os dois pré-requisitos libera o DOM', () => {
    const e = calcularEstados(pequeno, new Set(['logica', 'js', 'html', 'html-sem']))
    expect(e.get('dom')).toBe('disponivel')
    expect(e.get('react')).toBe('bloqueada')
  })

  it('habilidade concluída aparece como concluída, mesmo sem os pré-requisitos', () => {
    const e = calcularEstados(pequeno, new Set(['react']))
    expect(e.get('react')).toBe('concluida')
    expect(e.get('dom')).toBe('bloqueada')
  })

  it('árvore é caso particular: com um pré-requisito por nó, vale a regra "pai concluído"', () => {
    const arvore = criarGrafo([
      hab('html'),
      hab('css', ['html']),
      hab('layout', ['css']),
      hab('html-sem', ['html']),
    ])
    const concluidas = new Set(['html'])
    const e = calcularEstados(arvore, concluidas)

    for (const h of arvore.habilidades.values()) {
      if (concluidas.has(h.id)) continue
      const pai = h.prerequisitos[0]
      const regraDaArvore = pai === undefined || concluidas.has(pai)
      expect(e.get(h.id) === 'disponivel', h.id).toBe(regraDaArvore)
    }
  })
})

describe('sugerirPrerequisitos', () => {
  it('lista os ancestrais pendentes, os mais básicos primeiro', () => {
    const s = sugerirPrerequisitos(pequeno, 'dom', new Set())
    expect(s).toHaveLength(4)
    expect(s.indexOf('logica')).toBeLessThan(s.indexOf('js'))
    expect(s.indexOf('html')).toBeLessThan(s.indexOf('html-sem'))
  })

  it('não inclui o que já está concluído', () => {
    const s = sugerirPrerequisitos(pequeno, 'dom', new Set(['logica', 'js']))
    expect(s).toEqual(['html', 'html-sem'])
  })

  it('não repete quando há dois caminhos até a mesma habilidade', () => {
    // a -> b -> d  e  a -> c -> d
    const losango = criarGrafo([hab('a'), hab('b', ['a']), hab('c', ['a']), hab('d', ['b', 'c'])])
    const s = sugerirPrerequisitos(losango, 'd', new Set())
    expect([...s].sort()).toEqual(['a', 'b', 'c'])
  })

  it('devolve lista vazia para uma raiz', () => {
    expect(sugerirPrerequisitos(pequeno, 'logica', new Set())).toEqual([])
  })

  it('dá erro para habilidade inexistente', () => {
    expect(() => sugerirPrerequisitos(pequeno, 'nada', new Set())).toThrow('inexistente')
  })
})

describe('criarGrafo', () => {
  it('dá erro se um pré-requisito não existe', () => {
    expect(() => criarGrafo([hab('dom', ['html-semantic'])])).toThrow('html-semantic')
  })

  it('dá erro se um id se repete', () => {
    expect(() => criarGrafo([hab('a'), hab('a')])).toThrow('repetida')
  })

  it('guarda quem depende de cada habilidade', () => {
    expect(pequeno.dependentes.get('js')).toEqual(['dom'])
    expect(pequeno.dependentes.get('react')).toEqual([])
  })
})

describe('com os dados reais do Front-end', () => {
  const frontend = frontendJson as Carreira
  const grafo = criarGrafo(frontend.habilidades)

  it('sem nada concluído, só as 3 raízes ficam disponíveis', () => {
    const e = calcularEstados(grafo, new Set())
    const disponiveis = [...e].filter(([, estado]) => estado === 'disponivel').map(([id]) => id)
    expect(disponiveis.sort()).toEqual(['internet', 'logica', 'terminal'])
  })

  it('toda habilidade recebe um estado', () => {
    expect(calcularEstados(grafo, new Set()).size).toBe(frontend.habilidades.length)
  })

  it('para aprender React, sugere os 8 pré-requisitos, sem repetir', () => {
    const s = sugerirPrerequisitos(grafo, 'react', new Set())
    expect([...s].sort()).toEqual(
      ['dom', 'html', 'html-semantico', 'internet', 'js-basico', 'logica', 'npm', 'terminal'].sort(),
    )
  })
})
