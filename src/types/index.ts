export interface Problem {
  id: string
  a: number
  b: number
  op: '+' | '-' | '*' | '/'
  answer: number
}

export interface Session {
  gradeId: string
  problems: Problem[]
  answers: (number | null)[]
  currentIndex: number
  startedAt: number
}

export interface GradeConfig {
  id: string
  title: string
  subtitle: string
  range: [number, number]
  operations: ('+' | '-' | '*' | '/')[]
  count: number
}

export interface Progress {
  played: number
  bestScore: number
  lastPlayed: string
}
