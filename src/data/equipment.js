import { getEquipmentTier, getEquipmentTierMeta, QUALITY_MULTIPLIERS } from './items/itemSchema.js'

export const EQUIPMENT_ATTRIBUTE_LIMITS = {
  hoang: [0, 2],
  huyen: [3, 5],
  dia: [6, 8],
  thien: [8, 10],
}

export const EQUIPMENT_QUALITY = ['haPham', 'trungPham', 'thuongPham', 'cucPham']

export const EXTERNAL_ATTRIBUTES = [
  'externalAttack',
  'defense',
  'hp',
  'mp',
  'strength',
  'dexterity',
  'vitality',
  'energy',
  'accuracy',
  'dodge',
  'criticalRate',
  'criticalDamage',
  'damageReduction',
  'armorPenetration',
]

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getAttributeCountRange(level) {
  return EQUIPMENT_ATTRIBUTE_LIMITS[getEquipmentTier(level)]
}

export function rollQuality() {
  return EQUIPMENT_QUALITY[randomInt(0, EQUIPMENT_QUALITY.length - 1)]
}

export function rollAttributeValue(baseValue, quality) {
  const [min, max] = QUALITY_MULTIPLIERS[quality]
  return Math.round(baseValue * (min + Math.random() * (max - min)))
}

export function generateEquipment({ id, name, slot, level, baseValue = 100 }) {
  const safeLevel = Math.max(1, Math.min(120, level))
  const tier = getEquipmentTier(safeLevel)
  const [minAttributes, maxAttributes] = getAttributeCountRange(safeLevel)
  const count = randomInt(minAttributes, maxAttributes)
  const pool = [...EXTERNAL_ATTRIBUTES]
  const attributes = []

  for (let i = 0; i < count; i += 1) {
    const attribute = pool.splice(randomInt(0, pool.length - 1), 1)[0]
    const quality = rollQuality()
    const value = rollAttributeValue(baseValue * (1 + safeLevel / 50), quality)
    attributes.push({ attribute, quality, value })
  }

  return {
    id,
    name,
    type: 'equipment',
    slot,
    level: safeLevel,
    tier,
    tierLabel: getEquipmentTierMeta(safeLevel).label,
    color: getEquipmentTierMeta(safeLevel).color,
    attributes,
    maxAttributes: maxAttributes,
  }
}
