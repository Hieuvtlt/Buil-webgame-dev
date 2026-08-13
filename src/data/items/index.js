import { weapons } from './weapons.js'
import { armors } from './armor.js'
import { consumables } from './consumables.js'
import { materials } from './materials.js'
import { alchemyMaterials } from './alchemy.js'
import { forgingMaterials } from './forging.js'
import { manuals } from './manuals.js'

export const items = [
  ...weapons,
  ...armors,
  ...consumables,
  ...materials,
  ...alchemyMaterials,
  ...forgingMaterials,
  ...manuals,
]

export const itemById = new Map(items.map((item) => [item.id, item]))

export function getItemById(id) {
  return itemById.get(id) ?? null
}
