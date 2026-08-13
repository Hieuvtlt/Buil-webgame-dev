import { getItemById } from '../../data/items/index.js'
import { player, equipItem, getEquippedItem, getEquipFailureReason } from '../../data/character.js'

const STAT_LABELS = {
  attackMin: 'Ngoại công thấp',
  attackMax: 'Ngoại công cao',
  defense: 'Ngoại phòng',
  strength: 'Sức mạnh',
  dexterity: 'Thân pháp',
  vitality: 'Sinh khí',
  energy: 'Nội lực',
  accuracy: 'Chính xác',
  dodge: 'Né tránh',
  hp: 'HP',
  mp: 'MP',
  externalAttack: 'Ngoại công cộng thêm',
  poisonResist: 'Kháng độc',
  fireResist: 'Kháng hỏa',
  iceResist: 'Kháng băng',
  lightningResist: 'Kháng lôi',
}

const QUALITY_LABELS = {
  haPham: 'Hạ phẩm',
  trungPham: 'Trung phẩm',
  thuongPham: 'Thượng phẩm',
  cucPham: 'Cực phẩm',
}

const RESIST_KEYS = new Set(['poisonResist', 'fireResist', 'iceResist', 'lightningResist'])
const SLOT_BY_CATEGORY = {
  sword: 'weapon', blade: 'weapon', staff: 'weapon', spear: 'weapon', weapon: 'weapon',
  helmet: 'helmet', body: 'armor', armor: 'armor', gauntlet: 'gloves', gloves: 'gloves', belt: 'belt', boots: 'boots',
  ring: 'ring1', necklace: 'necklace', amulet: 'amulet',
}

function formatStat(key, value) {
  if (!value) return ''
  return `${STAT_LABELS[key] ?? key}: ${value}${RESIST_KEYS.has(key) ? '%' : ''}`
}

function getEffectText(item) {
  if (item.effect?.hp) return `Phục hồi HP ${item.effect.hp}`
  if (item.effect?.mp) return `Phục hồi MP ${item.effect.mp}`
  if (item.effect?.characterExp) return `Nhận ${item.effect.characterExp} EXP`
  if (item.effect?.skillExp) return `Nhận ${item.effect.skillExp} EXP võ kỹ`
  if (item.effect?.rebirth) return `Dùng cho Trùng Sinh ${item.effect.rebirth}`
  return ''
}

function getStats(item) {
  return item?.displayedStats ?? item?.stats ?? {}
}

function statLines(item, compareTo = null) {
  const source = getStats(item)
  const compare = getStats(compareTo)
  const color = item.qualityColor ?? item.tierMeta?.color ?? '#ffffff'

  return Object.entries(source)
    .filter(([, value]) => Number(value) > 0)
    .map(([key, value]) => {
      const text = formatStat(key, value)
      const oldValue = Number(compare[key] ?? 0)
      const delta = Number(value) - oldValue
      let suffix = ''
      if (compareTo && delta !== 0) {
        const sign = delta > 0 ? '+' : ''
        const cls = delta > 0 ? 'compare-up' : 'compare-down'
        suffix = ` <span class="${cls}">${delta > 0 ? '▲' : '▼'} ${sign}${delta}</span>`
      }
      return `<div class="item-stat-line" style="color:${color}">${text}${suffix}</div>`
    }).join('') || '<div class="item-stat-line">-</div>'
}

function getMeta(item) {
  if (item.potionLevel) {
    const range = item.usableLevelRange
    return `Đẳng cấp yêu cầu: ${range.min}-${range.max}`
  }
  if (item.tierMeta) {
    const quality = item.quality ? ` - ${QUALITY_LABELS[item.quality] ?? item.quality}` : ''
    return `${item.tierMeta.label}${quality} | Đẳng cấp yêu cầu: ${item.requirements.level}`
  }
  return `Loại: ${item.type} | Đẳng cấp yêu cầu: ${item.requirements?.level ?? item.level ?? '-'}`
}

function getSlot(item) {
  return SLOT_BY_CATEGORY[item?.category] ?? null
}

function getAction(item) {
  if (!item) return null
  const slot = getSlot(item)
  const equipped = slot ? getEquippedItem(slot) : null
  if (item.type === 'equipment' || item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory') {
    return { label: equipped ? 'Thay thế' : 'Trang bị', slot, equipped }
  }
  if (item.type === 'consumable') return { label: 'Sử dụng', slot: null, equipped: null }
  return null
}

function ensureTooltip() {
  let tooltip = document.getElementById('item-context-tooltip')
  if (tooltip) return tooltip
  tooltip = document.createElement('div')
  tooltip.id = 'item-context-tooltip'
  tooltip.className = 'item-context-tooltip'
  document.body.appendChild(tooltip)
  return tooltip
}

function positionTooltip(tooltip, x, y) {
  tooltip.style.left = '0px'
  tooltip.style.top = '0px'
  const rect = tooltip.getBoundingClientRect()
  const gap = 12
  const left = x + rect.width + gap <= window.innerWidth ? x + gap : Math.max(gap, x - rect.width - gap)
  const top = y + rect.height + gap <= window.innerHeight ? y + gap : Math.max(gap, window.innerHeight - rect.height - gap)
  tooltip.style.left = `${left}px`
  tooltip.style.top = `${top}px`
}

function renderItemCard(item, title, compareTo = null) {
  const color = item.qualityColor ?? item.tierMeta?.color ?? '#ffffff'
  return `
    <div class="item-context-card">
      <div class="item-context-heading">${title}</div>
      <img class="item-context-icon" src="${item.icon || '/assets/icons/material.svg'}" alt="${item.name}" />
      <div class="item-context-name" style="color:${color}">${item.name}</div>
      <div class="item-context-meta">${getMeta(item)}</div>
      <div class="item-context-stats">${statLines(item, compareTo)}</div>
      ${getEffectText(item) ? `<div class="item-context-effect">${getEffectText(item)}</div>` : ''}
    </div>
  `
}

export function mountInventoryScreen() {
  const grid = document.getElementById('inventory-screen-grid')
  if (!grid) return

  const slots = Array.from(grid.querySelectorAll('.inv-slot2'))
  const tooltip = ensureTooltip()
  let selectedItem = null

  const hide = () => {
    tooltip.classList.remove('is-open')
    selectedItem = null
  }

  const show = (slot, item) => {
    const action = getAction(item)
    const equipped = action?.equipped ?? null
    const hasCompare = Boolean(equipped && equipped.id !== item.id)

    tooltip.innerHTML = `
      <div class="item-context-grid ${hasCompare ? 'has-compare' : ''}">
        ${hasCompare ? renderItemCard(equipped, 'ĐANG TRANG BỊ') : ''}
        ${renderItemCard(item, hasCompare ? 'TRANG BỊ MỚI' : '')}
      </div>
      <div class="item-context-actions">
        ${action ? `<button type="button" class="context-action primary" data-action="main">${action.label}</button>` : ''}
        <button type="button" class="context-action sell" data-action="sell">Bán shop</button>
      </div>
    `
    tooltip.classList.add('is-open')
    positionTooltip(tooltip, slot.getBoundingClientRect().right, slot.getBoundingClientRect().top)
    selectedItem = item

    tooltip.querySelector('[data-action="main"]')?.addEventListener('click', () => {
      if (!selectedItem) return
      const currentAction = getAction(selectedItem)
      if (!currentAction?.slot) return

      const reason = getEquipFailureReason(selectedItem.id, currentAction.slot)
      if (reason) {
        window.dispatchEvent(new CustomEvent('game:log', {
          detail: { message: `Không thể trang bị ${selectedItem.name}: ${reason}`, type: 'danger' },
        }))
        return
      }

      if (equipItem(currentAction.slot, selectedItem.id)) {
        hide()
        window.dispatchEvent(new CustomEvent('game:item-equipped', { detail: { itemId: selectedItem.id } }))
      }
    })

    tooltip.querySelector('[data-action="sell"]')?.addEventListener('click', () => {
      if (!selectedItem) return
      const index = player.inventory.findIndex((id) => Number(id) === Number(selectedItem.id))
      if (index < 0) return
      const equipped = Object.values(player.equipment).some((id) => Number(id) === Number(selectedItem.id))
      if (equipped) return
      const price = Number(selectedItem.price?.sell ?? 0)
      player.inventory.splice(index, 1)
      player.gold += price
      hide()
      window.dispatchEvent(new CustomEvent('game:inventory-changed'))
    })
  }

  slots.forEach((slot) => {
    slot.addEventListener('click', (event) => {
      const id = Number(slot.dataset.itemId)
      if (!slot.dataset.itemId || Number.isNaN(id)) return
      const item = getItemById(id)
      if (!item) return
      slots.forEach((s) => s.classList.remove('is-selected'))
      slot.classList.add('is-selected')
      show(slot, item)
      event.stopPropagation()
    })
  })

  document.addEventListener('click', (event) => {
    if (!tooltip.contains(event.target) && !grid.contains(event.target)) hide()
  })

  window.addEventListener('resize', hide)
}
