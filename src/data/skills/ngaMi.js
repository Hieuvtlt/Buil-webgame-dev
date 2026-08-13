import { createSkill } from './skillSchema.js'

export const ngaMiSkills = [
  createSkill({ id: 'nga_mi_kiem_phap', name: 'Nga Mi Kiếm Pháp', sect: 'ngaMi', availableFor: ['ngaMi', 'tanTu'], level: 1, weaponType: 'sword', manaCost: 10, effects: { externalAttackPercent: 95, accuracy: 15, dodge: 5 }, description: 'Võ kỹ ngoại công hệ Kiếm của Nga Mi.' }),
]
