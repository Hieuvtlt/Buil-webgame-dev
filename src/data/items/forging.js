import { createItem } from './itemSchema.js'
import { KHOANG_THACH } from '../craftData.js'

export const forgingMaterials = KHOANG_THACH.map((material) => createItem({
  id: material.id,
  name: material.name,
  type: 'material',
  category: 'forging_ore',
  level: material.level,
  icon: material.icon,
  stackable: true,
  maxStack: 999,
  price: { buy: 0, sell: material.level * 50 },
  description: `${material.baseName} cấp ${material.level}, dùng làm nguyên liệu Luyện Khí.`,
}))
