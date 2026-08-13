import characterImg from '../../assets/character.png'
import { player, getPlayerStats, syncDerivedStats } from '../../data/character.js'

const QUEST = { id: 'goblin-hunt', title: 'Dọn sạch Goblin quanh thôn', target: 10, rewardExp: 80, rewardGold: 120 }
let enemy = null
let questProgress = 0
let combatLog = ['[Hệ thống] Bạn đã bước vào khu vực Goblin.']
let autoMode = false
let attackTimer = null

function makeEnemy() {
  const level = Math.max(1, player.level)
  return { name: 'Goblin', level, maxHp: 70 + level * 12, hp: 70 + level * 12, defense: 3 + level, attack: 5 + level * 2 }
}

function addLog(message) {
  combatLog.push(message)
  if (combatLog.length > 8) combatLog = combatLog.slice(-8)
}

function gainExp(amount) {
  player.exp += amount
  let leveled = false
  while (player.level < 200 && player.exp >= player.expToNextLevel) {
    player.exp -= player.expToNextLevel
    player.level += 1
    player.freePoints += 5
    player.expToNextLevel = Math.round(100 * Math.pow(1.08, player.level - 1))
    leveled = true
  }
  syncDerivedStats()
  if (leveled) addLog(`[Cấp độ] Bạn đã lên Lv.${player.level}! +5 điểm thuộc tính.`)
}

function renderCombat() {
  const stats = getPlayerStats()
  const hpPct = Math.max(0, Math.min(100, enemy.hp / enemy.maxHp * 100))
  const playerHpPct = Math.max(0, Math.min(100, player.hp / stats.maxHp * 100))
  const questPct = Math.min(100, questProgress / QUEST.target * 100)
  return `
    <div class="combat-screen game-screen">
      <section class="combat-stage">
        <div class="zone-label">TÂN THỦ THÔN · BÌA RỪNG</div>
        <div class="quest-chip">⚑ ${QUEST.title} <b>${questProgress}/${QUEST.target}</b></div>
        <div class="battle-arena">
          <div class="combat-entity player-entity">
            <div class="entity-name">${player.name} <span>Lv.${player.level}</span></div>
            <div class="combat-bar hp"><i style="width:${playerHpPct}%"></i></div>
            <img src="${characterImg}" alt="Nhân vật" class="combat-player-sprite" />
            <div class="entity-shadow"></div>
          </div>
          <div class="vs-mark">VS</div>
          <div class="combat-entity enemy-entity">
            <div class="entity-name">${enemy.name} <span>Lv.${enemy.level}</span></div>
            <div class="combat-bar enemy-hp"><i style="width:${hpPct}%"></i></div>
            <div class="goblin-sprite" aria-label="Goblin">👹</div>
            <div class="entity-shadow"></div>
          </div>
        </div>
        <div class="combat-actions">
          <button class="combat-btn primary" id="combat-attack">⚔ ĐÁNH THƯỜNG <small>Space</small></button>
          <button class="combat-btn" id="combat-skill">✦ KIẾM KHÍ <small>Q</small></button>
          <button class="combat-btn" id="combat-heal">♥ HỒI PHỤC <small>1</small></button>
          <button class="combat-btn auto ${autoMode ? 'active' : ''}" id="combat-auto">${autoMode ? '■ DỪNG AUTO' : '▶ AUTO ĐÁNH'}</button>
        </div>
        <div class="combat-log">${combatLog.map(line => `<div>${line}</div>`).join('')}</div>
      </section>
      <aside class="combat-info">
        <div class="battle-panel">
          <h3>🎯 Nhiệm vụ hiện tại</h3>
          <div class="quest-name">${QUEST.title}</div>
          <div class="quest-progress"><i style="width:${questPct}%"></i></div>
          <div class="quest-row"><span>Tiến độ</span><b>${questProgress} / ${QUEST.target}</b></div>
          <div class="quest-row"><span>Thưởng</span><b>${QUEST.rewardExp} EXP · ${QUEST.rewardGold} vàng</b></div>
          ${questProgress >= QUEST.target ? '<div class="quest-complete">✓ Đã hoàn thành — nhận thưởng!</div>' : ''}
        </div>
        <div class="battle-panel">
          <h3>⚔ Chỉ số chiến đấu</h3>
          <div class="stat-row"><span>Ngoại công</span><b>${stats.attackMin}-${stats.attackMax}</b></div>
          <div class="stat-row"><span>Ngoại phòng</span><b>${stats.defense}</b></div>
          <div class="stat-row"><span>Chính xác</span><b>${stats.accuracy}</b></div>
          <div class="stat-row"><span>Né tránh</span><b>${stats.dodge}</b></div>
        </div>
      </aside>
    </div>
  `
}

function finishEnemy() {
  const rewardExp = 8 + player.level * 2
  const rewardGold = 12 + player.level * 3
  player.gold += rewardGold
  gainExp(rewardExp)
  questProgress = Math.min(QUEST.target, questProgress + 1)
  addLog(`[Chiến đấu] Goblin bị đánh bại. +${rewardExp} EXP, +${rewardGold} vàng.`)
  if (questProgress === QUEST.target) {
    player.gold += QUEST.rewardGold
    gainExp(QUEST.rewardExp)
    addLog(`[Nhiệm vụ] Hoàn thành! +${QUEST.rewardExp} EXP, +${QUEST.rewardGold} vàng.`)
  }
  enemy = makeEnemy()
}

function attack(multiplier = 1, label = 'Đánh thường') {
  if (!enemy) enemy = makeEnemy()
  const stats = getPlayerStats()
  const raw = Math.floor(stats.attackMin + Math.random() * Math.max(1, stats.attackMax - stats.attackMin + 1))
  const damage = Math.max(1, Math.floor(raw * multiplier) - enemy.defense)
  enemy.hp -= damage
  addLog(`[Bạn] ${label}: -${damage} HP ${enemy.name}.`)
  if (enemy.hp <= 0) finishEnemy()
  else {
    const incoming = Math.max(1, enemy.attack - Math.floor(stats.defense / 2))
    player.hp = Math.max(0, player.hp - incoming)
    addLog(`[${enemy.name}] Phản kích: -${incoming} HP.`)
    if (player.hp <= 0) { player.hp = stats.maxHp; addLog('[Hệ thống] Bạn ngã xuống và được hồi phục tại thôn.'); autoMode = false; stopAuto() }
  }
  window.dispatchEvent(new CustomEvent('game:character-changed'))
  const root = document.querySelector('#content-root')
  if (root) { root.innerHTML = renderCombat(); bindCombat() }
}

function stopAuto() { if (attackTimer) clearInterval(attackTimer); attackTimer = null }
function startAuto() { stopAuto(); attackTimer = setInterval(() => { if (!autoMode) return; attack() }, 1000) }

function bindCombat() {
  document.querySelector('#combat-attack')?.addEventListener('click', () => attack())
  document.querySelector('#combat-skill')?.addEventListener('click', () => attack(1.8, 'Kiếm khí'))
  document.querySelector('#combat-heal')?.addEventListener('click', () => {
    const stats = getPlayerStats(); const amount = Math.floor(stats.maxHp * 0.3); player.hp = Math.min(stats.maxHp, player.hp + amount); addLog(`[Đan dược] Hồi ${amount} HP.`); window.dispatchEvent(new CustomEvent('game:character-changed')); document.querySelector('#content-root').innerHTML = renderCombat(); bindCombat()
  })
  document.querySelector('#combat-auto')?.addEventListener('click', () => { autoMode = !autoMode; if (autoMode) startAuto(); else stopAuto(); document.querySelector('#content-root').innerHTML = renderCombat(); bindCombat() })
}

export function CombatScreen() {
  if (!enemy) enemy = makeEnemy()
  return renderCombat()
}

export function mountCombatScreen() { bindCombat() }

window.addEventListener('keydown', event => {
  if (!document.querySelector('.combat-screen') || event.repeat) return
  if (event.code === 'Space') { event.preventDefault(); attack() }
  if (event.key.toLowerCase() === 'q') attack(1.8, 'Kiếm khí')
  if (event.key === '1') document.querySelector('#combat-heal')?.click()
})
