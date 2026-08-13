import { player, getMaxSkillLevel } from '../data/character.js'
import { getSkillById } from '../data/skills/index.js'

export function getSkillLevel(skillId) {
  return player.skills[skillId] ?? 0
}

export function canLearnSkill(skillId, hasManual) {
  const skill = getSkillById(skillId)
  if (!skill || !hasManual) return false
  if (!skill.availableFor.includes(player.sect)) return false
  return player.level >= skill.requirements.characterLevel
}

export function learnSkill(skillId, hasManual) {
  if (!canLearnSkill(skillId, hasManual)) return false
  if (getSkillLevel(skillId) > 0) return true
  player.skills[skillId] = 1
  return true
}

export function trainSkill(skillId) {
  const skill = getSkillById(skillId)
  if (!skill || getSkillLevel(skillId) <= 0) return false
  const current = getSkillLevel(skillId)
  const max = getMaxSkillLevel()
  if (current >= max) return false
  player.skills[skillId] = current + 1
  return true
}
