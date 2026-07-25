import { create } from 'zustand'
import { type Problem, type Session } from '../types'
import { generateProblem } from '../hooks/generateProblem'

interface SessionState {
  session: Session | null
  init: (gradeId: string, count: number) => void
  submitAnswer: (problemId: string, answer: number | null) => void
  next: () => void
  reset: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  init: (gradeId, count) => {
    const problems: Problem[] = []
    for (let i = 0; i < count; i++) {
      problems.push(generateProblem(gradeId))
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
