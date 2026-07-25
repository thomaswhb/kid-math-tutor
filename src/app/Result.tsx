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
  const wrongs: {
    a: number
    b: number
    op: string
    yours: number | null
    answer: number
  }[] = []

  problems.forEach((p, i) => {
    if (answers[i] === p.answer) correct++
    else
      wrongs.push({
        a: p.a,
        b: p.b,
        op: p.op,
        yours: answers[i],
        answer: p.answer,
      })
  })

  const percent = Math.round((correct / problems.length) * 100)
  const star =
    percent >= 90
      ? '⭐⭐⭐'
      : percent >= 70
        ? '⭐⭐'
        : percent >= 50
          ? '⭐'
          : '💪'

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">{star}</div>
          <h1 className="text-2xl font-bold">本轮完成</h1>
          <p className="text-slate-400 mt-1">{grade.title}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-primary tabular-nums">{percent}</div>
            <div className="text-slate-400 mt-1">分</div>
            <div className="mt-3 text-sm text-slate-400">
              答对 {correct} / {problems.length} 题
            </div>
            {progress && (
              <div className="mt-2 text-xs text-slate-500">
                历史最高 {progress.bestScore} 分 · 已玩 {progress.played} 次
              </div>
            )}
          </div>
        </div>

        {wrongs.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-6">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              错题回顾
            </h2>
            <div className="space-y-3">
              {wrongs.map((w, i) => (
                <div
                  key={i}
                  className="bg-slate-950 rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="text-lg tabular-nums">
                    {w.a} {w.op} {w.b} ={' '}
                    <span className="text-danger font-semibold">{w.yours ?? '空'}</span>
                  </div>
                  <div className="text-success tabular-nums">= {w.answer}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate(`/practice/${gradeId}`)}
            className="py-4 bg-primary text-white font-semibold rounded-2xl active:scale-95 transition-transform"
          >
            再练一轮
          </button>
          <button
            onClick={() => navigate('/')}
            className="py-4 bg-slate-800 text-white font-semibold rounded-2xl active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" /> 首页
          </button>
        </div>
      </div>
    </div>
  )
}
