import characterImg from '../../assets/character.png'
import { player, getPlayerStats, getEquippedItem } from '../../data/character.js'
import { EQUIPMENT_SLOTS } from '../../data/equipmentSlots.js'

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

function slotButton(slot, index) {
  const item = getEquippedItem(slot.id)
  return `<button class="character-equip-slot${item ? ' filled' : ''}" type="button" data-slot-id="${slot.id}" title="${item?.name ?? slot.name}">
    ${item ? `<img src="${item.icon}" alt="${item.name}"><span>+${item.level ?? 0}</span>` : `<b>${index === 10 ? '🔒' : '+'}</b>`}
  </button>`
}

export function CharacterScreen() {
  const stats = getPlayerStats()
  const attr = player.attributes
  const attack = Math.round((stats.attackMin + stats.attackMax) / 2)
  const crit = Math.min(100, 5 + Math.floor(stats.dexterity / 5))
  const speed = 180 + stats.dexterity
  const dodge = stats.dodge
  const power = Math.max(1, attack + stats.defense * 2 + stats.accuracy + dodge + player.level * 30)
  const expPct = player.expToNextLevel ? Math.min(100, (player.exp / player.expToNextLevel) * 100) : 0
  const hpPct = stats.maxHp ? Math.min(100, (player.hp / stats.maxHp) * 100) : 0
  const mpPct = stats.maxMp ? Math.min(100, (player.mp / stats.maxMp) * 100) : 0

  const leftSlots = ['weapon', 'helmet', 'armor', 'gloves', 'boots'].map(id => EQUIPMENT_SLOTS.find(s => s.id === id)).filter(Boolean)
  const rightSlots = ['belt', 'necklace', 'ring1', 'ring2', 'amulet'].map(id => EQUIPMENT_SLOTS.find(s => s.id === id)).filter(Boolean)

  return `
    <style>
      .character-page{font-family:Georgia,"Times New Roman",serif;color:#eee7d4;background:#050706;box-sizing:border-box;min-height:calc(100vh - 76px);padding:0 2px 8px;overflow:visible}
      .character-page *{box-sizing:border-box}
      .character-title{height:48px;display:flex;align-items:center;gap:10px;padding:0 16px;margin-bottom:8px;border:1px solid #65501f;border-radius:6px;background:linear-gradient(180deg,#211e17,#100f0b);color:#f2ca50;font-size:21px;letter-spacing:.8px}
      .character-layout{display:grid;grid-template-columns:minmax(270px,1fr) minmax(380px,1.45fr) minmax(430px,1.7fr);gap:8px;min-height:690px}
      .character-card{border:1px solid #514522;border-radius:6px;background:linear-gradient(180deg,#0b0d0c,#050605);box-shadow:inset 0 0 0 1px rgba(255,255,255,.02),0 5px 18px rgba(0,0,0,.35);overflow:hidden}

      /* LEFT: all character information lives in one column. */
      .character-info{padding:10px;overflow:auto;scrollbar-width:thin;scrollbar-color:#62522c #090a08}
      .identity{display:flex;gap:10px;padding-bottom:9px;border-bottom:1px solid #29291f}
      .portrait{width:92px;height:104px;flex:0 0 92px;border:2px solid #806526;padding:4px;background:#070807;display:flex;align-items:center;justify-content:center}
      .portrait img{width:100%;height:100%;object-fit:contain}
      .name{font-size:21px;font-weight:800;color:#f4eee2}.name em{font-size:13px;color:#a8a190;font-style:normal}
      .level{margin-top:4px;color:#ffd45b;font-weight:800;font-size:15px}.exp-text,.id,.guild{font:11px Arial,sans-serif;color:#aaa596;margin-top:5px}
      .expbar{height:8px;margin-top:5px;border:1px solid #403a29;border-radius:6px;background:#171914;overflow:hidden}.expbar i{display:block;height:100%;background:#6fc13a}
      .meter{display:grid;grid-template-columns:42px 1fr 76px;gap:6px;align-items:center;margin-top:8px;font:12px Arial,sans-serif}.meter .bar{height:8px;border-radius:6px;background:#171914;border:1px solid #3a3326;overflow:hidden}.meter i{display:block;height:100%}.hp i{background:#b6332d}.mp i{background:#1681c8}.meter b{text-align:right;color:#e9e2d5}
      .stats{margin-top:8px;padding:5px 0;border-top:1px solid #29291f;border-bottom:1px solid #29291f}.stats div{display:flex;justify-content:space-between;padding:4px 2px;font-size:12px}.stats b{color:#f2dda0}
      .attrs{padding-top:8px}.section-title{margin:0 0 5px;text-align:center;color:#d8aa34;font-size:14px;letter-spacing:.6px}.attr-row{display:grid;grid-template-columns:1fr 32px 24px;gap:6px;align-items:center;padding:5px 2px;border-bottom:1px solid #1a1c18;font-size:12px}.attr-row strong{color:#ded1ad}.attr-add{width:21px;height:21px;border:1px solid #896b26;border-radius:4px;background:#17150b;color:#f2c341;font-weight:900;cursor:pointer}.attr-add:hover{background:#28200d}
      .extra-info{margin-top:9px;padding-top:8px;border-top:1px solid #3a3423;font:11px Arial,sans-serif}.extra-row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #1c201b}.extra-row b{color:#ece5d2}.points{margin-top:9px;text-align:center}.points h3{margin:0 0 4px;color:#d9aa34;font-size:15px}.points small{color:#c2baaa}.points button{width:100%;margin-top:7px;padding:8px;border:1px solid #1e5d83;border-radius:5px;background:linear-gradient(180deg,#123a5a,#0b2236);color:#d9efff;font-weight:800;cursor:pointer}

      /* CENTER: character + equipment only. */
      .character-center{position:relative;background:radial-gradient(circle at 50% 55%,rgba(24,62,49,.48),transparent 46%),linear-gradient(180deg,#06131a,#050807 72%);display:flex;flex-direction:column}
      .power{text-align:center;padding:12px 0 4px;color:#f1c642;font-size:16px;letter-spacing:.5px}.power strong{display:block;font-size:29px;line-height:1.1}
      .stage{position:relative;flex:1;min-height:520px;display:flex;align-items:center;justify-content:center}.glow{position:absolute;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(78,137,100,.3),transparent 68%);filter:blur(8px)}
      .main-character{position:relative;z-index:2;width:270px;height:390px;display:flex;align-items:center;justify-content:center}.main-character img{width:250px;height:340px;object-fit:contain;filter:drop-shadow(0 14px 10px #000)}
      .equip-column{position:absolute;top:20px;z-index:4;display:flex;flex-direction:column;gap:9px}.equip-column.left{left:14px}.equip-column.right{right:14px}.character-equip-slot{position:relative;width:58px;height:58px;border:2px solid #816525;border-radius:5px;background:linear-gradient(145deg,#1c1c14,#090a08);box-shadow:inset 0 0 12px #000;display:flex;align-items:center;justify-content:center;color:#565246;cursor:pointer}.character-equip-slot:hover{border-color:#c39a31}.character-equip-slot img{width:100%;height:100%;object-fit:contain}.character-equip-slot b{font:700 24px Arial;color:#4b493e}.character-equip-slot span{position:absolute;right:2px;bottom:1px;color:#fff0a0;font:700 10px Arial;text-shadow:0 1px 2px #000}
      .presets{height:48px;display:flex;justify-content:center;gap:8px;padding-bottom:8px}.presets button{width:42px;height:34px;border:1px solid #5e4c26;border-radius:4px;background:#0b0c0a;color:#c5bca8}.presets .active{border-color:#d5a42b;color:#f6c746;background:#1b1609}

      /* RIGHT: visual character states. */
      .visuals{display:grid;grid-template-rows:250px 1fr;gap:8px;background:#070807;border:0;overflow:visible}.visual-card{border:1px solid #514522;border-radius:6px;background:linear-gradient(180deg,#0d0f0e,#060706);overflow:hidden}.visual-card h3{height:39px;margin:0;padding:10px;text-align:center;border-bottom:1px solid #393522;color:#dfba50;font-size:14px}.rotation{height:calc(100% - 39px);display:grid;grid-template-columns:repeat(4,1fr)}.rotation-item,.anim-item{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:0}.visual-art{width:110px;height:145px;display:flex;align-items:center;justify-content:center}.visual-art img{width:100px;height:125px;object-fit:contain}.visual-art.flip img{transform:scaleX(-1)}.visual-art.back img{filter:brightness(.65) contrast(.85)}.visual-label{font-size:10px;color:#e6d39b;margin-top:4px}
      .animation{height:100%;overflow:auto;scrollbar-width:thin;scrollbar-color:#62522c #090a08}.animation-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:2px;padding:6px}.anim-item{min-height:125px}.anim-art{width:105px;height:88px;display:flex;align-items:center;justify-content:center}.anim-art img{width:78px;height:78px;object-fit:contain;filter:drop-shadow(0 4px 4px #000)}.anim-art.a1 img{transform:translateX(5px) rotate(-3deg)}.anim-art.a2 img{transform:translateX(8px) rotate(-7deg)}.anim-art.a3 img{transform:translateY(-5px) rotate(7deg)}.anim-art.a4 img{transform:rotate(-12deg) scale(1.08)}.anim-art.a5 img{transform:scaleX(-1) rotate(-10deg) scale(1.08)}.anim-art.a6 img{filter:drop-shadow(0 0 8px #4299ed) drop-shadow(0 5px 4px #000)}.anim-art.a7 img{opacity:.5;transform:rotate(90deg) translateY(7px)}

      /* Inventory and equipment are intentionally NOT embedded here: they are separate top-menu screens. */
      @media(min-width:1250px){.character-layout{min-height:calc(100vh - 145px);height:calc(100vh - 145px);max-height:820px}.character-info{overflow-y:auto}.stage{min-height:0}.main-character{height:330px}.main-character img{height:300px}.visuals{grid-template-rows:220px 1fr}.visual-art{height:120px}.visual-art img{height:105px}.anim-item{min-height:105px}.anim-art{height:72px}.anim-art img{height:65px}}
      @media(max-width:1100px){.character-layout{grid-template-columns:290px minmax(360px,1fr)}.visuals{grid-column:1/-1;grid-template-columns:1fr 1.4fr;grid-template-rows:none;height:330px}.animation{min-height:0}.character-center{min-height:620px}}
      @media(max-width:760px){.character-title{font-size:18px}.character-layout{grid-template-columns:1fr}.visuals{grid-column:auto;grid-template-columns:1fr;grid-template-rows:220px 340px;height:auto}.character-center{min-height:600px}.animation-grid{grid-template-columns:repeat(4,1fr)}.character-info{max-height:none}}
    </style>

    <div class="character-page">
      <div class="character-title"><span>⚔️</span><b>NHÂN VẬT</b></div>

      <div class="character-layout">
        <section class="character-card character-info">
          <div class="identity">
            <div class="portrait"><img src="${characterImg}" alt="Nhân vật"></div>
            <div>
              <div class="name">${player.name || 'Nhân vật'} <em>✎</em></div>
              <div class="level">Lv.${player.level}</div>
              <div class="exp-text">${player.exp.toLocaleString('vi-VN')} / ${player.expToNextLevel.toLocaleString('vi-VN')}</div>
              <div class="expbar"><i style="width:${expPct}%"></i></div>
              <div class="id">ID: 100025</div>
              <div class="guild">Guild: ${player.sect === 'tanTu' ? 'Không có' : player.sect}</div>
            </div>
          </div>

          <div class="meter hp"><span>❤ HP</span><div class="bar"><i style="width:${hpPct}%"></i></div><b>${player.hp} / ${stats.maxHp}</b></div>
          <div class="meter mp"><span>🔷 MP</span><div class="bar"><i style="width:${mpPct}%"></i></div><b>${player.mp} / ${stats.maxMp}</b></div>

          <div class="stats">
            ${STAT_LABELS.map(([key, label]) => {
              const value = key === 'attack' ? attack : key === 'defense' ? stats.defense : key === 'crit' ? `${crit}%` : key === 'critDamage' ? '150%' : key === 'speed' ? speed : `${dodge}%`
              return `<div><span>${label}</span><b>${value}</b></div>`
            }).join('')}
          </div>

          <div class="attrs">
            <h3 class="section-title">THUỘC TÍNH</h3>
            ${ATTR_LABELS.map(([key, short, label]) => `<div class="attr-row"><strong>${short} (${label})</strong><b>${attr[key]}</b><button class="attr-add" type="button" data-attribute="${key}">+</button></div>`).join('')}
          </div>

          <div class="extra-info">
            <div class="extra-row"><span>Ngày tạo:</span><b>01/01/2024</b></div>
            <div class="extra-row"><span>Thời gian chơi:</span><b>32h 15m</b></div>
            <div class="extra-row"><span>Nhiệm vụ hoàn thành:</span><b>0 / 326</b></div>
            <div class="extra-row"><span>Thành tựu:</span><b>0 / 100</b></div>
            <div class="extra-row"><span>Xếp hạng PvP:</span><b>Chưa xếp hạng</b></div>
          </div>
          <div class="points"><h3>ĐIỂM THUỘC TÍNH</h3><small>Điểm còn: <b>${player.freePoints}</b></small><button type="button">PHÂN BỔ</button></div>
        </section>

        <section class="character-card character-center">
          <div class="power">⚔️ LỰC CHIẾN<strong>${power.toLocaleString('vi-VN')}</strong></div>
          <div class="stage">
            <div class="glow"></div>
            <div class="equip-column left">${leftSlots.map((slot, i) => slotButton(slot, i)).join('')}</div>
            <div class="main-character"><img src="${characterImg}" alt="Nhân vật chính"></div>
            <div class="equip-column right">${rightSlots.map((slot, i) => slotButton(slot, i + 5)).join('')}</div>
          </div>
          <div class="presets"><button class="active">1</button><button>2</button><button>3</button><button>🔒</button></div>
        </section>

        <section class="visuals">
          <div class="visual-card">
            <h3>XOAY NHÂN VẬT</h3>
            <div class="rotation">
              ${['TRƯỚC','TRÁI','SAU','PHẢI'].map((label, i) => `<div class="rotation-item"><div class="visual-art ${i === 2 ? 'back' : i === 3 ? 'flip' : ''}"><img src="${characterImg}" alt="${label}"></div><b class="visual-label">${label}</b></div>`).join('')}
            </div>
          </div>
          <div class="visual-card animation">
            <h3>ANIMATION CƠ BẢN</h3>
            <div class="animation-grid">
              ${['IDLE','WALK','RUN','JUMP','ATTACK 1','ATTACK 2','SKILL','DIE'].map((label, i) => `<div class="anim-item"><div class="anim-art a${i}"><img src="${characterImg}" alt="${label}"></div><b class="visual-label">${label}</b></div>`).join('')}
            </div>
          </div>
        </section>
      </div>
    </div>
  `
}
