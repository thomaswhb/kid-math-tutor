import type { GradeConfig } from '../types'

export const grades: GradeConfig[] = [
  // Year 9
  {
    id: 'y9-algebra',
    title: 'Year 9 · 线性方程',
    subtitle: '解方程与化简',
    range: [1, 999],
    operations: ['+', '-', '*', '/'],
    count: 10,
  },
  {
    id: 'y9-number',
    title: 'Year 9 · 指数与根号',
    subtitle: '平方、立方、方根',
    range: [1, 20],
    operations: ['+', '-', '*', '/'],
    count: 10,
  },
  // Year 10
  {
    id: 'y10-quadratic',
    title: 'Year 10 · 二次式',
    subtitle: '因式分解与展开',
    range: [1, 30],
    operations: ['+', '-', '*'],
    count: 10,
  },
  {
    id: 'y10-trig',
    title: 'Year 10 · 三角函数',
    subtitle: '特殊角 sin/cos/tan',
    range: [1, 12],
    operations: ['*', '/'],
    count: 10,
  },
  // Year 11
  {
    id: 'y11-calculus',
    title: 'Year 11 · 基础微积分',
    subtitle: '多项式求导',
    range: [1, 50],
    operations: ['+', '-', '*'],
    count: 10,
  },
  // Year 12 VCE Advanced
  {
    id: 'y12-adv',
    title: 'VCE Advance · 综合题',
    subtitle: '微积分 + 统计 + 向量',
    range: [1, 100],
    operations: ['+', '-', '*', '/'],
    count: 10,
  },
]
