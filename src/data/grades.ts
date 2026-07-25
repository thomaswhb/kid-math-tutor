import { type GradeConfig } from '../types'

export const grades: GradeConfig[] = [
  {
    id: 'g1-add',
    title: '一年级 · 加法',
    subtitle: '20 以内加法',
    range: [1, 20],
    operations: ['+'],
    count: 10,
  },
  {
    id: 'g1-sub',
    title: '一年级 · 减法',
    subtitle: '20 以内减法',
    range: [1, 20],
    operations: ['-'],
    count: 10,
  },
  {
    id: 'g2-add',
    title: '二年级 · 两位数加法',
    subtitle: '不进位与进位',
    range: [10, 99],
    operations: ['+'],
    count: 10,
  },
]
