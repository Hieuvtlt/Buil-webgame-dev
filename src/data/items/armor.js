import { createItem } from './itemSchema.js'

// Tên trang bị mang phong cách kiếm hiệp/tu tiên.
// Icon vẫn lấy đúng asset người dùng đã chuẩn bị theo cấp/phẩm chất.
const TIERS = [
  { key: 'hoang', label: 'Hoàng cấp', level: 1 },
  { key: 'huyen', label: 'Huyền cấp', level: 31 },
  { key: 'dia', label: 'Địa cấp', level: 61 },
  { key: 'thien', label: 'Thiên cấp', level: 91 },
]

const ARMOR_NAMES = {
  helmet: { hoang: 'Thiết Mạo', huyen: 'Huyền Thiết Mạo', dia: 'Tử Kim Quan', thien: 'Thiên Tàm Mạo' },
  gauntlet: { hoang: 'Thiết Hộ Thủ', huyen: 'Huyền Thiết Hộ Thủ', dia: 'Tử Kim Hộ Uyển', thien: 'Thiên Tàm Hộ Uyển' },
  belt: { hoang: 'Thiết Yêu Đái', huyen: 'Huyền Thiết Yêu Đái', dia: 'Tử Kim Yêu Đái', thien: 'Thiên Tàm Yêu Đái' },
  boots: { hoang: 'Thiết Ngoa', huyen: 'Huyền Thiết Ngoa', dia: 'Tử Kim Ngoa', thien: 'Thiên Tàm Ngoa' },
  necklace: { hoang: 'Thanh Ngọc Hạng Liên', huyen: 'Huyền Ngọc Hạng Liên', dia: 'Tử Kim Hạng Liên', thien: 'Thiên Tàm Ngọc Liên' },
  amulet: { hoang: 'Thanh Ngọc Bội', huyen: 'Huyền Ngọc Bội', dia: 'Tử Kim Ngọc Bội', thien: 'Thiên Tàm Ngọc Bội' },
  ring: { hoang: 'Thiết Giới', huyen: 'Huyền Ngọc Giới', dia: 'Tử Kim Giới', thien: 'Thiên Tàm Giới' },
  body: { hoang: 'Thiết Giáp Bào', huyen: 'Huyền Thiết Chiến Bào', dia: 'Tử Kim Chiến Bào', thien: 'Thiên Tàm Bào' },
}

const SIMPLE_ARMOR = [
  ['helmet', 6],
  ['gauntlet', 8],
  ['belt', 7],
  ['boots', 6],
  ['necklace', 3],
  ['amulet', 3],
  ['ring', 3],
]

// Phẩm chất được áp dụng tập trung trong itemSchema.js theo quy tắc chung.
const BODY_QUALITIES = [
  ['haPham', 'Hạ phẩm'],
  ['trungPham', 'Trung phẩm'],
  ['thuongPham', 'Thượng phẩm'],
  ['cucPham', 'Cực phẩm'],
]

const TIER_SCALE = {
  hoang: 1,
  huyen: 2.2,
  dia: 4.2,
  thien: 7,
}

const RESIST_BY_TIER = {
  hoang: 2,
  huyen: 7,
  dia: 14,
  thien: 20,
}

function simpleArmorStats(category, tierKey, baseDefense) {
  const scale = TIER_SCALE[tierKey]
  const resist = RESIST_BY_TIER[tierKey]
  const defense = Math.round(baseDefense * scale)

  const stats = { defense }

  if (category === 'helmet') {
    stats.hp = 100
    stats.dodge = Math.round(3 * scale)
    stats.fireResist = resist
  } else if (category === 'gauntlet') {
    stats.accuracy = Math.round(4 * scale)
    stats.strength = Math.round(2 * scale)
    stats.poisonResist = resist
  } else if (category === 'belt') {
    stats.hp = 100
    stats.vitality = Math.round(2 * scale)
    stats.iceResist = resist
  } else if (category === 'boots') {
    stats.dodge = Math.round(5 * scale)
    stats.dexterity = Math.round(2 * scale)
    stats.lightningResist = resist
  } else if (category === 'necklace') {
    stats.accuracy = Math.round(6 * scale)
    stats.hp = 100
    stats.fireResist = resist
  } else if (category === 'amulet') {
    stats.dodge = Math.round(6 * scale)
    stats.mp = 100
    stats.poisonResist = resist
  } else if (category === 'ring') {
    stats.strength = Math.round(2 * scale)
    stats.energy = Math.round(2 * scale)
    stats.accuracy = Math.round(4 * scale)
    stats.iceResist = resist
  }

  return stats
}

let nextId = 20001
const armors = []

for (const tier of TIERS) {
  for (const [category, baseDefense] of SIMPLE_ARMOR) {
    armors.push(createItem({
      id: nextId++,
      name: ARMOR_NAMES[category][tier.key],
      type: 'armor',
      category,
      level: tier.level,
      requirements: { level: tier.level },
      stats: simpleArmorStats(category, tier.key, baseDefense),
      description: `${ARMOR_NAMES[category][tier.key]} — trang bị ${tier.label}.`,
    }))
  }

  // Áo có đủ 4 phẩm chất để kiểm thử rõ hệ màu và hệ số thuộc tính.
  // Giá trị nền là 100%; itemSchema sẽ hạ/tăng theo phẩm chất của từng món.
  for (const [quality, qualityLabel] of BODY_QUALITIES) {
    const scale = TIER_SCALE[tier.key]
    const defense = Math.round(18 * scale)

    armors.push(createItem({
      id: nextId++,
      name: ARMOR_NAMES.body[tier.key],
      type: 'armor',
      category: 'body',
      level: tier.level,
      quality,
      requirements: { level: tier.level },
      stats: {
        defense,
        hp: 100,
        mp: 100,
        vitality: Math.round(3 * scale),
        strength: Math.round(2 * scale),
        poisonResist: RESIST_BY_TIER[tier.key],
        fireResist: RESIST_BY_TIER[tier.key],
        iceResist: RESIST_BY_TIER[tier.key],
        lightningResist: RESIST_BY_TIER[tier.key],
      },
      description: `${ARMOR_NAMES.body[tier.key]} — ${tier.label} - ${qualityLabel}.`,
    }))
  }
}

export { armors }
