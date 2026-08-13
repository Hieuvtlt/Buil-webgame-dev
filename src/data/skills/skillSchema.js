export const SECTS = [
  'thienVuong',
  'thieuLam',
  'voDang',
  'ngaMi',
  'duongMon',
  'nguDoc',
  'caiBang',
  'hoaSon',
  'conLon',
  'thienNhan',
  'tieuDao',
  'tanTu',
]

export const SECT_NAMES = {
  thienVuong: 'Thiên Vương',
  thieuLam: 'Thiếu Lâm',
  voDang: 'Võ Đang',
  ngaMi: 'Nga Mi',
  duongMon: 'Đường Môn',
  nguDoc: 'Ngũ Độc',
  caiBang: 'Cái Bang',
  hoaSon: 'Hoa Sơn',
  conLon: 'Côn Lôn',
  thienNhan: 'Thiên Nhẫn',
  tieuDao: 'Tiêu Dao',
  tanTu: 'Tán Tu',
}

export function createSkill(data) {
  return {
    id: data.id,
    name: data.name,
    sect: data.sect,
    // Mặc định chỉ môn phái gốc được mở skill.
    // Tán Tu chỉ nhìn thấy skill sau khi đã học bí kíp tương ứng.
    availableFor: data.availableFor ?? [data.sect],
    type: 'external',
    level: data.level ?? 1,
    maxLevel: data.maxLevel ?? 10,
    manaCost: data.manaCost ?? 0,
    damageType: 'external',
    weaponType: data.weaponType ?? null,
    icon: data.icon ?? '/src/assets/icons/skill.svg',
    effects: data.effects ?? {},
    requirements: {
      characterLevel: data.requirements?.characterLevel ?? 1,
      rebirth: data.requirements?.rebirth ?? 0,
    },
    requiresManual: true,
    horseText: null,
    description: data.description ?? '',
  }
}
