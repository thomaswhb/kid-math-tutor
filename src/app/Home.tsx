import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { grades } from '../data/grades'
import { useProgressStore } from '../store/useProgressStore'

export default function Home() {
  const progress = useProgressStore((s) => s.progress)

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
          Maths Challenge
        </h1>
        <p className="text-slate-400">Pick a topic and start practising</p>
      </header>

      <div className="grid gap-4 max-w-xl mx-auto">
        {grades.map((g) => {
          const p = progress[g.id]
          return (
            <Link
              key={g.id}
              to={`/practice/${g.id}`}
              className="group block bg-surface border border-white/10 rounded-2xl p-5 hover:bg-surface-hover hover:border-white/20 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-black/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100 group-hover:text-white transition-colors">
                    {g.title}
                  </h2>
                  <p className="text-slate-400 text-sm mt-0.5">{g.subtitle}</p>
                </div>
                <ArrowRight className="w-6 h-6 text-slate-500 group-hover:text-indigo-300 transition-colors" />
              </div>
              {p && (
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 bg-white/5 rounded-lg px-3 py-1.5 w-fit">
                  <span className="text-indigo-300">Best {p.bestScore}</span>
                  <span className="text-slate-600">·</span>
                  <span>{p.played} played</span>
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
