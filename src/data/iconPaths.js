// Centralized icon paths for VLTK reference assets.
// Exported PNG files can be copied into public/assets/vltk/... without renaming.
export const VLTK_ICON_ROOT = '/assets/vltk';

export function itemIcon(category, filename) {
    return `${VLTK_ICON_ROOT}/items/${category}/${filename}`;
}

export function skillIcon(filename) {
    return `${VLTK_ICON_ROOT}/skills/${filename}`;
}
