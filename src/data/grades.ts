import type { GradeConfig } from '../types'

export const grades: GradeConfig[] = [
  {
    id: 'y9-linear',
    title: 'Year 9 · Linear Equations',
    subtitle: 'Solve for x and interpret graphs',
    topics: ['y9-linear'],
    count: 10,
  },
  {
    id: 'y9-algebra',
    title: 'Year 9 · Algebra & Indices',
    subtitle: 'Expand, factorise and index laws',
    topics: ['y9-expand', 'y9-factorise', 'y9-indices'],
    count: 10,
  },
  {
    id: 'y10-quadratic',
    title: 'Year 10 · Quadratics',
    subtitle: 'Factorise and solve monic quadratics',
    topics: ['y10-factorise-monic', 'y10-quadratic-solve'],
    count: 10,
  },
  {
    id: 'y10-trig',
    title: 'Year 10 · Trigonometry',
    subtitle: 'Right-angled triangle trig',
    topics: ['y10-trig-basic'],
    count: 10,
  },
  {
    id: 'y11-calculus',
    title: 'Year 11 · Intro Calculus',
    subtitle: 'Differentiate and evaluate',
    topics: ['y11-diff-poly'],
    count: 10,
  },
  {
    id: 'y12-adv',
    title: 'VCE Advanced · Mixed',
    subtitle: 'Methods/Advanced mixed set',
    topics: ['y11-diff-poly', 'y10-quadratic-solve', 'y9-linear'],
    count: 10,
  },
]
