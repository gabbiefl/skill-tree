import { describe, expect, it } from 'vitest'
import { lerProgresso, serializarProgresso } from './armazenamento'

const validos = new Set(['a.t1', 'a.t2', 'b.t1'])

describe('serializarProgresso e lerProgresso', () => {
  it('ida e volta devolve os mesmos tópicos', () => {
    const topicos = new Set(['b.t1', 'a.t1'])
    expect(lerProgresso(serializarProgresso(topicos), validos)).toEqual(topicos)
  })

  it('o texto guardado é estável (ordenado) e traz a versão', () => {
    expect(serializarProgresso(new Set(['b.t1', 'a.t1']))).toBe('{"versao":1,"topicos":["a.t1","b.t1"]}')
  })

  it('sem nada guardado, o progresso é vazio', () => {
    expect(lerProgresso(null, validos)).toEqual(new Set())
    expect(lerProgresso('', validos)).toEqual(new Set())
  })

  it('JSON quebrado vira progresso vazio, sem erro', () => {
    expect(lerProgresso('{isso não é json', validos)).toEqual(new Set())
  })

  it('versão desconhecida ou formato errado vira progresso vazio', () => {
    expect(lerProgresso('{"versao":2,"topicos":["a.t1"]}', validos)).toEqual(new Set())
    expect(lerProgresso('{"topicos":["a.t1"]}', validos)).toEqual(new Set())
    expect(lerProgresso('{"versao":1,"topicos":"a.t1"}', validos)).toEqual(new Set())
    expect(lerProgresso('[1,2,3]', validos)).toEqual(new Set())
    expect(lerProgresso('42', validos)).toEqual(new Set())
    expect(lerProgresso('null', validos)).toEqual(new Set())
  })

  it('descarta itens que não são texto e ids que não existem mais', () => {
    const texto = '{"versao":1,"topicos":["a.t1",7,null,"fantasma.x","b.t1"]}'
    expect(lerProgresso(texto, validos)).toEqual(new Set(['a.t1', 'b.t1']))
  })
})
