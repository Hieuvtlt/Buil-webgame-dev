import { createSkill } from './skillSchema.js'

export const voDangSkills = [
  createSkill({ id: 'vo_dang_kiem_phap', name: 'Võ Đang Kiếm Pháp', sect: 'voDang', availableFor: ['voDang', 'tanTu'], level: 1, weaponType: 'sword', manaCost: 10, effects: { externalAttackPercent: 100, accuracy: 12, dodge: 4 }, description: 'Võ kỹ ngoại công hệ Kiếm của Võ Đang.' }),
]
