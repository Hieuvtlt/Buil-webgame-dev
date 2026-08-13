import characterImg from '../../assets/character.png'
import { player, getPlayerStats, getMaxSkillLevel, getEquippedItem } from '../../data/character.js'
import { EQUIPMENT_SLOTS } from '../../data/equipmentSlots.js'
import { items } from '../../data/items/index.js'

const STAT_LABELS = [
  ['attack', 'Tấn công'],
  ['defense', 'Phòng thủ'],
  ['crit', 'Tỷ lệ chí mạng'],
  ['critDamage', 'Sát thương chí mạng'],
  ['speed', 'Tốc độ'],
  ['dodge', 'Né tránh'],
]

const ATTR_LABELS = [
  ['strength', 'STR', 'Sức mạnh'],
  ['dexterity', 'DEX', 'Nhanh nhẹn'],
  ['energy', 'INT', 'Trí tuệ'],
  ['vitality', 'VIT', 'Thể lực'],
]

function equipmentSlotMarkup(slot, index) {
  const item = getEquippedItem(slot.id)
  return `<button class="hero-equip-slot${item ? ' filled' : ''}" type="button" data-slot-id="${slot.id}" title="${item?.name ?? slot.name}">
    ${item ? `<img src="${item.icon}" alt="${item.name}"/><span class="equip-plus">+${item.level ?? 0}</span>` : `<span class="equip-empty">${index === 10 ? '🔒' : '+'}</span>`}
  </button>`
}

function inventoryPreview() {
  const equippedIds = new Set(Object.values(player.equipment).filter(Boolean).map(Number))
  const preview = player.inventory
    .map(id => items.find(item => Number(item.id) === Number(id)))
    .filter(Boolean)
    .filter(item => !equippedIds.has(Number(item.id)))
    .slice(0, 20)
  return preview.map(item => `<div class="mini-item" title="${item.name}"><img src="${item.icon}" alt=""/><span>${item.quantity ?? 1}</span></div>`).join('')
}

function skillPreview() {
  const skillIcons = ['⚔️', '✦', '❄️', '🔥', '🌀', '🛡️']
  return skillIcons.map((icon, index) => `<div class="mini-skill"><div class="skill-art">${icon}</div><small>Lv.${Math.max(1, Math.min(getMaxSkillLevel(), 2 + index))}</small></div>`).join('')
}

export function CharacterScreen() {
  const stats = getPlayerStats()
  const attr = player.attributes
  const attack = Math.round((stats.attackMin + stats.attackMax) / 2)
  const crit = Math.min(100, 5 + Math.floor(stats.dexterity / 5))
  const speed = 180 + stats.dexterity
  const dodge = stats.dodge
  const combatPower = Math.max(1, attack + stats.defense * 2 + stats.accuracy + dodge + player.level * 30)
  const expPct = player.expToNextLevel ? Math.min(100, player.exp / player.expToNextLevel * 100) : 0
  const hpPct = stats.maxHp ? Math.min(100, player.hp / stats.maxHp * 100) : 0
  const mpPct = stats.maxMp ? Math.min(100, player.mp / stats.maxMp * 100) : 0

  return `
    <style>
      /* Character page: the character screen owns the whole canvas. */
      #game-shell:has(.character-page) #game-grid{display:block;min-height:100vh}
      #game-shell:has(.character-page) #col-left{position:fixed;z-index:30;top:0;left:0;right:0;width:100%;height:58px;display:block;padding:0;background:#080806;border-bottom:1px solid #5d4b25;box-shadow:0 4px 18px rgba(0,0,0,.55)}
      #game-shell:has(.character-page) #col-left .profile-card{display:none}
      #game-shell:has(.character-page) #left-menu{height:58px;display:flex;align-items:center;justify-content:center;gap:5px;padding:6px 12px;overflow-x:auto;overflow-y:hidden}
      #game-shell:has(.character-page) #left-menu .menu-item{flex:0 0 auto;height:42px;padding:0 12px;border:1px solid transparent;border-radius:5px;background:transparent;color:#bdb6a4;font:600 13px Georgia,"Times New Roman",serif;white-space:nowrap}
      #game-shell:has(.character-page) #left-menu .menu-item:hover{border-color:#5d4b25;color:#f0ca57;background:#17140c}
      #game-shell:has(.character-page) #left-menu .menu-item.active{border-color:#8b6b28;color:#f4ce58;background:#1b170b;box-shadow:inset 0 0 12px rgba(214,164,48,.12)}
      #game-shell:has(.character-page) #left-menu .menu-icon{margin-right:6px}
      #game-shell:has(.character-page) #col-right,#game-shell:has(.character-page) #bottom-bar{display:none}
      #game-shell:has(.character-page) #col-center{width:100%;max-width:none;margin:0;padding:66px 10px 12px}
      #game-shell:has(.character-page) .screen-header{display:none}
      #game-shell:has(.character-page) #content-root{width:100%}
      #game-shell:has(.character-page) .character-showcase{min-height:calc(100vh - 78px);overflow:auto}
      @media(max-width:900px){
        #game-shell:has(.character-page) #left-menu{justify-content:flex-start}
        #game-shell:has(.character-page) #left-menu .menu-item{padding:0 9px;font-size:12px}
      }
    </style>
    <div class="character-showcase game-screen character-page">
      <div class="character-titlebar"><span>⚔️</span><b>NHÂN VẬT</b></div>
      <div class="character-dashboard">
        <section class="character-profile-panel">
          <div class="profile-identity">
            <div class="portrait-frame"><img src="${characterImg}" alt="Nhân vật"/></div>
            <div class="identity-copy">
              <div class="hero-name">${player.name || 'HiếuVT'} <span>✎</span></div>
              <div class="hero-level">Lv.${player.level}</div>
              <div class="hero-exp">${player.exp.toLocaleString('vi-VN')} / ${player.expToNextLevel.toLocaleString('vi-VN')}</div>
              <div class="hero-exp-bar"><i style="width:${expPct}%"></i></div>
              <div class="hero-id">ID: 100025</div>
              <div class="hero-guild">Guild: Không có</div>
            </div>
          </div>
          <div class="resource-block hp-block"><span>❤ HP</span><div><i style="width:${hpPct}%"></i></div><b>${player.hp} / ${stats.maxHp}</b></div>
          <div class="resource-block mp-block"><span>🔷 MP</span><div><i style="width:${mpPct}%"></i></div><b>${player.mp} / ${stats.maxMp}</b></div>
          <div class="combat-stats">
            ${STAT_LABELS.map(([key, label]) => {
              const value = key === 'attack' ? attack : key === 'defense' ? stats.defense : key === 'crit' ? `${crit}%` : key === 'critDamage' ? '150%' : key === 'speed' ? speed : `${dodge}%`
              return `<div><span>${label}</span><b>${value}</b></div>`
            }).join('')}
          </div>
          <div class="attribute-box">
            <h3>THUỘC TÍNH</h3>
            ${ATTR_LABELS.map(([key, short, label]) => `<div class="attribute-row"><span><b>${short}</b> (${label})</span><b>${attr[key]}</b><button type="button" class="attr-add-btn" data-attribute="${key}">+</button></div>`).join('')}
          </div>
        </section>

        <section class="character-hero-panel">
          <div class="power-heading"><span>⚔️ LỰC CHIẾN</span><strong>${combatPower.toLocaleString('vi-VN')}</strong></div>
          <div class="hero-stage">
            <div class="stage-glow"></div>
            <div class="hero-equip-left">
              ${['weapon','helmet','armor','gloves','boots'].map((slot, i) => equipmentSlotMarkup(EQUIPMENT_SLOTS.find(s => s.id === slot) ?? {id:slot,name:slot}, i)).join('')}
            </div>
            <div class="hero-character"><img src="${characterImg}" alt="Nhân vật chính"/></div>
            <div class="hero-equip-right">
              ${['necklace','ring1','amulet','ring2','belt'].map((slot, i) => equipmentSlotMarkup(EQUIPMENT_SLOTS.find(s => s.id === slot) ?? {id:slot,name:slot}, i + 5)).join('')}
            </div>
          </div>
          <div class="hero-presets"><button class="active">1</button><button>2</button><button>3</button><button>🔒</button></div>
        </section>

        <section class="character-preview-panel">
          <div class="preview-card"><h3>XOAY NHÂN VẬT</h3><div class="rotation-row">
            ${['TRƯỚC','TRÁI','SAU','PHẢI'].map((label, i) => `<div class="rotation-cell"><div class="rotation-art ${i === 2 ? 'back' : i === 3 ? 'flip' : ''}"><img src="${characterImg}" alt="${label}"/></div><b>${label}</b></div>`).join('')}
          </div></div>
          <div class="preview-card animation-card"><h3>ANIMATION CƠ BẢN</h3><div class="animation-grid">
            ${['IDLE','WALK','RUN','JUMP','ATTACK 1','ATTACK 2','SKILL','DIE'].map((label, i) => `<div class="animation-cell"><div class="animation-art state-${i}"><img src="${characterImg}" alt="${label}"/></div><b>${label}</b></div>`).join('')}
          </div></div>
        </section>
      </div>

      <div class="character-bottom-grid">
        <section class="showcase-panel equipment-preview"><h3>TRANG BỊ</h3><div class="equipment-strip">${EQUIPMENT_SLOTS.map((slot, i) => equipmentSlotMarkup(slot, i)).join('')}${[1,2,3].map(() => '<div class="hero-equip-slot empty-slot"></div>').join('')}</div><div class="money-row"><span>🪙 ${player.gold.toLocaleString('vi-VN')}</span><span>💎 ${player.spiritStone.toLocaleString('vi-VN')}</span><button>＋</button></div></section>
        <section class="showcase-panel skills-preview"><h3>KỸ NĂNG</h3><div class="skill-tabs"><button class="active">Chủ động</button><button>Bị động</button></div><div class="skill-grid">${skillPreview()}</div></section>
        <section class="showcase-panel inventory-preview"><h3>TÚI ĐỒ</h3><div class="inventory-grid-mini">${inventoryPreview()}</div><div class="inventory-footer"><span>${player.inventory.length} / 100</span><button>＋</button></div></section>
        <section class="showcase-panel info-preview"><h3>THÔNG TIN</h3><div class="info-lines"><div><span>Ngày tạo:</span><b>01/01/2024</b></div><div><span>Thời gian chơi:</span><b>32h 15m</b></div><div><span>Nhiệm vụ hoàn thành:</span><b>0 / 326</b></div><div><span>Thành tựu:</span><b>0 / 100</b></div><div><span>Xếp hạng PvP:</span><b>Chưa xếp hạng</b></div></div><div class="points-box"><h3>ĐIỂM THUỘC TÍNH</h3><div>Điểm còn: <b>${player.freePoints}</b></div><button>PHÂN BỔ</button></div></section>
      </div>
      <div class="character-hotbar"><span>THANH PHÍM TẮT</span>${Array.from({length:10},(_,i)=>`<button><small>${i===9?'0':i+1}</small>${i<6 ? ['⚔️','🔥','🌀','✚','⚡','❄️'][i] : i===6?'🔮':i===7?'🟣':i===8?'🧪':'🔒'}</button>`).join('')}</div>
    </div>
  `
}
