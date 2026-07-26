import type { Problem } from '../types'
import { randInt } from '../utils/helpers'

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function pick<T>(arr: readonly T[]): T {
  return arr[randInt(0, arr.length - 1)]
}

function makeLinearEquation(): Problem {
  const templates = [
    function () {
      const m = randInt(2, 9)
      const x = randInt(-6, 6)
      const c = randInt(-15, 15)
      return { q: `Solve for x: ${m}x + ${c} = ${m * x + c}`, answer: x }
    },
    function () {
      const m = randInt(2, 9)
      const x = randInt(1, 8)
      const c = randInt(1, 20)
      return { q: `Solve for x: ${m}x + ${c} = ${m * x + c}`, answer: x }
    },
    function () {
      const m = randInt(2, 9)
      const x = randInt(1, 8)
      const c = randInt(1, 20)
      return { q: `Solve for x: ${m}x - ${c} = ${m * x - c}`, answer: x }
    },
    function () {
      const x = randInt(1, 8)
      const m = randInt(2, 12)
      return { q: `Solve for x: ${m}x = ${m * x}`, answer: x }
    },
    function () {
      const denom = pick([2, 3, 4, 5])
      const x = randInt(1, 8) * denom
      const add = randInt(1, 12)
      return { q: `Solve for x: x/${denom} + ${add} = ${x / denom + add}`, answer: x }
    },
    function () {
      const x = randInt(1, 8)
      const b = randInt(2, 10)
      const add = randInt(1, 15)
      return { q: `Solve for x: x/${b} + ${add} = ${x / b + add}`, answer: x }
    },
    function () {
      const x = randInt(1, 8)
      const a = randInt(1, 12)
      const b = randInt(-10, 10)
      return { q: `Solve for x: ${a}x + ${b} = ${a * x + b}`, answer: x }
    },
    function () {
      const x = randInt(1, 8)
      const a = randInt(2, 8)
      const b = randInt(1, 12)
      return { q: `Solve for x: ${a}(x + ${b}) = ${a * (x + b)}`, answer: x }
    },
    function () {
      const x = randInt(1, 8)
      const a = randInt(2, 5)
      const b = randInt(1, 10)
      return { q: `Solve for x: ${a}x + ${b} = ${a * x + b}`, answer: x }
    },
    function () {
      const x = randInt(-8, 8)
      const a = randInt(2, 8)
      return { q: `Solve for x: (${a})x = ${a * x}`, answer: x }
    },
    function () {
      const x = randInt(1, 9)
      const y = randInt(2, 8)
      return { q: `Solve for x: ${y}x + ${randInt(1, 10)} = ${y * x + randInt(1, 10)}`, answer: x }
    },
  ]
  const { q, answer } = pick(templates)()
  return { id: uid(), question: q, answer, topic: 'y9-linear' }
}

function expandTwoBinomials(): Problem {
  const a = randInt(2, 8)
  const c = randInt(1, 10)
  const d = randInt(1, 10)
  const q = `Expand: (${a}x + ${c})(x + ${d})`
  const answer = `${a}x² + ${a * d + c}x + ${c * d}`
  return { id: uid(), question: q, answer, topic: 'y9-expand' }
}

function factoriseMonic(): Problem {
  const x = randInt(2, 10)
  const y = randInt(2, 10)
  const q = `Factorise: x² + ${x + y}x + ${x * y}`
  const answer = `(x + ${x})(x + ${y})`
  return { id: uid(), question: q, answer, topic: 'y10-factorise-monic' }
}

function factoriseDifferenceOfSquares(): Problem {
  const a = randInt(1, 10)
  const q = `Factorise: x² - ${a * a}`
  const answer = `(x + ${a})(x - ${a})`
  return { id: uid(), question: q, answer, topic: 'y9-factorise' }
}

function makeIndexLaw(): Problem {
  const bases = ['2', '3', '4', '5', 'x']
  const base = pick(bases)
  const a = randInt(1, 6)
  const b = randInt(1, 6)
  const types = ['multiply', 'divide', 'power', 'mixed']
  const type = pick(types)

  let q = ''
  let answer: number | string = ''

  if (type === 'multiply') {
    q = `Simplify: ${base}^${a} × ${base}^${b}`
    answer = `${base}^${a + b}`
  } else if (type === 'divide') {
    const larger = Math.max(a, b)
    const smaller = Math.min(a, b)
    q = `Simplify: ${base}^${larger} ÷ ${base}^${smaller}`
    answer = `${base}^${larger - smaller}`
  } else if (type === 'power') {
    q = `Simplify: (${base}^${a})^${b}`
    answer = `${base}^${a * b}`
  } else {
    const c = randInt(1, 5)
    const exp = a + b - c
    q = `Simplify: (${base}^${a} × ${base}^${b}) / ${base}^${c}`
    answer = `${base}^${exp}`
  }

  return { id: uid(), question: q, answer, topic: 'y9-indices' }
}

function makeTrigBasic(): Problem {
  const angles = [
    { deg: 30, sin: '1/2', cos: '√3/2', tan: '1/√3' },
    { deg: 45, sin: '√2/2', cos: '√2/2', tan: 1 },
    { deg: 60, sin: '√3/2', cos: '1/2', tan: '√3' },
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
  const x = randInt(2, 10)
  const y = randInt(2, 10)
  const q = `Solve for x: x² + ${x + y}x + ${x * y} = 0`
  const answer = `x = ${-x} or x = ${-y}`
  return { id: uid(), question: q, answer, topic: 'y10-quadratic-solve' }
}

function makeDiffEvaluate(): Problem {
  const coeff = randInt(2, 9)
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
  'y9-expand': expandTwoBinomials,
  'y9-factorise': factoriseDifferenceOfSquares,
  'y9-indices': makeIndexLaw,
  'y10-trig-basic': makeTrigBasic,
  'y10-factorise-monic': factoriseMonic,
  'y10-quadratic-solve': makeQuadraticMonicSolve,
  'y11-diff-poly': makeDiffEvaluate,
}

export function generateProblem(_gradeId: string, topics: string[]): Problem {
  const topic = topics[randInt(0, topics.length - 1)]
  const gen = generators[topic]
  if (!gen) throw new Error(`No generator for topic: ${topic}`)
  return gen()
}
