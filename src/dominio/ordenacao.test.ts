import { describe, expect, it } from 'vitest'
import frontendJson from '../../dados/frontend.json'
import { criarGrafo } from './grafo'
import { hab } from './fixtures'
import type { Grafo } from './grafo'
import { ordenacaoTopologica, trilhaPersonalizada, validarSemCiclos } from './ordenacao'
import type { Carreira } from './tipos'

// Propriedade que define uma ordenação topológica válida: todo pré-requisito vem antes.
function ordemValida(grafo: Grafo, ordem: string[]): boolean {
  const posicao = new Map(ordem.map((id, i) => [id, i]))
  for (const h of grafo.habilidades.values()) {
    for (const p of h.prerequisitos) {
      if (posicao.get(p)! >= posicao.get(h.id)!) return false
    }
  }
  return true
}

// logica -> js -> dom -> react    e    html -> html-sem -> dom
const pequeno = criarGrafo([
  hab('logica'),
  hab('html'),
  hab('js', ['logica']),
  hab('html-sem', ['html']),
  hab('dom', ['js', 'html-sem']),
  hab('react', ['dom']),
])

describe('ordenacaoTopologica', () => {
  it('gera a ordem esperada no exemplo pequeno', () => {
    const { ordem, sobraram } = ordenacaoTopologica(pequeno)
    // Começam as raízes (logica, html); ao sair uma, quem chegou a zero entra no fim da fila.
    expect(ordem).toEqual(['logica', 'html', 'js', 'html-sem', 'dom', 'react'])
    expect(sobraram).toEqual([])
  })

  it('devolve uma ordem em que todo pré-requisito vem antes', () => {
    expect(ordemValida(pequeno, ordenacaoTopologica(pequeno).ordem)).toBe(true)
  })

  it('não depende da ordem em que as habilidades aparecem na lista', () => {
    const embaralhado = criarGrafo([
      hab('react', ['dom']),
      hab('dom', ['js', 'html-sem']),
      hab('html-sem', ['html']),
      hab('js', ['logica']),
      hab('html'),
      hab('logica'),
    ])
    const { ordem } = ordenacaoTopologica(embaralhado)
    expect(ordem).toHaveLength(6)
    expect(ordemValida(embaralhado, ordem)).toBe(true)
  })

  it('detecta ciclo simples (A exige B e B exige A)', () => {
    const g = criarGrafo([hab('a', ['b']), hab('b', ['a'])])
    const { ordem, sobraram } = ordenacaoTopologica(g)
    expect(ordem).toEqual([])
    expect(sobraram.sort()).toEqual(['a', 'b'])
  })

  it('detecta ciclo de três habilidades', () => {
    const g = criarGrafo([hab('a', ['c']), hab('b', ['a']), hab('c', ['b'])])
    expect(ordenacaoTopologica(g).sobraram.sort()).toEqual(['a', 'b', 'c'])
  })

  it('detecta habilidade que exige a si mesma', () => {
    const g = criarGrafo([hab('a', ['a'])])
    expect(ordenacaoTopologica(g).sobraram).toEqual(['a'])
  })

  it('quem depende de um ciclo também sobra; as independentes entram na ordem', () => {
    const g = criarGrafo([
      hab('livre'),
      hab('a', ['b']),
      hab('b', ['a']),
      hab('depende-do-ciclo', ['a']),
    ])
    const { ordem, sobraram } = ordenacaoTopologica(g)
    expect(ordem).toEqual(['livre'])
    expect(sobraram.sort()).toEqual(['a', 'b', 'depende-do-ciclo'])
  })
})

describe('validarSemCiclos', () => {
  it('não faz nada quando não há ciclo', () => {
    expect(() => validarSemCiclos(pequeno)).not.toThrow()
  })

  it('dá erro listando as habilidades do ciclo', () => {
    const g = criarGrafo([hab('a', ['b']), hab('b', ['a'])])
    expect(() => validarSemCiclos(g)).toThrow('Ciclo')
  })
})

describe('trilhaPersonalizada', () => {
  it('sem nada concluído, devolve todas as habilidades na ordem', () => {
    const t = trilhaPersonalizada(pequeno, new Set())
    expect(t).toHaveLength(6)
    expect(ordemValida(pequeno, t)).toBe(true)
  })

  it('não inclui o que já está concluído e mantém a ordem', () => {
    const t = trilhaPersonalizada(pequeno, new Set(['logica', 'js']))
    expect(t).toEqual(['html', 'html-sem', 'dom', 'react'])
  })

  it('com meta, traz só a meta e os pré-requisitos pendentes', () => {
    const t = trilhaPersonalizada(pequeno, new Set(['logica']), 'dom')
    expect(t).toEqual(['html', 'js', 'html-sem', 'dom'])
  })

  it('com a meta já concluída, devolve lista vazia', () => {
    expect(trilhaPersonalizada(pequeno, new Set(['dom']), 'dom')).toEqual([])
  })

  it('dá erro para meta inexistente', () => {
    expect(() => trilhaPersonalizada(pequeno, new Set(), 'nada')).toThrow('inexistente')
  })

  it('dá erro se o grafo tiver ciclo', () => {
    const g = criarGrafo([hab('a', ['b']), hab('b', ['a'])])
    expect(() => trilhaPersonalizada(g, new Set())).toThrow('Ciclo')
  })
})

describe('com os dados reais do Front-end', () => {
  const frontend = frontendJson as Carreira
  const grafo = criarGrafo(frontend.habilidades)

  it('não tem ciclos e ordena as 25 habilidades sem repetir', () => {
    const { ordem, sobraram } = ordenacaoTopologica(grafo)
    expect(sobraram).toEqual([])
    expect(ordem).toHaveLength(25)
    expect(new Set(ordem).size).toBe(25)
    expect(ordemValida(grafo, ordem)).toBe(true)
  })

  it('a trilha até React traz os 8 pré-requisitos mais o próprio React, em ordem válida', () => {
    const t = trilhaPersonalizada(grafo, new Set(), 'react')
    expect(t).toHaveLength(9)
    expect(t.at(-1)).toBe('react')
    const posicao = new Map(t.map((id, i) => [id, i]))
    for (const id of t) {
      for (const p of grafo.habilidades.get(id)!.prerequisitos) {
        expect(posicao.get(p)!, `${p} deve vir antes de ${id}`).toBeLessThan(posicao.get(id)!)
      }
    }
  })

  it('o mapa de áreas também é acíclico e cada ligação entre áreas avança de etapa', () => {
    // Etapas do design (3A): colunas da trilha.
    const etapa: Record<string, number> = {
      fundamentos: 1, html: 2, css: 3, javascript: 3, ferramentas: 4, qualidade: 4, react: 5,
    }
    const areaDe = new Map(frontend.habilidades.map((h) => [h.id, h.area]))
    const dependeDe = new Map<string, Set<string>>(frontend.areas.map((a) => [a.id, new Set()]))

    for (const h of frontend.habilidades) {
      for (const p of h.prerequisitos) {
        const areaPre = areaDe.get(p)!
        if (areaPre === h.area) continue
        dependeDe.get(h.area)!.add(areaPre)
        expect(etapa[areaPre], `${areaPre} -> ${h.area}`).toBeLessThan(etapa[h.area])
      }
    }

    // Reaproveita o próprio grafo e a validação de ciclos, agora com as áreas como nós.
    const grafoAreas = criarGrafo(
      frontend.areas.map((a) => hab(a.id, [...dependeDe.get(a.id)!], a.id)),
    )
    expect(() => validarSemCiclos(grafoAreas)).not.toThrow()
    expect(dependeDe.size).toBe(7)
  })
})
