import { type Problem } from '../types'
import { grades } from '../data/grades'
import { randInt } from '../utils/helpers'

export function generateProblem(gradeId: string): Problem {
  const config = grades.find((g) => g.id === gradeId)
  if (!config) throw new Error(`Unknown grade: ${gradeId}`)

  const [min, max] = config.range
  const op = config.operations[randInt(0, config.operations.length - 1)]

  if (op === '+') {
    const a = randInt(min, max)
    const b = randInt(min, max)
    return { id: `${Date.now()}_${randInt(100, 999)}`, a, b, op: '+', answer: a + b }
  }

  if (op === '-') {
    let a = randInt(min, max)
    let b = randInt(min, max)
    if (a < b) [a, b] = [b, a]
    return { id: `${Date.now()}_${randInt(100, 999)}`, a, b, op: '-', answer: a - b }
  }

  if (op === '*') {
    const a = randInt(min, max)
    const b = randInt(min, max)
    return { id: `${Date.now()}_${randInt(100, 999)}`, a, b, op: '*', answer: a * b }
  }

  if (op === '/') {
    const b = randInt(min, max)
    const answer = randInt(min, Math.floor(max / b))
    const a = b * answer
    return { id: `${Date.now()}_${randInt(100, 999)}`, a, b, op: '/', answer }
  }

  throw new Error(`Unsupported operation: ${op}`)
}
