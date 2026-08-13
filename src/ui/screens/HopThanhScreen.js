import '../../craft.css'

const groups = {
  linhduoc: {
    label: 'Linh dược',
    options: ['Huyết Linh Chi', 'Nhân Sâm', 'Cam Thảo', 'Tử Linh Hoa', 'Bích Huyết Thảo', 'Thanh Tâm Thảo', 'Hỏa Linh Thảo', 'Băng Tâm Liên', 'Ngọc Linh Quả', 'Tử Vân Thảo', 'Long Huyết Thảo', 'Thiên Linh Chi'],
    icon: (index) => `/assets/vltk/linhduoc/${index + 1}.png`,
  },
  danduoc: {
    label: 'Đan dược',
    options: ['Hồi Khí Đan', 'Hồi Mana Đan', 'Tụ Linh Đan', 'Ngộ Đạo Đan'],
    icons: ['hoimau.png', 'hoimana.png', 'exp.png', 'expskill.png'],
    icon: (index) => `/assets/vltk/danduoc/${groups.danduoc.icons[index]}`,
  },
}

export function HopThanhScreen() {
  return `
    <div class="craft-screen game-screen">
      <h1 class="craft-title">HỢP THÀNH</h1>
      <div class="craft-layout">
        <section class="craft-main-panel">
          <div class="craft-machine-frame"><div class="craft-machine-placeholder">KHUNG HỢP THÀNH</div></div>
          <div class="craft-fields">
            <label class="craft-field"><span>Loại</span><select id="fusion-group"><option value="linhduoc">Linh dược</option><option value="danduoc">Đan dược</option></select></label>
            <label class="craft-field"><span>Vật phẩm</span><select id="fusion-item"></select></label>
            <label class="craft-field"><span>Level</span><select id="fusion-level">${Array.from({length:9},(_,i)=>`<option value="${i+1}">Lv${i+1}</option>`).join('')}</select></label>
            <div class="fusion-rule">2 vật phẩm cùng loại + cùng level → 1 vật phẩm level kế tiếp.</div>
            <div class="fusion-rule">Tỷ lệ vượt cấp: 1%-5% → có thể nhận cao hơn thêm 1 level.</div>
            <button class="craft-button" type="button" id="fusion-button">HỢP THÀNH</button>
          </div>
        </section>
        <aside class="craft-side-panel">
          <section class="craft-info-box craft-info-unified"><h3>Thông tin hợp thành</h3><div id="fusion-info" class="craft-result-placeholder">Chọn vật phẩm và level để xem kết quả.</div><div class="craft-material-title">Nguyên liệu cần:</div><div id="fusion-material" class="craft-material-list"></div></section>
        </aside>
      </div>
    </div>`
}

function getCurrentCount(itemName, level) {
  const inventory = globalThis.gameState?.inventory ?? globalThis.player?.inventory ?? globalThis.inventory
  if (!inventory) return 0
  if (Array.isArray(inventory)) {
    return inventory.reduce((sum, entry) => {
      if (entry?.name === `${itemName} Lv${level}` || (entry?.name === itemName && Number(entry?.level) === level)) {
        return sum + Number(entry.quantity ?? entry.count ?? entry.amount ?? 0)
      }
      return sum
    }, 0)
  }
  return 0
}

export function mountHopThanhScreen() {
  const group = document.querySelector('#fusion-group')
  const item = document.querySelector('#fusion-item')
  const level = document.querySelector('#fusion-level')
  const info = document.querySelector('#fusion-info')
  const material = document.querySelector('#fusion-material')

  const updateItems = () => {
    const data = groups[group.value]
    item.innerHTML = data.options.map((name, index) => `<option value="${index}">${name}</option>`).join('')
  }

  const update = () => {
    const data = groups[group.value]
    const itemIndex = Number(item.value || 0)
    const lv = Number(level.value)
    const next = lv + 1
    const over = lv + 2
    const chance = lv < 9 ? `${Math.floor(Math.random() * 5) + 1}%` : '0%'
    const name = data.options[itemIndex]
    const current = getCurrentCount(name, lv)
    const icon = data.icon(itemIndex)
    info.innerHTML = `
      <div class="craft-selected-head"><img class="craft-selected-icon" src="${icon}" alt=""><div><div class="craft-selected-name">${name} Lv${lv}</div><div class="craft-subtitle">2 Lv${lv} → 1 Lv${next}</div></div></div>
      <div class="craft-effect">Vượt cấp lên Lv${over}: ${chance}</div>`
    material.innerHTML = `<div class="craft-material-row ${current >= 2 ? 'is-enough' : 'is-short'}"><span>${name} Lv${lv}</span><b>${current}/2</b></div>`
  }

  group.addEventListener('change', () => { updateItems(); update() })
  item.addEventListener('change', update)
  level.addEventListener('change', update)
  updateItems()
  update()
}
