import { createItem } from './itemSchema.js'

// Tên vũ khí theo danh sách người dùng cung cấp.
// Mỗi cấp dùng đúng icon trong public/assets/vltk/vukhi/<loai>/.
const WEAPONS = [
  {
    category: 'sword',
    typeName: 'Kiếm',
    names: {
      hoang: 'Kim Cang Kiếm',
      huyen: 'Xích Huyết Kiếm',
      dia: 'Trọng Kích Kiếm',
      thien: 'Huyền Thiết Kiếm',
    },
    stats: {
      hoang: { attackMin: 8, attackMax: 12, accuracy: 8, strength: 3 },
      huyen: { attackMin: 30, attackMax: 44, accuracy: 24, strength: 8 },
      dia: { attackMin: 62, attackMax: 88, accuracy: 48, strength: 15 },
      thien: { attackMin: 110, attackMax: 150, accuracy: 80, strength: 25 },
    },
  },
  {
    category: 'blade',
    typeName: 'Đao',
    names: {
      hoang: 'Phá Không Dao',
      huyen: 'Uyển Nguyệt Đao',
      dia: 'Thanh Long Đao',
      thien: 'Đại Phong Đao',
    },
    stats: {
      hoang: { attackMin: 10, attackMax: 15, accuracy: 6, strength: 4 },
      huyen: { attackMin: 34, attackMax: 50, accuracy: 20, strength: 10 },
      dia: { attackMin: 68, attackMax: 96, accuracy: 42, strength: 18 },
      thien: { attackMin: 120, attackMax: 165, accuracy: 70, strength: 30 },
    },
  },
  {
    category: 'staff',
    typeName: 'Bổng',
    names: {
      hoang: 'Tinh Thiết Bổng',
      huyen: 'Hàn Thiết Bổng',
      dia: 'Hoàng Long Bổng',
      thien: 'Kim Cô Bổng',
    },
    stats: {
      hoang: { attackMin: 7, attackMax: 13, accuracy: 10, dexterity: 3 },
      huyen: { attackMin: 28, attackMax: 46, accuracy: 28, dexterity: 8 },
      dia: { attackMin: 58, attackMax: 92, accuracy: 54, dexterity: 14 },
      thien: { attackMin: 105, attackMax: 155, accuracy: 88, dexterity: 24 },
    },
  },
  {
    category: 'spear',
    typeName: 'Thương',
    names: {
      hoang: 'Tiên Nhân Kích',
      huyen: 'Thần Nhân Kích',
      dia: 'Vạn Nhân Kích',
      thien: 'Phá Thiên Kích',
    },
    stats: {
      hoang: { attackMin: 9, attackMax: 16, accuracy: 9, strength: 4 },
      huyen: { attackMin: 32, attackMax: 52, accuracy: 25, strength: 9 },
      dia: { attackMin: 66, attackMax: 100, accuracy: 50, strength: 17 },
      thien: { attackMin: 118, attackMax: 175, accuracy: 82, strength: 28 },
    },
  },
]

const TIERS = [
  { key: 'hoang', level: 1 },
  { key: 'huyen', level: 31 },
  { key: 'dia', level: 61 },
  { key: 'thien', level: 91 },
]

let nextId = 10001
const weapons = []

for (const tier of TIERS) {
  for (const weapon of WEAPONS) {
    weapons.push(createItem({
      id: nextId++,
      name: weapon.names[tier.key],
      type: 'weapon',
      category: weapon.category,
      level: tier.level,
      stackable: false,
      requirements: { level: tier.level },
      stats: weapon.stats[tier.key],
      description: `${weapon.names[tier.key]} — vũ khí ${weapon.typeName} ${tier.key === 'thien' ? 'Thiên cấp' : tier.key === 'dia' ? 'Địa cấp' : tier.key === 'huyen' ? 'Huyền cấp' : 'Hoàng cấp'}.`,
    }))
  }
}

export { weapons }
