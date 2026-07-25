import { describe, it, expect } from 'vitest'
import { generateProblem } from './generateProblem'

describe('generateProblem', () => {
  it('generates addition within range for g1-add', () => {
    const p = generateProblem('g1-add')
    expect(p.op).toBe('+')
    expect(p.a).toBeGreaterThanOrEqual(1)
    expect(p.a).toBeLessThanOrEqual(20)
    expect(p.b).toBeGreaterThanOrEqual(1)
    expect(p.b).toBeLessThanOrEqual(20)
    expect(p.answer).toBe(p.a + p.b)
  })

  it('ensures non-negative subtraction', () => {
    for (let i = 0; i < 50; i++) {
      const p = generateProblem('g1-sub')
      expect(p.answer).toBeGreaterThanOrEqual(0)
    }
  })
})
