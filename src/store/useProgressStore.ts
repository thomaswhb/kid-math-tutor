import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { type Progress } from '../types'

interface ProgressState {
  progress: Record<string, Progress>
  update: (gradeId: string, score: number) => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      progress: {},
      update: (gradeId, score) =>
        set((state) => {
          const prev = state.progress[gradeId]
          const updated: Progress = {
            played: (prev?.played ?? 0) + 1,
            bestScore: Math.max(prev?.bestScore ?? 0, score),
            lastPlayed: new Date().toISOString(),
          }
          return { progress: { ...state.progress, [gradeId]: updated } }
        }),
    }),
    {
      name: 'math-progress',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
