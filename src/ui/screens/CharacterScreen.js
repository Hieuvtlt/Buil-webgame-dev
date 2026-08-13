import characterImg from '../../assets/character.png'
import { player, getPlayerStats, getMaxSkillLevel, getEquippedItem } from '../../data/character.js'
import { EQUIPMENT_SLOTS } from '../../data/equipmentSlots.js'

const RESISTANCE_LABELS = [
  ['poisonResistance', 'Kháng độc'],
  ['fireResistance', 'Kháng hỏa'],
  ['iceResistance', 'Kháng băng'],
  ['lightningResistance', 'Kháng lôi'],
]

export function CharacterScreen() {
  const stats = getPlayerStats()
  const attr = player.attributes

  return `
    <div class="character-screen game-screen">
      <section class="char-left">
        <div class="char-left-top">
          <h3 class="panel-title-sm">Thông tin nhân vật</h3>
          <div class="char-basic">
            <div><b>Tên:</b> ${player.name}</div>
            <div><b>Level:</b> ${player.level} / 200</div>
            <div><b>Trùng sinh:</b> ${player.rebirth}</div>
            <div><b>Môn phái:</b> ${player.sect === 'tanTu' ? 'Tán Tu' : player.sect}</div>
            <div><b>HP:</b> ${player.hp} / ${stats.maxHp}</div>
            <div><b>MP:</b> ${player.mp} / ${stats.maxMp}</div>
            <div><b>EXP:</b> ${player.exp} / ${player.expToNextLevel}</div>
          </div>
        </div>

        <div class="char-left-bottom">
          <h3 class="panel-title-sm">Thuộc tính nhân vật</h3>
          <div class="attr-grid">
            ${[
              ['strength', 'Sức mạnh'],
              ['dexterity', 'Thân pháp'],
              ['vitality', 'Sinh khí'],
              ['energy', 'Nội lực'],
            ].map(([key, label]) => `
              <div class="attr-item">
                <span>${label}</span>
                <b>${attr[key]}</b>
                <button class="attr-add-btn" type="button" data-attribute="${key}">+</button>
              </div>
            `).join('')}
          </div>
          <div class="free-point">
            <span>Điểm tự do</span>
            <b id="free-points-value">${player.freePoints}</b>
          </div>
        </div>

        <div class="char-left-bottom">
          <h3 class="panel-title-sm">Chỉ số chiến đấu</h3>
          <div class="char-stat-list">
            <div><span>HP tối đa</span><b>${stats.maxHp}</b></div>
            <div><span>MP tối đa</span><b>${stats.maxMp}</b></div>
            <div><span>Ngoại công</span><b>${stats.attackMin} - ${stats.attackMax}</b></div>
            <div><span>Ngoại phòng</span><b>${stats.defense}</b></div>
            <div><span>Chính xác</span><b>${stats.accuracy}</b></div>
            <div><span>Né tránh</span><b>${stats.dodge}</b></div>
            ${RESISTANCE_LABELS.map(([key, label]) => `
              <div><span>${label}</span><b>${stats[key]}%</b></div>
            `).join('')}
            <div><span>Max võ kỹ</span><b>${getMaxSkillLevel()}</b></div>
          </div>
        </div>
      </section>

      <section class="char-right">
        <h3 class="panel-title-sm">Nhân vật & Trang bị</h3>
        <div class="char-figure-area">
          <div class="figure-placeholder">
            <img src="${characterImg}" alt="Nhân vật" class="character-avatar" />
          </div>
          <div class="equip-panel">
            <div class="equip-title">Trang bị</div>
            <div class="equip-grid" id="equip-grid">
              ${EQUIPMENT_SLOTS.map((slot, index) => {
                const item = getEquippedItem(slot.id)
                return `
                  <button class="equip-slot${item ? ' has-item' : ''}" type="button"
                    data-slot-id="${slot.id}" data-slot-index="${index}" data-has-item="${item ? 'true' : 'false'}">
                    ${item ? `<img class="equip-slot-icon" src="${item.icon}" alt="" /><span>${item.name}</span>` : `${slot.name}: Trống`}
                  </button>
                `
              }).join('')}
            </div>
            <div class="equip-actions">
              <button class="action-btn danger" type="button" id="btn-unequip">Gỡ</button>
            </div>
            <div class="equip-hint">Chọn ô đang trang bị rồi bấm Gỡ. Muốn trang bị hoặc thay thế, chọn item trong Túi đồ.</div>
          </div>
        </div>
      </section>
    </div>
  `
}
