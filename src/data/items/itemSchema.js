import { getVltkIcon } from '../vltkIconCatalog.js'
import {
  EQUIPMENT_STAT_CAPS,
  ELEMENTAL_RESISTANCES,
  clampEquipmentResistance,
  clampEquipmentStat,
  getEquipmentQualityColor,
  getEquipmentQualityPercent,
  getHpMpByPercent,
} from '../attributeRules.js'

// Schema chung cho Item.
// Hoàng/Huyền/Địa/Thiên chỉ áp dụng cho TRANG BỊ.
// Đan dược dùng hệ cấp riêng 1-10.

export const EQUIPMENT_TIERS = {
  hoang: { minLevel: 1, maxLevel: 30, color: '#ffffff', label: 'Hoàng cấp', attributeRange: [0, 2] },
  huyen: { minLevel: 31, maxLevel: 60, color: '#4da6ff', label: 'Huyền cấp', attributeRange: [3, 5] },
  dia: { minLevel: 61, maxLevel: 90, color: '#ffd54a', label: 'Địa cấp', attributeRange: [6, 8] },
  thien: { minLevel: 91, maxLevel: 120, color: '#ff4d4d', label: 'Thiên cấp', attributeRange: [8, 10] },
}

export const QUALITY_META = {
  haPham: { label: 'Hạ phẩm', color: '#ffffff' },
  trungPham: { label: 'Trung phẩm', color: '#4da6ff' },
  thuongPham: { label: 'Thượng phẩm', color: '#ffd54a' },
  cucPham: { label: 'Cực phẩm', color: '#ff4d4d' },
}

export const QUALITY_MULTIPLIERS = {
  haPham: 0.10,
  trungPham: 0.15,
  thuongPham: 0.20,
  cucPham: 0.30,
}

export function getQualityMeta(quality) {
  return QUALITY_META[quality] ?? null
}

export function getQualityColor(quality, fallback = '#ffffff') {
  return QUALITY_META[quality]?.color ?? fallback
}

export function getEquipmentTier(level) {
  if (level <= 30) return 'hoang'
  if (level <= 60) return 'huyen'
  if (level <= 90) return 'dia'
  return 'thien'
}

export function getEquipmentTierMeta(level) {
  return EQUIPMENT_TIERS[getEquipmentTier(level)]
}

export function getPotionLevelRange(level) {
  if (level < 1 || level > 10) throw new Error('Cấp đan dược phải từ 1 đến 10')
  if (level === 10) return { min: 100, max: 200 }
  return { min: level * 10 - 9, max: level * 10 }
}

function getDefaultIcon(data, isEquipment) {
  const vltkIcon = getVltkIcon(data)
  if (vltkIcon) return vltkIcon
  if (data.icon) return data.icon
  // Trang bị không có asset do người dùng tạo thì không được tự chèn icon mẫu.
  if (isEquipment) return null
  if (data.type === 'consumable') return '/assets/icons/potion.svg'
  if (data.type === 'material') return '/assets/icons/material.svg'
  return '/assets/icons/material.svg'
}

function roundPositive(value) {
  return Math.max(1, Math.round(value))
}

function getDefaultQuality(itemId) {
  const qualities = ['haPham', 'trungPham', 'thuongPham', 'cucPham']
  const seed = Math.abs(Number(itemId) || 0)
  return qualities[seed % qualities.length]
}

function getQualityPercent(tier, quality) {
  return getEquipmentQualityPercent(tier, quality)
}

// Các dòng thuộc tính được xây dựng theo hướng VLTK: công thủ, sức mạnh,
// thân pháp, sinh khí/nội lực, chính xác, né tránh và kháng nguyên tố.
// Không sinh Kháng tất cả và không sinh Tốc độ đánh.
function enrichEquipmentStats(stats, data, tier, qualityPercent) {
  const result = { ...stats }
  const tierScale = { hoang: 1, huyen: 1.7, dia: 2.6, thien: 3.5 }[tier]
  const qualityScale = qualityPercent / 100
  const attackBase = result.attackMax || result.attackMin || 10
  const defenseBase = result.defense || 5
  const accuracyBase = result.accuracy || 4

  const extras = {
    defense: roundPositive(defenseBase),
    dexterity: roundPositive((result.dexterity || accuracyBase / 3) * tierScale),
    vitality: roundPositive((result.vitality || 2) * tierScale),
    energy: roundPositive((result.energy || 2) * tierScale),
    dodge: roundPositive((result.dodge || accuracyBase / 3) * tierScale),
    hp: result.hp || 0,
    mp: result.mp || 0,
    externalAttack: result.externalAttack || roundPositive(attackBase * 0.08),
  }

  // Bổ sung kháng theo cấp nhưng giữ tối đa 25% cho từng dòng trên một món.
  // Chỉ tạo kháng khi dữ liệu món đã có ít nhất một dòng kháng, tránh mọi món
  // đều biến thành trang bị chống toàn hệ.
  const hasResistance = ELEMENTAL_RESISTANCES.some((key) => {
    const legacyKey = key
    return Number(result[legacyKey]) > 0
  })

  if (hasResistance) {
    const tierResistanceBase = { hoang: 2, huyen: 7, dia: 14, thien: 20 }[tier]
    for (const key of ELEMENTAL_RESISTANCES) {
      if (Number(result[key]) > 0) {
        result[key] = Math.max(Number(result[key]), tierResistanceBase)
      }
    }
  }

  for (const [key, value] of Object.entries(extras)) {
    if (!result[key] && value > 0) result[key] = value
  }

  // Áp dụng phẩm chất vào toàn bộ dòng điểm.
  for (const [key, value] of Object.entries(result)) {
    const numeric = Number(value) || 0
    if (numeric <= 0) continue

    if (ELEMENTAL_RESISTANCES.includes(key)) {
      result[key] = clampEquipmentResistance(numeric * qualityScale)
      continue
    }

    if (key === 'hp' || key === 'mp') {
      // HP/MP có thang riêng: 100%=200, 120%=250.
      result[key] = getHpMpByPercent(qualityPercent)
      continue
    }

    result[key] = Math.max(1, Math.round(numeric * qualityScale))
    result[key] = clampEquipmentStat(key, result[key])
  }

  // Một món không có HP/MP gốc vẫn có thể nhận dòng HP/MP ở phẩm chất cao,
  // nhưng luôn theo mức thấp đã quy định, không phình máu/mana.
  if (data.category === 'helmet' || data.category === 'belt' || data.category === 'body' || data.category === 'necklace') {
    result.hp = getHpMpByPercent(qualityPercent)
  }
  if (data.category === 'amulet') {
    result.mp = getHpMpByPercent(qualityPercent)
  }

  return result
}

// Số lượng dòng thuộc tính ổn định theo ID, không thay đổi mỗi lần mở game.
function getAttributeCount(itemId, tierMeta, availableCount) {
  const [min, max] = tierMeta.attributeRange
  if (availableCount <= 0) return 0
  const span = max - min + 1
  const seed = Math.abs(Number(itemId) || 0)
  const wanted = min + (seed % span)
  return Math.min(wanted, availableCount)
}

function buildDisplayedStats(stats, itemId, tierMeta) {
  const entries = Object.entries(stats ?? {}).filter(([, value]) => Number(value) > 0)
  const count = getAttributeCount(itemId, tierMeta, entries.length)
  return Object.fromEntries(entries.slice(0, count))
}

export function createItem(data) {
  const isEquipment = data.type === 'equipment' || data.type === 'weapon' || data.type === 'armor' || data.type === 'accessory'
  const itemLevel = isEquipment ? Math.max(1, Math.min(120, data.level ?? 1)) : data.level ?? 1
  const tier = isEquipment ? getEquipmentTier(itemLevel) : null
  const tierMeta = isEquipment ? getEquipmentTierMeta(itemLevel) : null
  const quality = isEquipment ? (data.quality ?? getDefaultQuality(data.id)) : (data.quality ?? null)
  const qualityMeta = isEquipment ? getQualityMeta(quality) : null
  const qualityPercent = isEquipment ? getQualityPercent(tier, quality) : null
  const potionRange = data.potionLevel ? getPotionLevelRange(data.potionLevel) : null

  let stats = {
    attackMin: data.stats?.attackMin ?? 0,
    attackMax: data.stats?.attackMax ?? 0,
    defense: data.stats?.defense ?? 0,
    strength: data.stats?.strength ?? 0,
    dexterity: data.stats?.dexterity ?? 0,
    vitality: data.stats?.vitality ?? 0,
    energy: data.stats?.energy ?? 0,
    accuracy: data.stats?.accuracy ?? 0,
    dodge: data.stats?.dodge ?? 0,
    hp: data.stats?.hp ?? 0,
    mp: data.stats?.mp ?? 0,
    externalAttack: data.stats?.externalAttack ?? 0,
    poisonResist: data.stats?.poisonResist ?? 0,
    fireResist: data.stats?.fireResist ?? 0,
    iceResist: data.stats?.iceResist ?? 0,
    lightningResist: data.stats?.lightningResist ?? 0,
  }

  if (isEquipment) stats = enrichEquipmentStats(stats, data, tier, qualityPercent)

  return {
    id: data.id,
    name: data.name,
    type: data.type,
    category: data.category ?? null,
    level: itemLevel,
    tier,
    tierMeta,
    attributeRange: tierMeta?.attributeRange ?? null,
    displayedStats: isEquipment ? buildDisplayedStats(stats, data.id, tierMeta) : stats,
    quality,
    qualityMeta,
    qualityPercent,
    qualityColor: isEquipment ? getEquipmentQualityColor(quality) : '#ffffff',
    qualityRange: isEquipment ? [qualityPercent, qualityPercent] : null,
    qualityMultiplier: isEquipment ? qualityPercent / 100 : null,
    icon: getDefaultIcon(data, isEquipment),
    stackable: isEquipment ? false : (data.stackable ?? false),
    maxStack: isEquipment ? 1 : (data.type === 'consumable' ? 99 : (data.maxStack ?? 1)),
    potionLevel: data.potionLevel ?? null,
    usableLevelRange: potionRange,
    requirements: {
      level: data.requirements?.level ?? potionRange?.min ?? 1,
      strength: data.requirements?.strength ?? 0,
      dexterity: data.requirements?.dexterity ?? 0,
      vitality: data.requirements?.vitality ?? 0,
      energy: data.requirements?.energy ?? 0,
      rebirth: data.requirements?.rebirth ?? 0,
    },
    stats,
    effects: data.effects ?? [],
    effect: data.effect ?? null,
    price: {
      buy: data.price?.buy ?? 0,
      sell: data.price?.sell ?? 0,
    },
    description: data.description ?? '',
  }
}
