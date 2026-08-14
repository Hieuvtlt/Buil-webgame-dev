import './style.css'
import './game.css'
import './responsive.css'
import './game-ui-redesign.css'
import './game-ui-compact.css'
import './quest.css'
import './combat.css'
import './character-showcase.css'
import './shell-redesign.css'

import { player } from './data/character.js'
import { CharacterScreen } from './ui/screens/CharacterScreen.js'
import { InventoryScreen } from './ui/screens/InventoryScreen.js'
import { SkillsScreen } from './ui/screens/SkillsScreen.js'
import { LuyenDanScreen } from './ui/screens/LuyenDanScreen.js'
import { LuyenKhiScreen } from './ui/screens/LuyenKhiScreen.js'
import { HopThanhScreen, mountHopThanhScreen } from './ui/screens/HopThanhScreen.js'
import { ThuongHoiScreen } from './ui/screens/ThuongHoiScreen.js'
import { NhiemVuScreen, mountNhiemVuScreen } from './ui/screens/NhiemVuScreen.js'
import { NgoaiCanhScreen } from './ui/screens/NgoaiCanhScreen.js'
import { GMScreen } from './ui/screens/GMScreen.js'
import { SettingsScreen } from './ui/screens/SettingsScreen.js'
import { CombatScreen, mountCombatScreen } from './ui/screens/CombatScreen.js'
import { mountCharacterScreen } from './ui/controllers/CharacterController.js'
import { mountInventoryScreen } from './ui/controllers/InventoryController.js'
import { mountSkillsScreen } from './ui/controllers/SkillsController.js'
import { mountMerchantScreen } from './ui/controllers/MerchantController.js'

const screens = {
  'Chiến đấu': { render: CombatScreen, mount: mountCombatScreen },
  'Nhân vật': { render: CharacterScreen, mount: mountCharacterScreen },
  'Túi đồ': { render: InventoryScreen, mount: mountInventoryScreen },
  'Kỹ năng': { render: SkillsScreen, mount: mountSkillsScreen },
  'Luyện đan': { render: LuyenDanScreen },
  'Luyện khí': { render: LuyenKhiScreen },
  'Hợp thành': { render: HopThanhScreen, mount: mountHopThanhScreen },
  'Thương hội': { render: ThuongHoiScreen, mount: mountMerchantScreen },
  'Nhiệm vụ': { render: NhiemVuScreen, mount: mountNhiemVuScreen },
  'Ngoại cảnh': { render: NgoaiCanhScreen },
  'GM': { render: GMScreen },
  'Cài đặt': { render: SettingsScreen },
}

const menuNames = Object.keys(screens)
const icons = ['⚔','♙','◈','◉','⚗','⚒','◆','▣','✦','◌','⚙','☷']

function topNavMarkup() {
  return `<header id="topbar" class="game-topbar">
    <div class="brand-mark">⚔ <span>THẾ GIỚI</span></div>
    <nav id="top-menu" class="top-menu" aria-label="Menu game">
      ${menuNames.map((name, index) => `<button class="top-menu-item${index === 0 ? ' active' : ''}" type="button" data-screen="${name}"><span class="top-menu-icon">${icons[index] ?? '•'}</span><span>${name}</span></button>`).join('')}
    </nav>
  </header>`
}

document.querySelector('#app').innerHTML = `<div id="game-shell" class="clean-game-shell">
  ${topNavMarkup()}
  <main id="col-center" class="clean-main">
    <header class="screen-header"><span class="ornament">◆</span><h2 id="screen-title">CHIẾN ĐẤU</h2><span class="ornament">◆</span><div class="header-actions"><button type="button" title="Trợ giúp">?</button><button type="button" title="Đóng">×</button></div></header>
    <div id="content-root"></div>
  </main>
  <div id="game-log" class="game-log" aria-live="polite" hidden></div>
</div>`

const contentRoot = document.querySelector('#content-root')
let currentScreenName = null

function openScreen(name) {
  const screen = screens[name]
  if (!screen) return
  currentScreenName = name
  document.querySelector('#screen-title').textContent = name.toUpperCase()
  document.querySelectorAll('#top-menu .top-menu-item').forEach(item => item.classList.toggle('active', item.dataset.screen === name))
  contentRoot.innerHTML = screen.render()
  screen.mount?.(contentRoot)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

function addGameLog(message, type = 'system') {
  const log = document.querySelector('#game-log')
  if (!log) return
  const line = document.createElement('div')
  line.className = `log-line log-${type}`
  line.textContent = `[${new Date().toLocaleTimeString('vi-VN')}] ${message}`
  log.appendChild(line)
  while (log.children.length > 100) log.removeChild(log.firstElementChild)
}

function bindMenuButtons() {
  document.querySelectorAll('#top-menu .top-menu-item').forEach(button => {
    button.addEventListener('click', () => {
      openScreen(button.dataset.screen)
      addGameLog(`Mở menu ${button.dataset.screen}.`)
    })
  })
}

bindMenuButtons()
window.addEventListener('game:inventory-changed', () => {
  if (currentScreenName === 'Túi đồ') openScreen('Túi đồ')
  addGameLog('Túi đồ đã được cập nhật.', 'item')
})
window.addEventListener('game:item-equipped', () => {
  if (currentScreenName === 'Túi đồ') openScreen('Túi đồ')
  addGameLog('Trang bị đã được cập nhật.', 'item')
})
window.addEventListener('game:log', event => {
  const detail = event.detail
  if (typeof detail === 'string') addGameLog(detail)
  else if (detail?.message) addGameLog(detail.message, detail.type ?? 'system')
})
openScreen('Chiến đấu')
