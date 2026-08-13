import { player, getMaxSkillLevel } from '../../data/character.js'
import { getSkillsForSect, SECT_NAMES } from '../../data/skills/index.js'

export function SkillsScreen() {
  const skills = getSkillsForSect(player.sect, player.skills)
  const maxSkillLevel = getMaxSkillLevel()
  const isTanTu = player.sect === 'tanTu'

  return `
    <div class="skills-screen game-screen">
      <h3 class="panel-title-sm">Võ học</h3>
      <div class="skill-summary">
        <span>Môn phái: <b>${SECT_NAMES[player.sect]}</b></span>
        <span>Max cấp võ kỹ hiện tại: <b>${maxSkillLevel}</b></span>
        <span>${isTanTu ? 'Tán Tu: chưa học bí kíp nào.' : 'Môn phái: skill của phái được mở theo hệ phái; đạt Level và học bí kíp tương ứng để nâng cấp.'}</span>
      </div>

      <div class="skills-layout">
        <div class="skills-left">
          <div class="skills-grid" id="skills-grid">
            ${skills.length ? skills.map((skill) => {
              const current = player.skills[skill.id] ?? 0
              return `
                <button class="skill-slot" type="button"
                  data-skill-id="${skill.id}"
                  data-skill-name="${skill.name}"
                  data-skill-level="${current}"
                  data-skill-max="${maxSkillLevel}">
                  <img class="skill-icon" src="${skill.icon}" alt="" />
                  <span class="skill-slot-text">
                    <b>${skill.name}</b>
                    <span>Lv ${current}/${maxSkillLevel}</span>
                  </span>
                </button>
              `
            }).join('') : `
              <div class="empty-state">
                ${isTanTu ? 'Tán Tu chưa có võ kỹ. Hãy học bí kíp của môn phái khác để mở võ kỹ.' : 'Chưa có võ kỹ trong dữ liệu.'}
              </div>
            `}
          </div>
        </div>

        <div class="skills-right">
          <div class="skill-info-box" id="skill-info-box">
            <div class="skill-info-title" id="skill-info-title">Chọn võ kỹ</div>
            <div class="skill-info-meta" id="skill-info-meta">Môn phái: - | Loại: Ngoại công</div>
            <div class="skill-info-desc" id="skill-info-desc">Võ kỹ không có hệ Nội công. Nội lực chỉ là tài nguyên MP để thi triển.</div>
          </div>
        </div>
      </div>
    </div>
  `
}
