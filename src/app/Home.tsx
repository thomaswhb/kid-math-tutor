import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { grades } from '../data/grades'
import { useProgressStore } from '../store/useProgressStore'

export default function Home() {
  const progress = useProgressStore((s) => s.progress)

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-1">数学小挑战</h1>
        <p className="text-slate-400">选一关，开始练习吧</p>
      </header>

      <div className="grid gap-4 max-w-xl mx-auto">
        {grades.map((g) => {
          const p = progress[g.id]
          return (
            <Link
              key={g.id}
              to={`/practice/${g.id}`}
              className="block bg-slate-900 border border-slate-800 rounded-2xl p-5 active:scale-95 transition-transform"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{g.title}</h2>
                  <p className="text-slate-400 text-sm mt-0.5">{g.subtitle}</p>
                </div>
                <ArrowRight className="w-6 h-6 text-slate-500" />
              </div>
              {p && (
                <div className="mt-3 flex items-center gap-3 text-sm text-slate-400">
                  <span>最高 {p.bestScore} 分</span>
                  <span>·</span>
                  <span>已玩 {p.played} 次</span>
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
