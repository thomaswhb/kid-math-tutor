export interface Problem {
  id: string
  question: string
  answer: number | string
  topic?: string
}

export interface Session {
  gradeId: string
  problems: Problem[]
  answers: (number | null | string)[]
  currentIndex: number
  startedAt: number
}

export interface GradeConfig {
  id: string
  title: string
  subtitle: string
  topics: string[]
  count: number
}

export interface Progress {
  played: number
  bestScore: number
  lastPlayed: string
}
