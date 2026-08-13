// Optional mapping from game item IDs to exported VLTK PNG filenames.
// Keep original exported filenames; no bulk renaming is required.
export const itemIconMap = {
    // Example:
    // hoi_khi_dan_lv1: '/assets/vltk/items/danduoc/07325EB5_0000.png',
};

export function getItemIcon(item) {
    return item?.icon || itemIconMap[item?.id] || '/assets/icons/potion.svg';
}
