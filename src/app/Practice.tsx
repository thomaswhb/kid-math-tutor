import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useSessionStore } from '../store/useSessionStore'
import { useProgressStore } from '../store/useProgressStore'
import { grades } from '../data/grades'
import { type Problem } from '../types'

export default function Practice() {
  const { gradeId } = useParams<{ gradeId: string }>()
  const navigate = useNavigate()
  const session = useSessionStore((s) => s.session)
  const init = useSessionStore((s) => s.init)
  const submit = useSessionStore((s) => s.submitAnswer)
  const next = useSessionStore((s) => s.next)
  const grade = grades.find((g) => g.id === gradeId)

  const current = session?.problems[session.currentIndex]
  const currentAnswer = session?.answers[session.currentIndex]
  const isLast = session ? session.currentIndex === session.problems.length - 1 : false

  const [hasFeedback, setHasFeedback] = useState(false)

  useEffect(() => {
    if (!gradeId || !grade) {
      navigate('/')
      return
    }
    init(gradeId, grade.count)
    setHasFeedback(false)
  }, [gradeId, grade, init, navigate])

  useEffect(() => {
    setHasFeedback(false)
  }, [session?.currentIndex])

  if (!session || !current) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading...
      </div>
    )
  }

  const handleCheck = () => {
    if (currentAnswer !== null && currentAnswer !== undefined && currentAnswer !== '') {
      setHasFeedback(true)
    }
  }

  const handleNext = () => {
    if (isLast) {
      const score = calcScore(session.problems, session.answers)
      useProgressStore.getState().update(gradeId!, score)
      navigate(`/result/${gradeId}`)
    } else {
      next()
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-slate-100">{grade?.title}</h1>
            <div className="flex gap-1 mt-1">
              {session.problems.map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 flex-1 rounded-full transition-colors duration-300 bg-slate-800"
                  style={{
                    backgroundColor:
                      i < session.currentIndex
                        ? '#34d399'
                        : i === session.currentIndex
                          ? '#6366f1'
                          : 'rgba(255,255,255,0.05)',
                  }}
                />
              ))}
            </div>
          </div>
          <span className="text-sm text-slate-400 tabular-nums">
            {session.currentIndex + 1}/{session.problems.length}
          </span>
        </div>

        <div className="bg-surface border border-white/10 rounded-3xl p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-sm">
          <div className="text-left text-xl sm:text-2xl font-semibold mb-6 text-slate-100 leading-relaxed">
            {current.question}
          </div>

          <div className="flex flex-col items-center justify-center gap-3">
            <input
              type="text"
              inputMode="text"
              value={currentAnswer ?? ''}
              onChange={(e) => {
                submit(current.id, e.target.value)
                if (hasFeedback) setHasFeedback(false)
              }}
              disabled={hasFeedback}
              className="w-full max-w-xs text-center text-xl font-bold bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-400 focus:bg-white/10 transition-all disabled:opacity-70"
              placeholder="Enter answer"
              autoFocus
            />
            {!hasFeedback ? (
              <button
                onClick={handleCheck}
                disabled={currentAnswer === null || currentAnswer === undefined || currentAnswer === ''}
                className="px-8 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-2xl disabled:opacity-40 active:scale-95 transition-all shadow-lg shadow-indigo-500/20 w-full max-w-xs"
              >
                Check
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-2xl active:scale-95 transition-all shadow-lg shadow-indigo-500/20 w-full max-w-xs"
              >
                {isLast ? 'Finish' : 'Next'}
              </button>
            )}
          </div>

          {hasFeedback && (() => {
            const raw = typeof currentAnswer === 'string' ? currentAnswer : currentAnswer
            const expected = current.answer
            const ok =
              raw === null || raw === undefined || raw === ''
                ? false
                : typeof expected === 'number' && typeof raw === 'number'
                  ? (Number.isInteger(expected) && Number.isInteger(raw)
                      ? expected === raw
                      : Math.abs(expected - (raw as number)) < 1e-6)
                  : String(raw).replace(/\s/g, '').toLowerCase() === String(expected).replace(/\s/g, '').toLowerCase()
            return (
              <div className="mt-8 text-lg">
                {ok ? (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/20">
                    Correct! Great work
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-300 font-semibold border border-red-500/20">
                    Answer: {String(current.answer)}
                  </span>
                )}
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

function calcScore(problems: Problem[], answers: (number | null | string)[]): number {
  let correct = 0
  for (let i = 0; i < problems.length; i++) {
    const raw = answers[i]
    const expected = problems[i].answer
    if (raw === null || raw === undefined || raw === '') continue
    if (typeof expected === 'number' && typeof raw === 'number') {
      if (Number.isInteger(expected) && Number.isInteger(raw)) {
        if (expected === raw) correct++
      } else if (Math.abs(expected - (raw as number)) < 1e-6) {
        correct++
      }
    } else if (String(raw).replace(/\s/g, '').toLowerCase() === String(expected).replace(/\s/g, '').toLowerCase()) {
      correct++
    }
  }
  return Math.round((correct / problems.length) * 100)
}
