import { CharacterScreen } from '../screens/CharacterScreen.js'
import {
  player,
  addFreeAttributePoints,
  unequipItem,
} from '../../data/character.js'

function rerenderCharacter() {
  const root = document.getElementById('content-root')
  if (!root) return
  root.innerHTML = CharacterScreen()
  mountCharacterScreen()
}

export function mountCharacterScreen() {
  document.querySelectorAll('.attr-add-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const attribute = button.dataset.attribute
      if (!addFreeAttributePoints(attribute, 1)) return
      rerenderCharacter()
      window.dispatchEvent(new CustomEvent('game:character-changed'))
    })
  })

  document.querySelectorAll('.hero-equip-slot[data-slot-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const slot = button.dataset.slotId
      const item = player.equipment[slot]
      if (!item) return
      if (!unequipItem(slot)) return
      rerenderCharacter()
      window.dispatchEvent(new CustomEvent('game:inventory-changed'))
      window.dispatchEvent(new CustomEvent('game:character-changed'))
    })
  })
}
