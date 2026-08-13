import { createItem } from './itemSchema.js'

const potionMeta = {
  hp: { name: 'Khí Huyết Đan', icon: '/assets/vltk/danduoc/hoimau.png', base: 500 },
  mp: { name: 'Hồi Khí Đan', icon: '/assets/vltk/danduoc/hoimana.png', base: 300 },
  exp: { name: 'Tụ Linh Đan', icon: '/assets/vltk/danduoc/exp.png', base: 1000 },
  skillExp: { name: 'Ngộ Đạo Đan', icon: '/assets/vltk/danduoc/expskill.png', base: 100 },
}

function getRangeText(level) {
  if (level === 10) return '100-200'
  return `${level * 10 - 9}-${level * 10}`
}

function createLevelledPills(type) {
  const meta = potionMeta[type]
  return Array.from({ length: 10 }, (_, index) => {
    const level = index + 1
    const value = meta.base * Math.pow(2, index)
    const effect = type === 'hp'
      ? { hp: value }
      : type === 'mp'
        ? { mp: value }
        : type === 'exp'
          ? { characterExp: value }
          : { skillExp: value }

    const effectText = type === 'hp'
      ? `Phục hồi ${value} HP`
      : type === 'mp'
        ? `Phục hồi ${value} MP`
        : type === 'exp'
          ? `Nhận ${value} EXP`
          : `Nhận ${value} EXP võ kỹ`

    return createItem({
      id: `${type}_pill_${String(level).padStart(2, '0')}`,
      name: `${meta.name} Lv${level}`,
      type: 'consumable',
      category: `${type}_pill`,
      level,
      potionLevel: level,
      icon: meta.icon,
      stackable: true,
      maxStack: 99,
      price: { buy: value, sell: Math.floor(value / 2) },
      description: `${meta.name} Lv${level}, đẳng cấp yêu cầu ${getRangeText(level)}, ${effectText}.`,
      effect,
    })
  })
}

const rebirthPills = Array.from({ length: 6 }, (_, index) => {
  const rebirth = index + 1
  const requiredLevel = rebirth === 1 ? 100 : Math.min(200, 100 + (rebirth - 1) * 20)
  return createItem({
    id: `rebirth_${rebirth}`,
    name: `Trùng Sinh Đan ${rebirth}`,
    type: 'consumable',
    category: 'rebirth_pill',
    level: rebirth,
    icon: '/assets/vltk/danduoc/trungsinh.png',
    stackable: true,
    maxStack: 99,
    requirements: { level: requiredLevel },
    price: { buy: 0, sell: 0 },
    description: `Dùng cho Trùng Sinh ${rebirth}, đẳng cấp yêu cầu ${requiredLevel}.`,
    effect: { rebirth },
  })
})

const thienCoDan = createItem({
  id: 'thien_co_dan',
  name: 'Thiên Cơ Đan',
  type: 'consumable',
  category: 'thien_co_dan',
  icon: '/assets/vltk/danduoc/thiencodan.png',
  stackable: true,
  maxStack: 99,
  requirements: { level: 1 },
  price: { buy: 0, sell: 0 },
  description: 'Khi phục dụng, ngẫu nhiên nhận 1 thuộc tính. Thuộc tính dạng điểm nhận ngẫu nhiên +1 đến +100; thuộc tính kháng nhận ngẫu nhiên +1% đến +5%. Kháng riêng của nhân vật tối đa 80%.',
  effect: {
    thienCoDan: true,
    pointMin: 1,
    pointMax: 100,
    resistanceMin: 1,
    resistanceMax: 5,
  },
})

export const consumables = [
  ...createLevelledPills('hp'),
  ...createLevelledPills('mp'),
  ...createLevelledPills('exp'),
  ...createLevelledPills('skillExp'),
  ...rebirthPills,
  thienCoDan,
]
