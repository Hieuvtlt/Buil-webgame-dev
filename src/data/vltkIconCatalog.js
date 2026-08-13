// Chỉ sử dụng icon do game tạo trong public/assets/vltk.
// Không dùng icon VLTK hash cũ hoặc icon fallback cho TRANG BỊ.

const root = '/assets/vltk'

const TIER_FOLDERS = {
  hoang: 'hoangcap',
  huyen: 'huyencap',
  dia: 'diacap',
  thien: 'thiencap',
}

const QUALITY_NAMES = {
  haPham: 'hapham',
  trungPham: 'trungpham',
  thuongPham: 'thuongpham',
  cucPham: 'cucpham',
}

const EQUIPMENT_FOLDERS = {
  helmet: 'mu',
  body: 'ao',
  gauntlet: 'baotay',
  belt: 'dailung',
  boots: 'giay',
  necklace: 'daychuyen',
  amulet: 'ngocboi',
  ring: 'nhan',
}

const WEAPON_FOLDERS = {
  sword: 'kiem',
  blade: 'dao',
  staff: 'bong',
  spear: 'thuong',
}

function getTier(level) {
  const safeLevel = Math.max(1, Math.min(120, Number(level) || 1))
  if (safeLevel <= 30) return 'hoang'
  if (safeLevel <= 60) return 'huyen'
  if (safeLevel <= 90) return 'dia'
  return 'thien'
}

function getBodyIcon(tier, quality) {
  const qualityName = QUALITY_NAMES[quality]
  if (!qualityName) return null
  const folder = TIER_FOLDERS[tier]
  return `${root}/ao/${folder}/${folder}${qualityName}.png`
}

function getEquipmentIcon(data = {}) {
  const tier = getTier(data.level)

  if (data.category === 'body') return getBodyIcon(tier, data.quality)

  const folder = EQUIPMENT_FOLDERS[data.category]
  if (folder) return `${root}/${folder}/${TIER_FOLDERS[tier]}.png`

  if (data.type === 'weapon') {
    const weaponFolder = WEAPON_FOLDERS[data.category]
    if (weaponFolder) return `${root}/vukhi/${weaponFolder}/${TIER_FOLDERS[tier]}.png`
  }

  return null
}

export function getVltkIcon(data = {}) {
  return getEquipmentIcon(data)
}

// Chỉ dành cho các hệ thống mới có asset riêng; không còn catalog icon hash cũ.
export const VLTK_ICONS = Object.freeze({})
export const VLTK_TIER_FOLDERS = Object.freeze({ ...TIER_FOLDERS })
