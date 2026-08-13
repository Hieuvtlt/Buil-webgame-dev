import { player } from '../../data/character.js'
import { getItemById } from '../../data/items/index.js'

function getItemColor(item) {
  return item?.qualityColor ?? item?.tierMeta?.color ?? '#d7d7d7'
}

export function InventoryScreen() {
  const slotsPerPage = 50
  const inventoryItems = player.inventory
    .map((id) => getItemById(id))
    .filter(Boolean)
    .slice(0, slotsPerPage)

  return `
    <div class="inventory-screen game-screen">
      <h3 class="panel-title-sm">Túi đồ</h3>
      <div class="inventory-layout-single">
        <div class="inventory-grid-wrap">
          <div class="inventory-grid" id="inventory-screen-grid">
            ${Array.from({ length: slotsPerPage }, (_, i) => {
              const item = inventoryItems[i]
              const color = getItemColor(item)
              const quantityText = item ? (item.stackable ? `x1/${item.maxStack}` : 'x1') : ''
              return `
                <button class="inv-slot2${item?.stackable ? ' is-stackable' : ''}" type="button"
                  data-inv-slot-index="${i}"
                  data-item-id="${item?.id ?? ''}"
                  style="${item ? `color:${color}` : ''}">
                  ${item ? `
                    <span class="item-icon-wrap">
                      <img class="item-icon" src="${item.icon}" alt="${item.name}" loading="lazy" />
                      ${item.stackable ? `<span class="stack-badge">${quantityText}</span>` : ''}
                    </span>
                    <span class="item-name">${item.name}</span>
                  ` : `Slot ${i + 1}`}
                </button>
              `
            }).join('')}
          </div>
        </div>
      </div>
      <div class="inventory-currency">
        <div class="currency-box">Ngân lượng: ${player.gold}</div>
        <div class="currency-box">Linh thạch: ${player.spiritStone}</div>
      </div>
    </div>
  `
}
