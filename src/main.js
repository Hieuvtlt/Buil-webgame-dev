import './style.css'
import './game.css'
import './responsive.css'
import './game-ui-redesign.css'
import './game-ui-compact.css'
import './combat.css'
import './character-showcase.css'

import characterImg from './assets/character.png'
import { player, getPlayerStats } from './data/character.js'
import { CharacterScreen } from './ui/screens/CharacterScreen.js'
import { InventoryScreen } from './ui/screens/InventoryScreen.js'
import { SkillsScreen } from './ui/screens/SkillsScreen.js'
import { LuyenDanScreen } from './ui/screens/LuyenDanScreen.js'
import { LuyenKhiScreen } from './ui/screens/LuyenKhiScreen.js'
import { HopThanhScreen, mountHopThanhScreen } from './ui/screens/HopThanhScreen.js'
import { ThuongHoiScreen } from './ui/screens/ThuongHoiScreen.js'
import { NhiemVuScreen } from './ui/screens/NhiemVuScreen.js'
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
  'Nhiệm vụ': { render: NhiemVuScreen },
  'Ngoại cảnh': { render: NgoaiCanhScreen },
  'GM': { render: GMScreen },
  'Cài đặt': { render: SettingsScreen },
}
const menuNames = Object.keys(screens)

function getHudStats(){const stats=getPlayerStats();return{stats,hp:Math.min(player.hp,stats.maxHp),mp:Math.min(player.mp,stats.maxMp)}}
function hudMarkup(){const{stats,hp,mp}=getHudStats();const hpPct=stats.maxHp?Math.max(0,Math.min(100,hp/stats.maxHp*100)):0;const mpPct=stats.maxMp?Math.max(0,Math.min(100,mp/stats.maxMp*100)):0;const expPct=player.expToNextLevel?Math.max(0,Math.min(100,player.exp/player.expToNextLevel*100)):0;const icons=['⚔','♙','◈','◉','⚗','⚒','◆','▣','✦','◌','⚙','☷'];const nav=menuNames.map((name,index)=>`<button class="menu-item${index===0?' active':''}" type="button" data-screen="${name}"><span class="menu-icon">${icons[index]??'•'}</span><span>${name}</span></button>`).join('');return `<aside id="col-left"><section class="profile-card"><div class="profile-head"><img src="${characterImg}" alt="Nhân vật" class="profile-avatar"/><div class="profile-info"><div class="profile-name">${player.name}</div><div class="profile-level">Lv. ${player.level}</div><div class="profile-exp">${player.exp} / ${player.expToNextLevel} (${expPct.toFixed(2)}%)</div><div class="hud-progress exp"><span style="width:${expPct}%"></span></div></div></div><div class="resource-row"><span>HP</span><strong>${hp}/${stats.maxHp}</strong><div class="hud-progress hp"><span style="width:${hpPct}%"></span></div></div><div class="resource-row"><span>MP</span><strong>${mp}/${stats.maxMp}</strong><div class="hud-progress mp"><span style="width:${mpPct}%"></span></div></div></section><nav id="left-menu" class="main-menu">${nav}</nav></aside>`}

document.querySelector('#app').innerHTML=`<div id="game-shell"><div id="game-grid">${hudMarkup()}<main id="col-center"><header class="screen-header"><span class="ornament">◆</span><h2 id="screen-title">CHIẾN ĐẤU</h2><span class="ornament">◆</span><div class="header-actions"><button type="button" title="Trợ giúp">?</button><button type="button" title="Đóng">×</button></div></header><div id="content-root"></div></main><aside id="col-right" aria-label="Auto và nhật ký"><section id="auto-panel" class="side-panel"><h3 class="side-panel-title"><span>⚙</span> AUTO</h3><div class="auto-options"><label><input type="checkbox" checked/> Auto đánh</label><label><input type="checkbox" checked/> Auto nhặt</label><label><input type="checkbox" checked/> Auto dùng buff</label><label><input type="checkbox"/> Auto dùng HP &lt; 50%</label><label><input type="checkbox"/> Auto dùng MP &lt; 30%</label><label><input type="checkbox"/> Auto dùng đan dược</label><label><input type="checkbox"/> Auto luyện võ kỹ</label></div><div class="auto-range-row"><span>Phạm vi tìm</span><select id="auto-range"><option>Toàn bản đồ</option><option>5</option><option>10</option><option>15</option></select></div><div class="auto-actions"><button class="side-action danger" type="button" id="auto-pause">TẠM DỪNG</button><button class="side-action" type="button" id="auto-stop">DỪNG</button></div></section><section id="log-panel" class="side-panel"><h3 class="side-panel-title log-title">▣ NHẬT KÝ</h3><div id="game-log" class="game-log" aria-live="polite"><div class="log-line">[Hệ thống] Sẵn sàng.</div><div class="log-line">[Nhân vật] Đã vào trò chơi.</div><div class="log-line">[Túi đồ] Hệ thống trang bị đã sẵn sàng.</div></div></section></aside></div><footer id="bottom-bar"><div class="world-status"><span>◉ Map: Tân Thủ Thôn</span><span class="ping">● Ping: 18ms</span></div><div class="hotbar" aria-label="Phím tắt vật phẩm">${[1,2,3,4,5,6].map(n=>`<button class="hot-slot" type="button"><span class="hot-key">${n}</span></button>`).join('')}</div><div class="currency-bar"><span>🪙 <b>${player.gold.toLocaleString('vi-VN')}</b></span><span>◈ <b>${player.spiritStone}</b></span><button type="button">NẠP THẺ</button></div><div class="footer-actions"><button type="button">♙<small>Nhân vật</small></button><button type="button">↪<small>Thoát</small></button></div></footer></div>`

const contentRoot=document.querySelector('#content-root');let currentScreenName=null
function openScreen(name){const screen=screens[name];if(!screen)return;currentScreenName=name;document.querySelector('#screen-title').textContent=name.toUpperCase();contentRoot.innerHTML=screen.render();screen.mount?.()}
function addGameLog(message,type='system'){const log=document.querySelector('#game-log');if(!log)return;const line=document.createElement('div');line.className=`log-line log-${type}`;line.textContent=`[${new Date().toLocaleTimeString('vi-VN')}] ${message}`;log.appendChild(line);while(log.children.length>100)log.removeChild(log.firstElementChild);log.scrollTop=log.scrollHeight}
function refreshHud(){const oldLeft=document.querySelector('#col-left');if(!oldLeft)return;const wrapper=document.createElement('div');wrapper.innerHTML=hudMarkup();oldLeft.replaceWith(wrapper.firstElementChild);bindMenuButtons()}
function bindMenuButtons(){document.querySelectorAll('#left-menu .menu-item').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('#left-menu .menu-item').forEach(item=>item.classList.remove('active'));button.classList.add('active');openScreen(button.dataset.screen);addGameLog(`Mở menu ${button.dataset.screen}.`)}))}
bindMenuButtons();document.querySelector('#auto-pause')?.addEventListener('click',()=>addGameLog('Auto đã tạm dừng.','warning'));document.querySelector('#auto-stop')?.addEventListener('click',()=>addGameLog('Auto đã dừng.','danger'));window.addEventListener('game:inventory-changed',()=>{if(currentScreenName==='Túi đồ')openScreen('Túi đồ');addGameLog('Túi đồ đã được cập nhật.','item')});window.addEventListener('game:item-equipped',()=>{if(currentScreenName==='Túi đồ')openScreen('Túi đồ');addGameLog('Trang bị đã được cập nhật.','item')});window.addEventListener('game:log',event=>{const detail=event.detail;if(typeof detail==='string')addGameLog(detail);else if(detail?.message)addGameLog(detail.message,detail.type??'system')});window.addEventListener('game:character-changed',refreshHud);openScreen('Chiến đấu')
