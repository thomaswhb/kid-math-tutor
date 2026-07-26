import type { GradeConfig } from '../types'

export const grades: GradeConfig[] = [
  // Year 9
  {
    id: 'y9-algebra',
    title: 'Year 9 · Linear Equations',
    subtitle: 'Solving equations and simplifying',
    range: [1, 999],
    operations: ['+', '-', '*', '/'],
    count: 10,
  },
  {
    id: 'y9-number',
    title: 'Year 9 · Indices & Roots',
    subtitle: 'Squares, cubes and roots',
    range: [1, 20],
    operations: ['+', '-', '*', '/'],
    count: 10,
  },
  // Year 10
  {
    id: 'y10-quadratic',
    title: 'Year 10 · Quadratics',
    subtitle: 'Factorising and expanding',
    range: [1, 30],
    operations: ['+', '-', '*'],
    count: 10,
  },
  {
    id: 'y10-trig',
    title: 'Year 10 · Trigonometry',
    subtitle: 'Special angles sin/cos/tan',
    range: [1, 12],
    operations: ['*', '/'],
    count: 10,
  },
  // Year 11
  {
    id: 'y11-calculus',
    title: 'Year 11 · Intro Calculus',
    subtitle: 'Differentiating polynomials',
    range: [1, 50],
    operations: ['+', '-', '*'],
    count: 10,
  },
  // Year 12 VCE Advanced
  {
    id: 'y12-adv',
    title: 'VCE Advanced · Mixed',
    subtitle: 'Calculus + stats + vectors',
    range: [1, 100],
    operations: ['+', '-', '*', '/'],
    count: 10,
  },
]
