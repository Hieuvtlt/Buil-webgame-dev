export function mountMerchantScreen() {
  const root = document.getElementById('content-root')
  if (!root) return

  const tabs = Array.from(root.querySelectorAll('[data-tab]'))
  const rows = Array.from(root.querySelectorAll('.m-row.m-data, [data-row-index], .m-data'))
  const pagination = root.querySelector('#merchant-pagination')

  const setTab = (tab) => {
    tabs.forEach((item) => item.classList.remove('merchant-tab-active', 'active'))
    tab.classList.add('merchant-tab-active', 'active')
    rows.forEach((row) => row.classList.remove('is-selected'))
    rows[0]?.classList.add('is-selected')
  }

  tabs.forEach((tab) => tab.addEventListener('click', () => setTab(tab)))
  if (tabs[0]) setTab(tabs[0])

  rows.forEach((row) => {
    row.addEventListener('click', () => {
      rows.forEach((item) => item.classList.remove('is-selected'))
      row.classList.add('is-selected')
      const cells = row.querySelectorAll('.m-cell')
      const info = root.querySelector('.merchant-info')
      if (!info) return
      const lines = info.querySelectorAll('.merchant-info-line')
      if (lines[0]) lines[0].innerHTML = `<b>Tên:</b> ${cells[0]?.textContent?.trim() || '-'}`
      if (lines[1]) lines[1].innerHTML = `<b>Loại:</b> ${cells[1]?.textContent?.trim() || '-'}`
      if (lines[2]) lines[2].innerHTML = `<b>Phẩm cấp:</b> ${cells[2]?.textContent?.trim() || '-'}`
      if (lines[3]) lines[3].innerHTML = `<b>Giá:</b> ${cells[3]?.textContent?.trim() || '-'}`
    })
  })

  pagination?.querySelectorAll('.merchant-page-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      pagination.querySelectorAll('.merchant-page-btn').forEach((item) => item.classList.remove('active'))
      btn.classList.add('active')
      rows.forEach((row) => row.classList.remove('is-selected'))
      rows[0]?.classList.add('is-selected')
    })
  })
}
