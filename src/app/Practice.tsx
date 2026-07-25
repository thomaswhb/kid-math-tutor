import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useSessionStore } from '../store/useSessionStore'
import { useProgressStore } from '../store/useProgressStore'
import { grades } from '../data/grades'

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
  const isAnswered = currentAnswer !== null
  const isLast = session ? session.currentIndex === session.problems.length - 1 : false

  useEffect(() => {
    if (!gradeId || !grade) {
      navigate('/')
      return
    }
    init(gradeId, grade.count)
  }, [gradeId, grade, init, navigate])

  if (!session || !current) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        加载中...
      </div>
    )
  }

  const handleSubmit = () => {
    if (isAnswered && isLast) {
      const score = calcScore(session.problems, session.answers)
      useProgressStore.getState().update(gradeId!, score)
      navigate(`/result/${gradeId}`)
    } else if (isAnswered) {
      next()
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-xl hover:bg-slate-800">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{grade?.title}</h1>
            <div className="flex gap-1 mt-1">
              {session.problems.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    i < session.currentIndex
                      ? 'bg-success'
                      : i === session.currentIndex
                        ? 'bg-primary'
                        : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
          <span className="text-sm text-slate-400 tabular-nums">
            {session.currentIndex + 1}/{session.problems.length}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center">
          <div className="text-5xl font-bold mb-8 tabular-nums">
            {current.a} {current.op} {current.b} = ?
          </div>

          <div className="flex items-center justify-center gap-3">
            <input
              type="tel"
              inputMode="numeric"
              value={currentAnswer ?? ''}
              onChange={(e) => {
                const v = e.target.value
                submit(current.id, v === '' ? null : parseInt(v, 10))
              }}
              disabled={isAnswered}
              className="w-32 text-center text-3xl font-bold bg-slate-800 border-2 border-slate-700 rounded-2xl py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary disabled:opacity-70"
              placeholder="?"
              autoFocus
            />
            <button
              onClick={handleSubmit}
              disabled={currentAnswer === null}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-2xl disabled:opacity-40 active:scale-95 transition-transform"
            >
              {isAnswered ? (isLast ? '完成' : '下一题') : '确定'}
            </button>
          </div>

          {isAnswered && (
            <div className="mt-6 text-lg">
              {currentAnswer === current.answer ? (
                <span className="text-success font-semibold">✓ 正确！太棒了</span>
              ) : (
                <span className="text-danger font-semibold">
                  ✗ 再想想，答案是 {current.answer}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function calcScore(problems: Problem[], answers: (number | null)[]): number {
  let correct = 0
  for (let i = 0; i < problems.length; i++) {
    if (answers[i] === problems[i].answer) correct++
  }
  return Math.round((correct / problems.length) * 100)
}
