import { create } from 'zustand'
import type { Problem, Session, GradeConfig } from '../types'
import { generateProblem } from '../hooks/generateProblem'

interface TopicSet {
  [gradeId: string]: string[]
}

const topicMap: TopicSet = {
  'y9-linear': ['y9-linear'],
  'y9-algebra': ['y9-expand', 'y9-factorise', 'y9-indices'],
  'y10-quadratic': ['y10-factorise-monic', 'y10-quadratic-solve'],
  'y10-trig': ['y10-trig-basic'],
  'y11-calculus': ['y11-diff-poly'],
  'y12-adv': ['y11-diff-poly', 'y10-quadratic-solve', 'y9-linear'],
}

export const grades: GradeConfig[] = [
  { id: 'y9-linear', title: 'Year 9 · Linear Equations', subtitle: 'Solve for x and sketch linear relations', topics: ['y9-linear'], count: 10, },
  { id: 'y9-algebra', title: 'Year 9 · Algebra & Indices', subtitle: 'Expand, factorise and index laws', topics: ['y9-expand', 'y9-factorise', 'y9-indices'], count: 10, },
  { id: 'y10-quadratic', title: 'Year 10 · Quadratics', subtitle: 'Factorise and solve monic quadratics', topics: ['y10-factorise-monic', 'y10-quadratic-solve'], count: 10, },
  { id: 'y10-trig', title: 'Year 10 · Trigonometry', subtitle: 'Right-angled triangle trig', topics: ['y10-trig-basic'], count: 10, },
  { id: 'y11-calculus', title: 'Year 11 · Intro Calculus', subtitle: 'Differentiate and evaluate', topics: ['y11-diff-poly'], count: 10, },
  { id: 'y12-adv', title: 'VCE Advanced · Mixed', subtitle: 'Methods/Advanced mixed set', topics: ['y11-diff-poly', 'y10-quadratic-solve', 'y9-linear'], count: 10, },
]

interface SessionState {
  session: Session | null
  init: (gradeId: string, count: number) => void
  submitAnswer: (problemId: string, answer: string) => void
  next: () => void
  reset: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  init: (gradeId, count) => {
    const topics = topicMap[gradeId] || grades.find(g => g.id === gradeId)?.topics || []
    const problems: Problem[] = []
    for (let i = 0; i < count; i++) {
      problems.push(generateProblem(gradeId, topics))
    }
    set({
      session: {
        gradeId,
        problems,
        answers: new Array(count).fill(null),
        currentIndex: 0,
        startedAt: Date.now(),
      },
    })
  },
  submitAnswer: (problemId, answer) =>
    set((state) => {
      if (!state.session) return state
      const idx = state.session.problems.findIndex((p) => p.id === problemId)
      if (idx === -1) return state
      const newAnswers = [...state.session.answers]
      newAnswers[idx] = answer
      return { session: { ...state.session, answers: newAnswers } }
    }),
  next: () =>
    set((state) => {
      if (!state.session) return state
      const next = state.session.currentIndex + 1
      if (next >= state.session.problems.length) return state
      return { session: { ...state.session, currentIndex: next } }
    }),
  reset: () => set({ session: null }),
}))
