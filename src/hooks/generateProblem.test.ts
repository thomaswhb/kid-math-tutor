import { describe, it, expect } from 'vitest'
import { generateProblem } from './generateProblem'

describe('generateProblem', () => {
  it('generates linear equation question', () => {
    const p = generateProblem('y9-linear', ['y9-linear'])
    expect(p.question).toContain('Solve for x')
    expect(p.answer).toBeTypeOf('number')
  })

  it('generates binomial expand question', () => {
    const p = generateProblem('y9-algebra', ['y9-expand'])
    expect(p.question).toContain('Expand')
    expect(p.answer).toContain('x')
  })

  it('generates factorise question', () => {
    const p = generateProblem('y9-algebra', ['y9-factorise'])
    expect(p.question).toContain('Factorise')
    expect(p.topic).toBe('y9-factorise')
  })

  it('generates mixed/law index question', () => {
    const p = generateProblem('y9-algebra', ['y9-indices'])
    expect(p.question).toMatch(/Simplify:/)
  })
})
