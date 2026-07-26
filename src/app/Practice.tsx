import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useSessionStore } from '../store/useSessionStore'
import { useProgressStore } from '../store/useProgressStore'
import { grades } from '../data/grades'
import { type Problem } from '../types'

const CALC_TOPICS = new Set(['y10-trig-basic', 'y11-diff-poly'])

function computeCalcResult(expr: string): number | null {
  const sanitized = expr.replace(/[^0-9+\-*/().^√%]|sin|cos|tan|PI|E/gi, '')
  if (!sanitized.trim()) return null
  let e = sanitized
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/\^/g, '**')
    .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)')
    .replace(/(?<!Math\.)sin\(([^)]+)\)/g, 'Math.sin(($1)*Math.PI/180)')
    .replace(/(?<!Math\.)cos\(([^)]+)\)/g, 'Math.cos(($1)*Math.PI/180)')
    .replace(/(?<!Math\.)tan\(([^)]+)\)/g, 'Math.tan(($1)*Math.PI/180)')
    .replace(/\bPI\b/gi, 'Math.PI')
    .replace(/\bE\b/gi, 'Math.E')
    .replace(/%/g, '/100')
    .replace(/(\d)([a-zA-Z(])/g, '$1*$2')
    .replace(/[^0-9+\-*/().Math \r\n]/g, '')
  try {
    const result = Function('"use strict"; return (' + e + ')')()
    if (typeof result !== 'number' || !isFinite(result)) return null
    return Math.round(result * 1e10) / 1e10
  } catch {
    return null
  }
}

export default function Practice() {
  const { gradeId } = useParams<{ gradeId: string }>()
  const navigate = useNavigate()
  const session = useSessionStore((s) => s.session)
  const init = useSessionStore((s) => s.init)
  const submit = useSessionStore((s) => s.submitAnswer)
  const next = useSessionStore((s) => s.next)
  const grade = grades.find((g) => g.id === gradeId)

  const current = session?.problems[session.currentIndex]
  const isLast = session ? session.currentIndex === session.problems.length - 1 : false

  const [hasFeedback, setHasFeedback] = useState(false)
  const [draft, setDraft] = useState('')
  const [calcOpen, setCalcOpen] = useState(false)
  const [calcExpr, setCalcExpr] = useState('')
  const calcResult = computeCalcResult(calcExpr)

  const showCalc = !!current?.topic && CALC_TOPICS.has(current.topic)

  useEffect(() => {
    if (!gradeId || !grade) {
      navigate('/')
      return
    }
    init(gradeId, grade.count)
    setHasFeedback(false)
    setDraft('')
    setCalcOpen(false)
    setCalcExpr('')
  }, [gradeId, grade, init, navigate])

  useEffect(() => {
    setHasFeedback(false)
    setDraft('')
    setCalcOpen(false)
    setCalcExpr('')
  }, [session?.currentIndex])

  if (!session || !current) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading...
      </div>
    )
  }

  const handleCheck = () => {
    const value = draft.trim()
    if (!value) return
    submit(current.id, value)
    setHasFeedback(true)
  }

  const handleNext = () => {
    if (isLast) {
      const score = calcScore(session.problems, session.answers)
      useProgressStore.getState().update(gradeId!, score)
      navigate(`/result/${gradeId}`)
    } else {
      next()
      setDraft('')
    }
  }

  const okResult = (() => {
    const raw = draft.trim()
    const expected = current.answer
    if (raw === '') return false
    if (typeof expected === 'number' && typeof raw === 'string') {
      const n = Number(raw)
      if (Number.isNaN(n)) return false
      if (Number.isInteger(expected) && Number.isInteger(n)) return expected === n
      return Math.abs(expected - n) < 1e-6
    }
    return raw.replace(/\s/g, '').toLowerCase() === String(expected).replace(/\s/g, '').toLowerCase()
  })()

  const feedbackNode = hasFeedback
    ? (
      <div className="mt-8 text-lg">
        {okResult ? (
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
    : null

  const insertCalc = (val: string) => {
    setCalcExpr((prev) => prev + val)
  }

  const calcClear = () => setCalcExpr('')

  const useResult = () => {
    if (calcResult !== null) {
      const text = Number.isInteger(calcResult) ? String(calcResult) : String(calcResult)
      setDraft(text)
      submit(current.id, text)
      setCalcOpen(false)
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
          {showCalc && (
            <div className="mb-4 text-right">
              <button
                onClick={() => setCalcOpen((v) => !v)}
                className="text-xs text-indigo-300 hover:text-indigo-200"
              >
                Calculator {calcOpen ? '▲' : '▼'}
              </button>
            </div>
          )}

          <div className="text-left text-xl sm:text-2xl font-semibold mb-6 text-slate-100 leading-relaxed">
            {current.question}
          </div>

          <div className="flex flex-col items-center justify-center gap-3">
            <input
              type="text"
              inputMode="text"
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value)
                if (hasFeedback) setHasFeedback(false)
              }}
              disabled={hasFeedback}
              className="w-full max-w-xs text-center text-xl font-bold bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-400 focus:bg-white/10 transition-all disabled:opacity-70"
              placeholder="Enter answer"
              autoFocus
            />

            {showCalc && calcOpen && (
              <div className="w-full max-w-xs rounded-2xl bg-slate-900/90 border border-white/10 p-3">
                <input
                  type="text"
                  value={calcExpr}
                  onChange={(e) => setCalcExpr(e.target.value)}
                  className="w-full text-right text-sm bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  placeholder="e.g. sin(30)"
                />
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {['sin(', 'cos(', 'tan(', 'sqrt(', '7', '8', '9', '+', 'C'].map((k) => (
                    <button key={k} onClick={() => k === 'C' ? calcClear() : insertCalc(k)} className="py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white">
                      {k}
                    </button>
                  ))}
                  {['4', '5', '6', '-', 'Del'].map((k) => (
                    <button key={k} onClick={() => k === 'Del' ? setCalcExpr((v) => v.slice(0, -1)) : insertCalc(k)} className="py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white">
                      {k}
                    </button>
                  ))}
                  {['1', '2', '3', '*', '°'].map((k) => (
                    <button key={k} onClick={() => insertCalc(k)} className="py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white">
                      {k}
                    </button>
                  ))}
                  {['0', '.', '=', '^', 'π'].map((k) => (
                    <button key={k} onClick={() => insertCalc(k === '=' ? '' : k)} className="py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white">
                      {k}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="text-xs text-slate-400 font-mono">
                    {calcResult !== null ? `= ${calcResult}` : ''}
                  </div>
                  <button
                    onClick={useResult}
                    disabled={calcResult === null}
                    className="px-3 py-2 bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl"
                  >
                    Use
                  </button>
                </div>
              </div>
            )}

            {!hasFeedback ? (
              <button
                onClick={handleCheck}
                disabled={!draft.trim()}
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

          {feedbackNode}
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
