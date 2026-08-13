import { getItemById } from '../data/items/index.js'
import { player, useAttributeBook } from '../data/character.js'

export function canUseItem(itemId) {
  const item = getItemById(itemId)
  if (!item) return false
  const required = item.requirements.level ?? 1
  return player.level >= required
}

export function useItem(itemId) {
  const item = getItemById(itemId)
  if (!item || !canUseItem(itemId)) return false

  if (item.category === 'attribute_book') {
    return useAttributeBook(item.effect.attributePoints)
  }

  return true
}

export function getItemUseDescription(itemId) {
  const item = getItemById(itemId)
  return item?.description ?? ''
}
