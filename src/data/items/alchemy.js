import { createItem } from './itemSchema.js'
import { LINH_DUOC } from '../craftData.js'

export const alchemyMaterials = LINH_DUOC.map((material) => createItem({
  id: material.id,
  name: material.name,
  type: 'material',
  category: 'alchemy_herb',
  level: material.level,
  icon: material.icon,
  stackable: true,
  maxStack: 999,
  price: { buy: 0, sell: material.level * 25 },
  description: `${material.baseName} cấp ${material.level}, dùng làm nguyên liệu Luyện Đan.`,
}))
