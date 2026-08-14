// Dữ liệu nhiệm vụ: tách riêng khỏi giao diện để dễ mở rộng về sau.

export const MONSTER_QUESTS = [
  { id: 'mq-01', name: 'Dẹp Loạn Hắc Phong', monster: 'Hắc Phong Lang', map: 'Rừng Hắc Phong', levelOffset: -2, rewardGold: 1200, rewardPill: 'Hồi Khí Đan Lv1', rewardHerbs: 3 },
  { id: 'mq-02', name: 'Quét Sạch Độc Trùng', monster: 'Độc Hạt', map: 'Độc Trùng Cốc', levelOffset: 0, rewardGold: 1500, rewardPill: 'Hồi Linh Đan Lv1', rewardHerbs: 4 },
  { id: 'mq-03', name: 'Thanh Trừng Sơn Tặc', monster: 'Sơn Tặc Đao Khách', map: 'Sơn Tặc Trại', levelOffset: 2, rewardGold: 1800, rewardPill: 'Tụ Linh Đan Lv1', rewardHerbs: 4 },
  { id: 'mq-04', name: 'Giải Vây Huyết Ảnh', monster: 'Huyết Ảnh Ma', map: 'Huyết Ảnh Cốc', levelOffset: -1, rewardGold: 2200, rewardPill: 'Hồi Khí Đan Lv2', rewardHerbs: 5 },
  { id: 'mq-05', name: 'Trấn Áp Thiết Giáp', monster: 'Thiết Giáp Thú', map: 'Thiết Sơn', levelOffset: 1, rewardGold: 2600, rewardPill: 'Hồi Linh Đan Lv2', rewardHerbs: 6 },
  { id: 'mq-06', name: 'Săn Bầy Quỷ Hỏa', monster: 'Quỷ Hỏa', map: 'Hỏa Vân Động', levelOffset: 3, rewardGold: 3200, rewardPill: 'Tụ Linh Đan Lv2', rewardHerbs: 6 },
  { id: 'mq-07', name: 'Diệt Yêu Xà', monster: 'Thanh Lân Yêu Xà', map: 'Thanh Lân Đầm', levelOffset: 0, rewardGold: 3800, rewardPill: 'Ngộ Đạo Đan Lv2', rewardHerbs: 7 },
  { id: 'mq-08', name: 'Phá Vòng Vây Bạch Cốt', monster: 'Bạch Cốt Binh', map: 'Bạch Cốt Lâm', levelOffset: -3, rewardGold: 4500, rewardPill: 'Hồi Khí Đan Lv3', rewardHerbs: 8 },
  { id: 'mq-09', name: 'Quét Quái Thiên Ma', monster: 'Thiên Ma Vệ', map: 'Thiên Ma Điện', levelOffset: 2, rewardGold: 5200, rewardPill: 'Tụ Linh Đan Lv3', rewardHerbs: 9 },
  { id: 'mq-10', name: 'Trấn Thủ Cổ Thành', monster: 'Cổ Thành Ma Tướng', map: 'Cổ Thành Phế Tích', levelOffset: 4, rewardGold: 6500, rewardPill: 'Ngộ Đạo Đan Lv3', rewardHerbs: 10 },
]

export const BOUNTY_TARGETS = [
  { id: 'b-01', name: 'Hắc Phong Đạo Khách', level: 43, map: 'Rừng Hắc Phong', chance: 'Thấp', exp: 2500, gold: 3000, pills: 2, herbs: 8 },
  { id: 'b-02', name: 'Huyết Ảnh Ma Nhân', level: 51, map: 'Huyết Ảnh Cốc', chance: 'Thấp', exp: 3200, gold: 4500, pills: 2, herbs: 10 },
  { id: 'b-03', name: 'Thiết Điện Quỷ', level: 68, map: 'Thiết Sơn', chance: 'Rất thấp', exp: 5000, gold: 7000, pills: 3, herbs: 12 },
  { id: 'b-04', name: 'Bạch Cốt Khách', level: 82, map: 'Bạch Cốt Lâm', chance: 'Thấp', exp: 7500, gold: 10000, pills: 3, herbs: 15 },
  { id: 'b-05', name: 'Thiên Ma Sứ', level: 96, map: 'Thiên Ma Điện', chance: 'Rất thấp', exp: 10000, gold: 14000, pills: 4, herbs: 18 },
]

export const MONSTER_COUNT_RANGES = [
  { maxLevel: 49, min: 30, max: 60 },
  { maxLevel: 89, min: 60, max: 100 },
  { maxLevel: 200, min: 200, max: 300 },
]

export function getMonsterCountRange(level) {
  return MONSTER_COUNT_RANGES.find((range) => level <= range.maxLevel) ?? MONSTER_COUNT_RANGES.at(-1)
}

export function clampQuestLevel(playerLevel, offset = 0) {
  return Math.max(1, Math.min(200, playerLevel + offset))
}
