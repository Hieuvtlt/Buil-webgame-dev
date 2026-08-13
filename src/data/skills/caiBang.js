import { createSkill } from './skillSchema.js'

export const caiBangSkills = [
  createSkill({ id: 'cai_bang_chuong_phap', name: 'Cái Bang Chưởng Pháp', sect: 'caiBang', availableFor: ['caiBang', 'tanTu'], level: 1, manaCost: 12, effects: { externalAttackPercent: 105, accuracy: 8 }, description: 'Võ kỹ ngoại công hệ Chưởng của Cái Bang.' }),
]
