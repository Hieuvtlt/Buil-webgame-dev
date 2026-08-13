import { createItem } from './itemSchema.js'

export const materials = [
  createItem({
    id: 40001,
    name: 'Khoáng Thạch',
    type: 'material',
    category: 'ore',
    level: 1,
    quality: 'normal',
    stackable: true,
    maxStack: 999,
    price: { buy: 0, sell: 5 },
    description: 'Nguyên liệu cơ bản có thể dùng cho các hệ thống chế tạo sau này.',
  }),
  createItem({
    id: 40002,
    name: 'Dược Thảo',
    type: 'material',
    category: 'herb',
    level: 1,
    quality: 'normal',
    stackable: true,
    maxStack: 999,
    price: { buy: 0, sell: 5 },
    description: 'Dược liệu cơ bản dùng cho luyện đan.',
  }),
]
