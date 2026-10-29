import { describe, expect, it } from 'vitest'

// Teste provisório: só confirma que o Vitest roda. Será removido na Fase 2,
// quando entrarem os testes reais das regras de liberação.
describe('ambiente de testes', () => {
  it('executa um teste simples', () => {
    expect(1 + 1).toBe(2)
  })
})
