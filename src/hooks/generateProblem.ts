import type { Problem } from '../types'
import { randInt } from '../utils/helpers'

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function pick<T>(arr: readonly T[]): T {
  return arr[randInt(0, arr.length - 1)]
}

function makeLinearEquation(): Problem {
  const forms = ['ax+b=c', 'ax-b=c', 'ax=c', 'x/b+a=c']
  const form = pick(forms)
  let a = 0
  let b = 0
  let c = 0
  let x = 0
  let a2 = 0

  switch (form) {
    case 'ax+b=c':
      a = randInt(2, 9)
      x = randInt(1, 8)
      b = randInt(1, 20)
      c = a * x + b
      break
    case 'ax-b=c':
      a = randInt(2, 9)
      x = randInt(2, 9)
      b = a * x - randInt(1, 10)
      c = a * x - b
      break
    case 'ax=c':
      a = randInt(2, 12)
      x = randInt(2, 10)
      c = a * x
      break
    case 'x/b+a=c':
      b = randInt(2, 8)
      x = randInt(2, 12) * b
      a2 = randInt(1, 15)
      c = x / b + a2
      break
  }

  let q = ''
  if (form === 'ax+b=c') q = `Solve for x: ${a}x + ${b} = ${c}`
  else if (form === 'ax-b=c') q = `Solve for x: ${a}x - ${b} = ${c}`
  else if (form === 'ax=c') q = `Solve for x: ${a}x = ${c}`
  else q = `Solve for x: x/${b} + ${a2} = ${c}`

  return { id: uid(), question: q, answer: x, topic: 'y9-linear' }
}

function makeBinomialExpand(): Problem {
  const a = randInt(2, 5)
  const b = randInt(1, 8)
  const c = randInt(1, 6)
  const q = `Expand: ${a}(${b}x + ${c})`
  const answer = `${a * b}x + ${a * c}`
  return { id: uid(), question: q, answer, topic: 'y9-expand' }
}

function makeFactoriseMonic(): Problem {
  const x = randInt(2, 7)
  const y = randInt(2, 7)
  const q = `Factorise: x² + ${x + y}x + ${x * y}`
  const answer = `(x + ${x})(x + ${y})`
  return { id: uid(), question: q, answer, topic: 'y9-factorise' }
}

function makeIndexLaw(): Problem {
  const bases = [2, 3, 4, 5, 'x']
  const base = pick(bases)
  const a = randInt(1, 5)
  const b = randInt(1, 5)
  const types = ['multiply', 'divide', 'power']
  const type = pick(types)

  let q = ''
  let answer: number | string = 0

  if (type === 'multiply') {
    q = `Simplify: ${base}^${a} × ${base}^${b}`
    if (typeof base === 'number') answer = base ** (a + b)
    else answer = `${base}^${a + b}`
  } else if (type === 'divide') {
    const larger = Math.max(a, b)
    const smaller = Math.min(a, b)
    if (typeof base === 'number') answer = base ** (larger - smaller)
    else answer = `${base}^${larger - smaller}`
    q = `Simplify: ${base}^${larger} ÷ ${base}^${smaller}`
  } else {
    q = `Simplify: (${base}^${a})²`
    if (typeof base === 'number') answer = base ** (a * 2)
    else answer = `${base}^${a * 2}`
  }

  return { id: uid(), question: q, answer, topic: 'y9-indices' }
}

function makeTrigBasic(): Problem {
  const angles = [
    { deg: 30, sin: 0.5, cos: '√3/2', tan: '1/√3' },
    { deg: 45, sin: '√2/2', cos: '√2/2', tan: 1 },
    { deg: 60, sin: '√3/2', cos: 0.5, tan: '√3' },
  ]
  const angle = pick(angles)
  const funcs = ['sin', 'cos', 'tan']
  const func = pick(funcs)

  const q = `Evaluate: ${func}(${angle.deg}°)`

  let answer: string | number = ''
  if (func === 'sin') answer = angle.sin
  else if (func === 'cos') answer = angle.cos
  else answer = angle.tan

  return { id: uid(), question: q, answer, topic: 'y10-trig-basic' }
}

function makeQuadraticMonicSolve(): Problem {
  const x = randInt(2, 7)
  const y = randInt(2, 7)
  const q = `Solve for x: x² + ${x + y}x + ${x * y} = 0`
  const answer = `x = ${-x} or x = ${-y}`
  return { id: uid(), question: q, answer, topic: 'y10-quadratic-solve' }
}

function makeDiffEvaluate(): Problem {
  const coeff = randInt(2, 8)
  const power = randInt(2, 5)
  const xVal = randInt(1, 5)
  const func = `${coeff}x^${power}`
  const df = `${coeff * power}x^${power - 1}`
  const evaluated = coeff * power * xVal ** (power - 1)
  const q = `Differentiate f(x) = ${func}, then evaluate at x = ${xVal}`
  const ans = `${df} = ${evaluated}`
  return { id: uid(), question: q, answer: ans, topic: 'y11-diff-poly' }
}

const generators: Record<string, () => Problem> = {
  'y9-linear': makeLinearEquation,
  'y9-expand': makeBinomialExpand,
  'y9-factorise': makeFactoriseMonic,
  'y9-indices': makeIndexLaw,
  'y10-trig-basic': makeTrigBasic,
  'y10-factorise-monic': makeFactoriseMonic,
  'y10-quadratic-solve': makeQuadraticMonicSolve,
  'y11-diff-poly': makeDiffEvaluate,
}

export function generateProblem(_gradeId: string, topics: string[]): Problem {
  const topic = topics[randInt(0, topics.length - 1)]
  const gen = generators[topic]
  if (!gen) throw new Error(`No generator for topic: ${topic}`)
  return gen()
}
