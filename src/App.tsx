import { Routes, Route } from 'react-router-dom'
import Home from './app/Home'
import Practice from './app/Practice'
import Result from './app/Result'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/practice/:gradeId" element={<Practice />} />
      <Route path="/result/:gradeId" element={<Result />} />
    </Routes>
  )
}
