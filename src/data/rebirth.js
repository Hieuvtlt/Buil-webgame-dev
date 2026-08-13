import { player, syncDerivedStats } from './character.js'

export const rebirthRules = {
  1: { requiredLevel: 100, itemId: 'rebirth_1' },
  2: { requiredLevel: 120, itemId: 'rebirth_2' },
  3: { requiredLevel: 140, itemId: 'rebirth_3' },
  4: { requiredLevel: 160, itemId: 'rebirth_4' },
  5: { requiredLevel: 180, itemId: 'rebirth_5' },
  6: { requiredLevel: 200, itemId: 'rebirth_6' },
}

export function getRebirthRule(nextRebirth = player.rebirth + 1) {
  return rebirthRules[nextRebirth] ?? {
    requiredLevel: 200,
    itemId: `rebirth_${nextRebirth}`,
  }
}

export function getMaxSkillLevelForRebirth(rebirth = player.rebirth) {
  return 10 + rebirth * 10
}

export function canRebirth(hasRequiredPill) {
  const next = player.rebirth + 1
  const rule = getRebirthRule(next)
  return player.level >= rule.requiredLevel && hasRequiredPill(rule.itemId)
}

export function performRebirth(hasRequiredPill, consumePill) {
  const next = player.rebirth + 1
  const rule = getRebirthRule(next)
  if (player.level < rule.requiredLevel || !hasRequiredPill(rule.itemId)) return false
  if (!consumePill(rule.itemId)) return false

  player.rebirth = next
  player.level = 1
  player.exp = 0
  player.expToNextLevel = 100
  player.attributes = { strength: 0, dexterity: 0, vitality: 0, energy: 0 }
  player.permanentRebirthPoints = 50 * player.rebirth
  player.freePoints = player.permanentRebirthPoints
  syncDerivedStats()
  player.hp = player.maxHp
  player.mp = player.maxMp
  return true
}
