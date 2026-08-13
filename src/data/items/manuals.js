import { createItem } from './itemSchema.js'
import { skills } from '../skills/index.js'

export const attributeBooks = [
  createItem({
    id: 'tay_tuy_kinh',
    name: 'Tẩy Tủy Kinh',
    type: 'manual',
    category: 'attribute_book',
    stackable: true,
    maxStack: 99,
    description: 'Sử dụng không giới hạn. Nhận +5 điểm thuộc tính tự do.',
    effect: { attributePoints: 5, unlimitedUse: true },
  }),
  createItem({
    id: 'vo_lam_mat_tich',
    name: 'Võ Lâm Mật Tịch',
    type: 'manual',
    category: 'attribute_book',
    stackable: true,
    maxStack: 99,
    description: 'Vật phẩm cao cấp hơn Tẩy Tủy Kinh. Sử dụng không giới hạn, nhận +10 điểm thuộc tính tự do.',
    effect: { attributePoints: 10, unlimitedUse: true },
  }),
]

export const skillManuals = skills.map((skill) => createItem({
  id: `manual_${skill.id}`,
  name: `Bí Kíp ${skill.name}`,
  type: 'manual',
  category: 'skill_manual',
  stackable: true,
  maxStack: 20,
  requirements: { level: skill.requirements.characterLevel },
  description: `Bí kíp mở khóa ${skill.name}. Có thể sử dụng bởi ${skill.sect === 'tanTu' ? 'Tán Tu' : 'môn phái gốc và Tán Tu'}.`,
  effect: {
    unlockSkill: skill.id,
    allowedSects: skill.availableFor,
  },
}))

export const manuals = [...attributeBooks, ...skillManuals]
