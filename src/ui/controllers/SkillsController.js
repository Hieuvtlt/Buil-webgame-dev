import { getSkillById } from '../../data/skills/index.js'

export function mountSkillsScreen() {
  const grid = document.getElementById('skills-grid')
  const title = document.getElementById('skill-info-title')
  const meta = document.getElementById('skill-info-meta')
  const desc = document.getElementById('skill-info-desc')
  if (!grid || !title || !meta || !desc) return

  const slots = Array.from(grid.querySelectorAll('.skill-slot'))
  const select = (slot) => {
    slots.forEach((item) => item.classList.remove('is-selected'))
    slot.classList.add('is-selected')
    const skill = getSkillById(slot.dataset.skillId)
    if (!skill) return
    title.textContent = `${skill.name} — Lv ${slot.dataset.skillLevel}/${slot.dataset.skillMax}`
    meta.textContent = `Môn phái: ${skill.sect} | Loại: Ngoại công | Nội lực tiêu hao: ${skill.manaCost}`
    desc.textContent = `Mô tả: ${skill.description}`
  }

  slots.forEach((slot) => slot.addEventListener('click', () => select(slot)))
  if (slots[0]) select(slots[0])
}
