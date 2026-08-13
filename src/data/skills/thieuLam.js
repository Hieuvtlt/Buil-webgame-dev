import { createSkill } from './skillSchema.js'

export const thieuLamSkills = [
  createSkill({ id: 'thieulam_dao_phap', name: 'Thiếu Lâm Đao Pháp', sect: 'thieuLam', availableFor: ['thieuLam', 'tanTu'], level: 1, weaponType: 'blade', manaCost: 10, effects: { externalAttackPercent: 100, accuracy: 10 }, description: 'Võ kỹ ngoại công hệ Đao của Thiếu Lâm.' }),
]
