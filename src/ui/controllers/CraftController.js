import {
  QUALITY_META,
  getAlchemyRecipe,
  getForgingRecipe,
} from '../../data/craftData.js'

const ALCHEMY_TYPES = {
  hoimau: { name: 'Hồi Khí Đan', effect: (level) => `Phục hồi ${500 * level} HP`, icon: '/assets/vltk/danduoc/hoimau.png' },
  hoimana: { name: 'Hồi Nguyên Đan', effect: (level) => `Phục hồi ${300 * level} MP`, icon: '/assets/vltk/danduoc/hoimana.png' },
  exp: { name: 'Tụ Linh Đan', effect: (level) => `Nhận ${1000 * level} EXP`, icon: '/assets/vltk/danduoc/exp.png' },
  expskill: { name: 'Ngộ Đạo Đan', effect: (level) => `Nhận ${100 * level} EXP võ kỹ`, icon: '/assets/vltk/danduoc/expskill.png' },
}

const FORGING_TYPES = {
  vu_khi: { name: 'Vũ khí', folder: 'vukhi', effect: 'Trang bị vũ khí' },
  mu: { name: 'Mũ', folder: 'mu', effect: 'Trang bị mũ' },
  ao: { name: 'Áo', folder: 'ao', effect: 'Trang bị áo' },
  baotay: { name: 'Bao tay', folder: 'baotay', effect: 'Trang bị bao tay' },
  dailung: { name: 'Đai lưng', folder: 'dailung', effect: 'Trang bị đai lưng' },
  giay: { name: 'Giày', folder: 'giay', effect: 'Trang bị giày' },
  daychuyen: { name: 'Dây chuyền', folder: 'daychuyen', effect: 'Trang sức dây chuyền' },
  ngocboi: { name: 'Ngọc bội', folder: 'ngocboi', effect: 'Trang sức ngọc bội' },
  nhan: { name: 'Nhẫn', folder: 'nhan', effect: 'Trang sức nhẫn' },
}

function getInventoryRoot() {
  return globalThis.gameState?.inventory ?? globalThis.player?.inventory ?? globalThis.inventory ?? null
}

function getOwnedCount(itemId, itemName) {
  const inventory = getInventoryRoot()
  if (!inventory) return 0
  if (Array.isArray(inventory)) {
    return inventory.reduce((sum, entry) => {
      if (entry?.id === itemId || entry?.itemId === itemId || entry?.name === itemName) {
        return sum + Number(entry.quantity ?? entry.count ?? entry.amount ?? 1)
      }
      return sum
    }, 0)
  }
  if (typeof inventory === 'object') {
    const entry = inventory[itemId] ?? inventory[itemName]
    if (typeof entry === 'number') return entry
    if (entry) return Number(entry.quantity ?? entry.count ?? entry.amount ?? 0)
  }
  return 0
}

function qualityColor(quality) {
  return QUALITY_META[quality]?.color ?? '#d7d7d7'
}

function renderMaterials(recipe, kind) {
  return recipe.map((material) => {
    const current = getOwnedCount(material.id, material.name)
    const enough = current >= material.amount
    const icon = kind === 'alchemy'
      ? `/assets/vltk/linhduoc/${material.id.split('_')[1] ?? 1}.png`
      : `/assets/vltk/khoangthach/${material.id.split('_')[1] ?? 1}.png`
    return `
      <div class="craft-material-row ${enough ? 'is-enough' : 'is-short'}">
        <span class="craft-material-main">
          <img src="${icon}" alt="" class="craft-material-icon" />
          <span>${material.name}</span>
        </span>
        <b>${current}/${material.amount}</b>
      </div>`
  }).join('')
}

function renderAlchemy(root) {
  const type = root.querySelector('[data-craft-type]')?.value
  const level = Number(root.querySelector('[data-craft-level]')?.value || 0)
  const quality = root.querySelector('[data-craft-quality]')?.value || ''
  const info = root.querySelector('[data-craft-info]')
  if (!info) return
  if (!type || !level || !quality) {
    info.innerHTML = '<div class="craft-result-placeholder">Chọn loại đan, level và phẩm cấp để xem thông tin và nguyên liệu.</div>'
    return
  }
  const data = ALCHEMY_TYPES[type]
  const recipe = getAlchemyRecipe(level)
  info.innerHTML = `
    <div class="craft-selected-head">
      <img class="craft-selected-icon" src="${data.icon}" alt="" />
      <div>
        <div class="craft-selected-name" style="color:${qualityColor(quality)}">${data.name} Lv${level}</div>
        <div class="craft-subtitle" style="color:${qualityColor(quality)}">${quality} • Đẳng cấp yêu cầu ${level * 10 - 9}-${level * 10}</div>
      </div>
    </div>
    <div class="craft-effect">${data.effect(level)}</div>
    <div class="craft-material-title">Nguyên liệu cần:</div>
    <div class="craft-material-list">${renderMaterials(recipe, 'alchemy')}</div>`
}

function renderForging(root) {
  const type = root.querySelector('[data-craft-type]')?.value
  const level = Number(root.querySelector('[data-craft-level]')?.value || 0)
  const quality = root.querySelector('[data-craft-quality]')?.value || ''
  const info = root.querySelector('[data-craft-info]')
  if (!info) return
  if (!type || !level || !quality) {
    info.innerHTML = '<div class="craft-result-placeholder">Chọn loại trang bị, level và phẩm cấp để xem thông tin và nguyên liệu.</div>'
    return
  }
  const data = FORGING_TYPES[type]
  const recipe = getForgingRecipe(level)
  const materialLevel = Math.min(10, Math.ceil(level / 12))
  info.innerHTML = `
    <div class="craft-selected-head">
      <div class="craft-selected-name" style="color:${qualityColor(quality)}">${data.name} Lv${level}</div>
      <div class="craft-subtitle" style="color:${qualityColor(quality)}">${quality}</div>
    </div>
    <div class="craft-effect">${data.effect} • Nguyên liệu cấp ${materialLevel}</div>
    <div class="craft-material-title">Nguyên liệu cần:</div>
    <div class="craft-material-list">${renderMaterials(recipe, 'forging')}</div>`
}

export function mountLuyenDan(root) {
  const update = () => renderAlchemy(root)
  root.querySelectorAll('[data-craft-type],[data-craft-level],[data-craft-quality]').forEach((el) => el.addEventListener('change', update))
}

export function mountLuyenKhi(root) {
  const update = () => renderForging(root)
  root.querySelectorAll('[data-craft-type],[data-craft-level],[data-craft-quality]').forEach((el) => el.addEventListener('change', update))
}
