import { describe, expect, it } from 'vitest'
import frontendJson from '../../dados/frontend.json'
import { calcularEstados } from './estados'
import { hab } from './fixtures'
import { criarGrafo } from './grafo'
import {
  alternarTopico,
  calcularConcluidas,
  desmarcarHabilidade,
  marcarComPrerequisitos,
  marcarHabilidade,
  progressoDaHabilidade,
} from './progresso'
import type { Carreira } from './tipos'

// logica (2 tópicos) -> js (3) -> dom (2) -> react (2)    e    html (2) -> html-sem (2) -> dom
const grafo = criarGrafo([
  hab('logica', [], 'x', ['a', 'b']),
  hab('html', [], 'x', ['a', 'b']),
  hab('js', ['logica'], 'x', ['a', 'b', 'c']),
  hab('html-sem', ['html'], 'x', ['a', 'b']),
  hab('dom', ['js', 'html-sem'], 'x', ['a', 'b']),
  hab('react', ['dom'], 'x', ['a', 'b']),
])

describe('calcularConcluidas', () => {
  it('sem tópicos concluídos, nenhuma habilidade está concluída', () => {
    expect(calcularConcluidas(grafo, new Set())).toEqual(new Set())
  })

  it('só conclui a habilidade quando TODOS os tópicos estão marcados', () => {
    const todos = new Set(['logica.a', 'logica.b'])
    expect(calcularConcluidas(grafo, todos)).toEqual(new Set(['logica']))

    const faltaUm = new Set(['js.a', 'js.b'])
    expect(calcularConcluidas(grafo, faltaUm).has('js')).toBe(false)
  })

  it('habilidade sem tópicos nunca conta como concluída', () => {
    const g = criarGrafo([hab('vazia')])
    expect(calcularConcluidas(g, new Set()).has('vazia')).toBe(false)
  })
})

describe('progresso parcial e estados', () => {
  it('conta tópicos feitos e total', () => {
    const js = grafo.habilidades.get('js')!
    expect(progressoDaHabilidade(js, new Set(['js.a', 'js.c', 'logica.a']))).toEqual({ feitos: 2, total: 3 })
  })

  it('habilidade com progresso parcial continua disponível e a dependente continua bloqueada', () => {
    // logica concluída; js com 2 de 3 tópicos
    const topicos = new Set(['logica.a', 'logica.b', 'js.a', 'js.b'])
    const estados = calcularEstados(grafo, calcularConcluidas(grafo, topicos))
    expect(estados.get('js')).toBe('disponivel')
    expect(estados.get('dom')).toBe('bloqueada')
  })

  it('completar o último tópico conclui a habilidade e libera quem só dependia dela', () => {
    const topicos = new Set(['logica.a', 'logica.b', 'js.a', 'js.b', 'js.c', 'html.a', 'html.b', 'html-sem.a', 'html-sem.b'])
    const estados = calcularEstados(grafo, calcularConcluidas(grafo, topicos))
    expect(estados.get('js')).toBe('concluida')
    expect(estados.get('dom')).toBe('disponivel')
  })
})

describe('marcar e desmarcar', () => {
  it('marcarHabilidade marca todos os tópicos dela e só os dela', () => {
    const novo = marcarHabilidade(grafo, 'js', new Set())
    expect(novo).toEqual(new Set(['js.a', 'js.b', 'js.c']))
  })

  it('desmarcarHabilidade tira todos os tópicos dela e preserva os outros', () => {
    const inicial = new Set(['js.a', 'js.b', 'js.c', 'logica.a'])
    expect(desmarcarHabilidade(grafo, 'js', inicial)).toEqual(new Set(['logica.a']))
  })

  it('alternarTopico marca e desmarca um tópico', () => {
    const marcado = alternarTopico(new Set(), 'js.a')
    expect(marcado).toEqual(new Set(['js.a']))
    expect(alternarTopico(marcado, 'js.a')).toEqual(new Set())
  })

  it('não altera o conjunto recebido (devolve um novo)', () => {
    const original = new Set(['logica.a'])
    marcarHabilidade(grafo, 'js', original)
    desmarcarHabilidade(grafo, 'logica', original)
    alternarTopico(original, 'js.a')
    marcarComPrerequisitos(grafo, 'dom', original)
    expect(original).toEqual(new Set(['logica.a']))
  })

  it('dá erro para habilidade inexistente', () => {
    expect(() => marcarHabilidade(grafo, 'nada', new Set())).toThrow('inexistente')
  })

  it('desmarcar um tópico desfaz a conclusão da habilidade', () => {
    const completo = marcarHabilidade(grafo, 'logica', new Set())
    expect(calcularConcluidas(grafo, completo).has('logica')).toBe(true)

    const semUm = alternarTopico(completo, 'logica.a')
    expect(calcularConcluidas(grafo, semUm).has('logica')).toBe(false)
    expect(calcularEstados(grafo, calcularConcluidas(grafo, semUm)).get('logica')).toBe('disponivel')
  })

  it('desmarcar uma habilidade bloqueia de novo quem dependia só dela', () => {
    const g = criarGrafo([hab('x', [], 'x', ['a']), hab('y', ['x'], 'x', ['a'])])
    const completo = marcarHabilidade(g, 'x', new Set())
    expect(calcularEstados(g, calcularConcluidas(g, completo)).get('y')).toBe('disponivel')

    const desfeito = desmarcarHabilidade(g, 'x', completo)
    expect(calcularEstados(g, calcularConcluidas(g, desfeito)).get('y')).toBe('bloqueada')
  })
})

describe('marcarComPrerequisitos', () => {
  it('conclui a habilidade e todos os pré-requisitos pendentes', () => {
    const novo = marcarComPrerequisitos(grafo, 'dom', new Set())
    const concluidas = calcularConcluidas(grafo, novo)
    expect(concluidas).toEqual(new Set(['logica', 'js', 'html', 'html-sem', 'dom']))
  })

  it('respeita o que já estava concluído e não mexe em quem está fora do caminho', () => {
    const inicial = new Set(['logica.a', 'logica.b'])
    const novo = marcarComPrerequisitos(grafo, 'dom', inicial)
    expect(calcularConcluidas(grafo, novo).has('react')).toBe(false)
    expect(calcularConcluidas(grafo, novo).has('logica')).toBe(true)
  })

  it('de uma raiz, conclui só ela', () => {
    expect(calcularConcluidas(grafo, marcarComPrerequisitos(grafo, 'html', new Set()))).toEqual(new Set(['html']))
  })
})

describe('com os dados reais do Front-end', () => {
  const frontend = frontendJson as Carreira
  const real = criarGrafo(frontend.habilidades)

  it('"Sim, marcar todas" em React conclui React e os 8 pré-requisitos', () => {
    const novo = marcarComPrerequisitos(real, 'react', new Set())
    const concluidas = calcularConcluidas(real, novo)
    expect([...concluidas].sort()).toEqual(
      ['dom', 'html', 'html-semantico', 'internet', 'js-basico', 'logica', 'npm', 'react', 'terminal'].sort(),
    )
  })

  it('marcar todos os tópicos de todas as habilidades conclui o mapa inteiro', () => {
    let topicos = new Set<string>()
    for (const h of frontend.habilidades) topicos = marcarHabilidade(real, h.id, topicos)
    expect(calcularConcluidas(real, topicos).size).toBe(frontend.habilidades.length)
  })
})
