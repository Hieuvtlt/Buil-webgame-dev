import { player } from '../../data/character.js'
import { BOUNTY_TARGETS, MONSTER_QUESTS, clampQuestLevel, getMonsterCountRange } from '../../data/questData.js'

const STORAGE_KEY = 'vltk.questState.v1'

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return {
      monster: Array.isArray(saved.monster) ? saved.monster.slice(0, 2) : [],
      bounty: typeof saved.bounty === 'string' ? saved.bounty : null,
      bountyCompleted: Number.isFinite(saved.bountyCompleted) ? saved.bountyCompleted : 0,
      bountyRefreshAt: Number.isFinite(saved.bountyRefreshAt) ? saved.bountyRefreshAt : 0,
    }
  } catch {
    return { monster: [], bounty: null, bountyCompleted: 0, bountyRefreshAt: 0 }
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function getCurrentState() {
  const state = loadState()
  if (!state.bountyRefreshAt) state.bountyRefreshAt = Date.now() + 60 * 60 * 1000
  if (Date.now() >= state.bountyRefreshAt) {
    state.bounty = null
    state.bountyRefreshAt = Date.now() + 60 * 60 * 1000
  }
  saveState(state)
  return state
}

function formatNumber(value) {
  return Number(value).toLocaleString('vi-VN')
}

function formatCountdown(target) {
  const seconds = Math.max(0, Math.ceil((target - Date.now()) / 1000))
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0')
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

function monsterCard(quest, index, state) {
  const range = getMonsterCountRange(player.level)
  const questLevel = clampQuestLevel(player.level, quest.levelOffset)
  const accepted = state.monster.includes(quest.id)
  const full = state.monster.length >= 2 && !accepted
  return `
    <article class="quest-card ${accepted ? 'accepted' : ''} ${full ? 'locked' : ''}">
      <span class="quest-number">#${String(index + 1).padStart(2, '0')}</span>
      <div class="quest-title-row">
        <div class="quest-icon" aria-hidden="true">⚔</div>
        <div><h3>${quest.name}</h3><div class="quest-subtitle">Nhiệm vụ quái vật · ${quest.monster}</div></div>
      </div>
      <div class="quest-meta">
        <span>📍 <b>${quest.map}</b></span>
        <span>Lv. <b>${questLevel}</b></span>
        <span>🎯 <b>${range.min}–${range.max}</b> con</span>
        <span>↕ ±5 Lv <b class="accent">được phép</b></span>
      </div>
      <div class="quest-reward">🎁 <b>${formatNumber(quest.rewardGold)} vàng</b> · ${quest.rewardPill} · Linh dược ×${quest.rewardHerbs}</div>
      <div class="quest-actions">
        ${accepted
          ? `<button class="quest-btn accepted" type="button" data-action="monster-go" data-id="${quest.id}">ĐI ĐẾN BẢN ĐỒ</button>`
          : `<button class="quest-btn" type="button" data-action="monster-accept" data-id="${quest.id}" ${full ? 'disabled' : ''}>${full ? 'ĐÃ ĐỦ 2 NHIỆM VỤ' : 'NHẬN NHIỆM VỤ'}</button>`}
      </div>
    </article>`
}

function bountyCard(target, state) {
  const accepted = state.bounty === target.id
  const full = Boolean(state.bounty && !accepted)
  const disabled = full || state.bountyCompleted >= 10
  return `
    <article class="quest-card bounty-card ${accepted ? 'accepted' : ''} ${full ? 'locked' : ''}">
      <span class="quest-number">${accepted ? 'ĐÃ NHẬN' : 'TRUY NÃ'}</span>
      <div class="quest-title-row">
        <div class="quest-icon" aria-hidden="true">☠</div>
        <div><h3>${target.name}</h3><div class="quest-subtitle">Boss nhỏ · Lv.${target.level}</div></div>
      </div>
      <div class="quest-meta">
        <span>📍 <b>${target.map}</b></span>
        <span>🔎 <b class="bounty-chance">${target.chance}</b></span>
        <span>🎁 <b>${formatNumber(target.exp)} EXP</b></span>
        <span>💰 <b>${formatNumber(target.gold)} vàng</b></span>
      </div>
      <div class="quest-reward">🎁 Đan dược ×${target.pills} · Linh dược ×${target.herbs} · Khi gặp mục tiêu, mới có thể tiêu diệt và hoàn thành.</div>
      <div class="quest-actions">
        ${accepted
          ? `<button class="quest-btn accepted" type="button" data-action="bounty-go" data-id="${target.id}">ĐI TÌM MỤC TIÊU</button>`
          : `<button class="quest-btn" type="button" data-action="bounty-accept" data-id="${target.id}" ${disabled ? 'disabled' : ''}>${state.bountyCompleted >= 10 ? 'ĐỦ 10 LẦN HÔM NAY' : full ? 'ĐÃ CÓ 1 TRUY NÃ' : 'NHẬN TRUY NÃ'}</button>`}
      </div>
    </article>`
}

export function NhiemVuScreen() {
  const state = getCurrentState()
  const range = getMonsterCountRange(player.level)
  return `
    <div class="quest-screen game-screen">
      <div class="quest-tabs" role="tablist" aria-label="Loại nhiệm vụ">
        <button class="quest-tab active" type="button" role="tab" aria-selected="true" data-quest-tab="monster">⚔ NHIỆM VỤ QUÁI VẬT</button>
        <button class="quest-tab" type="button" role="tab" aria-selected="false" data-quest-tab="bounty">☠ TRUY NÃ</button>
      </div>

      <section class="quest-panel active" data-quest-panel="monster" role="tabpanel">
        <div class="quest-summary">
          <span>⚔ Đã nhận: <strong>${state.monster.length}/2</strong> · Có thể nhận nhiệm vụ cả ngày, <strong>không giới hạn số lần</strong>.</span>
          <span class="quest-refresh">Cấp hiện tại: <b>Lv.${player.level}</b> · Mỗi nhiệm vụ: <b>${range.min}–${range.max} quái</b></span>
        </div>
        <div class="quest-list-scroll">
          <div class="quest-grid">
            ${MONSTER_QUESTS.map((quest, index) => monsterCard(quest, index, state)).join('')}
          </div>
        </div>
        <div class="quest-footer-note">Có 10 loại nhiệm vụ để tự chọn. Khi nhận đủ 2 nhiệm vụ, các lựa chọn còn lại sẽ tạm khóa.</div>
      </section>

      <section class="quest-panel" data-quest-panel="bounty" role="tabpanel">
        <div class="quest-summary">
          <span>☠ Truy nã hôm nay: <strong>${state.bountyCompleted}/10</strong> · Đang nhận: <strong>${state.bounty ? '1/1' : '0/1'}</strong></span>
          <span class="quest-refresh">Làm mới sau: <b data-bounty-timer>${formatCountdown(state.bountyRefreshAt)}</b></span>
        </div>
        <div class="quest-list-scroll">
          <div class="quest-grid bounty-grid">
            ${BOUNTY_TARGETS.map((target) => bountyCard(target, state)).join('')}
          </div>
        </div>
        <div class="quest-footer-note">Mục tiêu truy nã xuất hiện ngẫu nhiên trên map với xác suất thấp; phải đi tìm mới có thể gặp.</div>
      </section>
    </div>`
}

function mountQuestInteractions(root) {
  if (!root) return

  root.querySelectorAll('[data-quest-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      const tab = button.dataset.questTab
      root.querySelectorAll('[data-quest-tab]').forEach((item) => {
        const active = item === button
        item.classList.toggle('active', active)
        item.setAttribute('aria-selected', String(active))
      })
      root.querySelectorAll('[data-quest-panel]').forEach((panel) => panel.classList.toggle('active', panel.dataset.questPanel === tab))
    })
  })

  root.querySelectorAll('[data-action="monster-accept"]').forEach((button) => {
    button.addEventListener('click', () => {
      const state = getCurrentState()
      if (state.monster.length >= 2 || state.monster.includes(button.dataset.id)) return
      state.monster.push(button.dataset.id)
      saveState(state)
      renderQuestScreenInPlace(root, state)
      window.dispatchEvent(new CustomEvent('game:log', { detail: { message: `Đã nhận nhiệm vụ quái vật ${button.dataset.id}.`, type: 'quest' } }))
    })
  })

  root.querySelectorAll('[data-action="bounty-accept"]').forEach((button) => {
    button.addEventListener('click', () => {
      const state = getCurrentState()
      if (state.bounty || state.bountyCompleted >= 10) return
      state.bounty = button.dataset.id
      saveState(state)
      renderQuestScreenInPlace(root, state)
      window.dispatchEvent(new CustomEvent('game:log', { detail: { message: `Đã nhận truy nã ${button.dataset.id}.`, type: 'quest' } }))
    })
  })

  root.querySelectorAll('[data-action="monster-go"], [data-action="bounty-go"]').forEach((button) => {
    button.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('game:log', { detail: { message: `Đang tìm đường tới mục tiêu nhiệm vụ ${button.dataset.id}.`, type: 'quest' } }))
    })
  })

  startQuestTimer(root)
}

function renderQuestScreenInPlace(root, state) {
  const activeTab = root.querySelector('.quest-tab.active')?.dataset.questTab || 'monster'
  saveState(state)
  const rebuilt = document.createRange().createContextualFragment(NhiemVuScreen())
  root.replaceChildren(rebuilt)
  root.querySelectorAll('[data-quest-panel]').forEach((panel) => panel.classList.toggle('active', panel.dataset.questPanel === activeTab))
  root.querySelectorAll('[data-quest-tab]').forEach((button) => {
    const active = button.dataset.questTab === activeTab
    button.classList.toggle('active', active)
    button.setAttribute('aria-selected', String(active))
  })
  mountQuestInteractions(root)
}

function startQuestTimer(root) {
  const timer = root.querySelector('[data-bounty-timer]')
  if (!timer) return
  const interval = window.setInterval(() => {
    if (!root.isConnected) {
      window.clearInterval(interval)
      return
    }
    const state = getCurrentState()
    timer.textContent = formatCountdown(state.bountyRefreshAt)
    if (Date.now() >= state.bountyRefreshAt) renderQuestScreenInPlace(root, state)
  }, 1000)
}

export function mountNhiemVuScreen(root) {
  mountQuestInteractions(root)
}
