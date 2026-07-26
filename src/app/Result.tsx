import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { Home, RotateCcw } from 'lucide-react'
import { useProgressStore } from '../store/useProgressStore'
import { grades } from '../data/grades'
import { useSessionStore } from '../store/useSessionStore'

export default function Result() {
  const { gradeId } = useParams<{ gradeId: string }>()
  const navigate = useNavigate()
  const session = useSessionStore.getState().session
  const progress = useProgressStore((s) => s.progress[gradeId ?? ''])
  const grade = grades.find((g) => g.id === gradeId)

  if (!session || !grade) {
    return <Navigate to="/" replace />
  }

  const { problems, answers } = session
  let correct = 0
  const wrongs: { question: string; yours: string | number | null; answer: string | number }[] = []

  problems.forEach((p, i) => {
    const raw = answers[i]
    const expected = p.answer
    let isCorrect = false
    if (raw === null || raw === undefined || raw === '') {
      isCorrect = false
    } else if (typeof expected === 'number' && typeof raw === 'number') {
      if (Number.isInteger(expected) && Number.isInteger(raw)) isCorrect = expected === raw
      else isCorrect = Math.abs(expected - (raw as number)) < 1e-6
    } else {
      isCorrect = String(raw).replace(/\s/g, '').toLowerCase() === String(expected).replace(/\s/g, '').toLowerCase()
    }
    if (isCorrect) correct++
    else wrongs.push({ question: p.question, yours: raw, answer: expected })
  })

  const percent = Math.round((correct / problems.length) * 100)
  const star =
    percent >= 90 ? '⭐⭐⭐' : percent >= 70 ? '⭐⭐' : percent >= 50 ? '⭐' : '💪'

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">{star}</div>
          <h1 className="text-2xl font-bold">Round Complete</h1>
          <p className="text-slate-400 mt-1">{grade.title}</p>
        </div>

        <div className="bg-surface border border-white/10 rounded-3xl p-6 mb-6 shadow-2xl shadow-black/30 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-6xl font-bold text-indigo-300 tabular-nums">{percent}</div>
            <div className="text-slate-400 mt-1">percent</div>
            <div className="mt-3 text-sm text-slate-400">
              {correct} / {problems.length} correct
            </div>
            {progress && (
              <div className="mt-2 text-xs text-slate-500">
                Best: {progress.bestScore} · Played {progress.played} times
              </div>
            )}
          </div>
        </div>

        {wrongs.length > 0 && (
          <div className="bg-surface border border-white/10 rounded-3xl p-5 mb-6 backdrop-blur-sm">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-indigo-300" />
              Review
            </h2>
            <div className="space-y-3">
              {wrongs.map((w, i) => (
                <div key={i} className="bg-slate-950/60 rounded-xl p-4">
                  <div className="text-base text-slate-200 mb-2">{w.question}</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-red-300">Your answer: {w.yours ?? 'blank'}</span>
                    <span className="text-emerald-300">Correct: {String(w.answer)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate(`/practice/${gradeId}`)}
            className="py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-2xl active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" /> Home
          </button>
        </div>
      </div>
    </div>
  )
}
