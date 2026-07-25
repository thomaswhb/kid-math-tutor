import { Problem } from '../types'
import { grades } from '../data/grades'
import { randInt } from '../utils/helpers'

export function generateProblem(gradeId: string): Problem {
  const config = grades.find((g) => g.id === gradeId)
  if (!config) throw new Error(`Unknown grade: ${gradeId}`)

  const op = config.operations[randInt(0, config.operations.length - 1)]
  const [min, max] = config.range
  let a = randInt(min, max)
  let b = randInt(min, max)

  if (op === '-') {
    if (a < b) [a, b] = [b, a]
  }

  const answer = op === '+' ? a + b : a - b
  return { id: `${Date.now()}_${randInt(100, 999)}`, a, b, op, answer }
}
