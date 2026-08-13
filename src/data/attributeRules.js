// Quy tắc thuộc tính chung của game.
// Không có Kháng tất cả và Tốc độ đánh.

export const ELEMENTAL_RESISTANCES = [
  'poisonResist',
  'fireResist',
  'iceResist',
  'lightningResist',
]

// Kháng của nhân vật không bao giờ vượt 80%, dù đến từ trang bị, võ kỹ,
// Thiên Cơ Đan hay các nguồn cộng thêm khác.
export const MAX_RESISTANCE = 80

// Một trang bị chỉ được cộng tối đa 25% cho từng loại kháng.
export const MAX_EQUIPMENT_RESISTANCE = 25

// Giới hạn riêng theo từng dòng điểm trên một trang bị.
export const EQUIPMENT_STAT_CAPS = {
  strength: 50,
  dexterity: 50,
}

export const EQUIPMENT_ATTRIBUTE_KEYS = [
  'attackMin',
  'attackMax',
  'defense',
  'strength',
  'dexterity',
  'vitality',
  'energy',
  'accuracy',
  'dodge',
  'hp',
  'mp',
  'externalAttack',
  ...ELEMENTAL_RESISTANCES,
]

export function clampResistance(value) {
  return Math.min(MAX_RESISTANCE, Math.max(0, Number(value) || 0))
}

export function clampEquipmentResistance(value) {
  return Math.min(MAX_EQUIPMENT_RESISTANCE, Math.max(0, Number(value) || 0))
}

export function clampEquipmentStat(key, value) {
  const numeric = Math.max(0, Number(value) || 0)
  const cap = EQUIPMENT_STAT_CAPS[key]
  return cap == null ? numeric : Math.min(cap, numeric)
}

export function clampCharacterResistances(resistances = {}) {
  return Object.fromEntries(
    ELEMENTAL_RESISTANCES.map((key) => [key, clampResistance(resistances[key])]),
  )
}

// Tỉ lệ phẩm chất cuối cùng theo quy ước của game.
// Hoàng: 10/15/20/30%; Huyền: 30/35/40/50%;
// Địa: 50/60/70/80%; Thiên: 80/90/105/120%.
export const EQUIPMENT_QUALITY_PERCENT = {
  hoang: { haPham: 10, trungPham: 15, thuongPham: 20, cucPham: 30 },
  huyen: { haPham: 30, trungPham: 35, thuongPham: 40, cucPham: 50 },
  dia: { haPham: 50, trungPham: 60, thuongPham: 70, cucPham: 80 },
  thien: { haPham: 80, trungPham: 90, thuongPham: 105, cucPham: 120 },
}

export const QUALITY_COLORS = {
  haPham: '#ffffff',
  trungPham: '#4da6ff',
  thuongPham: '#ffd54a',
  cucPham: '#ff4d4d',
}

export function getEquipmentQualityPercent(tier, quality) {
  return EQUIPMENT_QUALITY_PERCENT[tier]?.[quality] ?? EQUIPMENT_QUALITY_PERCENT[tier]?.haPham ?? 10
}

export function getEquipmentQualityColor(quality) {
  return QUALITY_COLORS[quality] ?? QUALITY_COLORS.haPham
}

export function getHpMpByPercent(percent) {
  const p = Math.max(0, Number(percent) || 0)
  if (p <= 100) return Math.round(p * 2)
  return Math.round(200 + (p - 100) * 2.5)
}

// Thiên Cơ Đan: thuộc tính dạng điểm +1..100, dạng kháng +1..5%.
export const THIEN_CO_DAN_POINT_MIN = 1
export const THIEN_CO_DAN_POINT_MAX = 100
export const THIEN_CO_DAN_PERCENT_MIN = 1
export const THIEN_CO_DAN_PERCENT_MAX = 5
