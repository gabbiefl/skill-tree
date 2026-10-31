import { describe, expect, it } from 'vitest'
import frontendJson from '../../dados/frontend.json'
import type { Carreira } from './tipos'

// O "as" diz ao TypeScript que o JSON segue o molde Carreira.
// Os testes abaixo conferem de fato se as regras de consistência valem.
const frontend = frontendJson as Carreira
const ids = frontend.habilidades.map((h) => h.id)
const areas = frontend.areas.map((a) => a.id)

describe('dados da carreira Front-end', () => {
  it('tem 25 habilidades', () => {
    expect(frontend.habilidades).toHaveLength(25)
  })

  it('não repete ids de habilidades', () => {
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('só usa pré-requisitos que existem', () => {
    for (const h of frontend.habilidades) {
      for (const p of h.prerequisitos) {
        expect(ids, `${h.id} exige "${p}", que não existe`).toContain(p)
      }
    }
  })

  it('não tem habilidade que exige a si mesma', () => {
    for (const h of frontend.habilidades) {
      expect(h.prerequisitos).not.toContain(h.id)
    }
  })

  it('só usa áreas que existem', () => {
    for (const h of frontend.habilidades) {
      expect(areas, `${h.id} usa a área "${h.area}", que não existe`).toContain(h.area)
    }
  })

  it('tem pelo menos um ponto de entrada (sem pré-requisitos)', () => {
    expect(frontend.habilidades.some((h) => h.prerequisitos.length === 0)).toBe(true)
  })

  it('cita a fonte de toda habilidade que vem do roadmap.sh', () => {
    for (const h of frontend.habilidades.filter((x) => x.origem === 'roadmap.sh')) {
      expect(h.fontes.length, `${h.id} sem fonte`).toBeGreaterThan(0)
    }
  })
})
