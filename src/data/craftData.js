export const QUALITY_META = {
  'Hạ phẩm': { color: '#ffffff' },
  'Trung phẩm': { color: '#00aaff' },
  'Thượng phẩm': { color: '#ffd700' },
  'Cực phẩm': { color: '#ff3333' },
}

// 12 linh dược: mỗi loại có đủ Lv1-Lv10 và dùng icon 1.png-12.png.
export const LINH_DUOC_TYPES = [
  ['huyet_linh_chi', 'Huyết Linh Chi'],
  ['nhan_sam', 'Nhân Sâm'],
  ['cam_thao', 'Cam Thảo'],
  ['tu_linh_hoa', 'Tử Linh Hoa'],
  ['bich_huyet_thao', 'Bích Huyết Thảo'],
  ['thanh_tam_thao', 'Thanh Tâm Thảo'],
  ['hoa_linh_thao', 'Hỏa Linh Thảo'],
  ['bang_tam_lien', 'Băng Tâm Liên'],
  ['ngoc_linh_qua', 'Ngọc Linh Quả'],
  ['tu_van_thao', 'Tử Vân Thảo'],
  ['long_huyet_thao', 'Long Huyết Thảo'],
  ['thien_linh_chi', 'Thiên Linh Chi'],
]

// 12 khoáng thạch: cấu trúc giống linh dược, mỗi loại có đủ Lv1-Lv10.
export const KHOANG_THACH_TYPES = [
  ['quang_sat', 'Quặng Sắt'],
  ['quang_dong', 'Quặng Đồng'],
  ['quang_bac', 'Quặng Bạc'],
  ['quang_vang', 'Quặng Vàng'],
  ['tinh_thiet', 'Tinh Thiết'],
  ['huyen_thiet', 'Huyền Thiết'],
  ['tinh_dong', 'Tinh Đồng'],
  ['tinh_ngan', 'Tinh Ngân'],
  ['tinh_kim', 'Tinh Kim'],
  ['hop_kim_sat', 'Hợp Kim Sắt'],
  ['hop_kim_dong', 'Hợp Kim Đồng'],
  ['hop_kim_bac', 'Hợp Kim Bạc'],
]

export function getLinhDuocIcon(index) {
  return `/assets/vltk/linhduoc/${index + 1}.png`
}

export function getKhoangThachIcon(index) {
  return `/assets/vltk/khoangthach/${index + 1}.png`
}

export function getLinhDuocId(typeIndex, level) {
  return `linhduoc_${typeIndex + 1}_lv${level}`
}

export function getKhoangThachId(typeIndex, level) {
  return `khoangthach_${typeIndex + 1}_lv${level}`
}

export const LINH_DUOC = LINH_DUOC_TYPES.flatMap(([id, name], typeIndex) =>
  Array.from({ length: 10 }, (_, i) => {
    const level = i + 1
    return {
      id: getLinhDuocId(typeIndex, level),
      typeIndex,
      typeId: id,
      name: `${name} Lv${level}`,
      baseName: name,
      level,
      icon: getLinhDuocIcon(typeIndex),
      stackable: true,
      maxStack: 999,
    }
  }),
)

export const KHOANG_THACH = KHOANG_THACH_TYPES.flatMap(([id, name], typeIndex) =>
  Array.from({ length: 10 }, (_, i) => {
    const level = i + 1
    return {
      id: getKhoangThachId(typeIndex, level),
      typeIndex,
      typeId: id,
      name: `${name} Lv${level}`,
      baseName: name,
      level,
      icon: getKhoangThachIcon(typeIndex),
      stackable: true,
      maxStack: 999,
    }
  }),
)

// Lv1-3: 3 loại; Lv4-5: 5; Lv6-7: 7; Lv8: 9; Lv9: 10; Lv10: 12.
export function materialTypeCount(level) {
  if (level <= 3) return 3
  if (level <= 5) return 5
  if (level <= 7) return 7
  if (level === 8) return 9
  if (level === 9) return 10
  return 12
}

export function materialAmount(level, typeIndex) {
  const base = 2 + level
  const variation = ((typeIndex * 2 + level) % 4)
  return Math.max(1, base + variation - (typeIndex % 3))
}

export function getAlchemyRecipe(level) {
  const count = materialTypeCount(level)
  return LINH_DUOC_TYPES.slice(0, count).map(([id, name], typeIndex) => ({
    id: getLinhDuocId(typeIndex, level),
    name: `${name} Lv${level}`,
    amount: materialAmount(level, typeIndex),
    icon: getLinhDuocIcon(typeIndex),
  }))
}

export function getForgingMaterialLevel(equipmentLevel) {
  return Math.min(10, Math.max(1, Math.ceil(equipmentLevel / 12)))
}

export function getForgingRecipe(equipmentLevel) {
  const materialLevel = getForgingMaterialLevel(equipmentLevel)
  const count = materialTypeCount(materialLevel)
  return KHOANG_THACH_TYPES.slice(0, count).map(([id, name], typeIndex) => ({
    id: getKhoangThachId(typeIndex, materialLevel),
    name: `${name} Lv${materialLevel}`,
    amount: materialAmount(materialLevel, typeIndex),
    icon: getKhoangThachIcon(typeIndex),
  }))
}
