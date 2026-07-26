import { describe, it, expect } from 'vitest'
import { generateProblem } from './generateProblem'

describe('generateProblem', () => {
  it('generates algebra problems for year 9', () => {
    const p = generateProblem('y9-algebra')
    expect(['+', '-', '*', '/']).toContain(p.op)
    expect(p.a).toBeGreaterThanOrEqual(1)
    expect(p.a).toBeLessThanOrEqual(999)
    expect(p.b).toBeGreaterThanOrEqual(1)
    expect(p.b).toBeLessThanOrEqual(999)
  })

  it('generates non-negative answers', () => {
    for (let i = 0; i < 50; i++) {
      const p = generateProblem('y9-algebra')
      expect(p.answer).toBeGreaterThanOrEqual(0)
    }
  })

  it('division always yields integer answers', () => {
    for (let i = 0; i < 50; i++) {
      const p = generateProblem('y9-algebra')
      if (p.op === '/') {
        expect(p.a % p.b).toBe(0)
        expect(p.answer).toBe(p.a / p.b)
      }
    }
  })

  it('answers match the operation', () => {
    for (let i = 0; i < 100; i++) {
      const p = generateProblem('y9-algebra')
      switch (p.op) {
        case '+':
          expect(p.answer).toBe(p.a + p.b)
          break
        case '-':
          expect(p.answer).toBe(p.a - p.b)
          break
        case '*':
          expect(p.answer).toBe(p.a * p.b)
          break
        case '/':
          expect(p.answer).toBe(Math.floor(p.a / p.b))
          break
      }
    }
  })
})
