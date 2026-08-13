export function ThuongHoiScreen() {
  const totalPages = 5
  const rowsPerPage = 11
  return `
    <div class="merchant-screen">
      <div class="merchant-tabs">
        <button class="merchant-tab active" type="button" data-tab="mua">Mua</button>
        <button class="merchant-tab" type="button" data-tab="ban">Bán</button>
      </div>
      <div class="merchant-layout">
        <div class="merchant-table-wrap">
          <div class="merchant-table" role="table">
            <div class="m-row m-header"><div class="m-cell">Tên sản phẩm</div><div class="m-cell">Cấp độ</div><div class="m-cell">Phẩm cấp</div><div class="m-cell">Giá</div></div>
            ${Array.from({ length: rowsPerPage }, (_, i) => `
              <div class="m-row m-data" data-row="${i + 1}">
                <div class="m-cell">Item ${i + 1}</div><div class="m-cell">-</div><div class="m-cell">-</div><div class="m-cell">-</div>
              </div>`).join('')}
          </div>
        </div>
        <div class="merchant-info">
          <div class="merchant-info-title">Thông tin</div>
          <div class="merchant-info-line"><b>Tên:</b> -</div>
          <div class="merchant-info-line"><b>Loại:</b> -</div>
          <div class="merchant-info-line"><b>Phẩm cấp:</b> -</div>
          <div class="merchant-info-line"><b>Giá:</b> -</div>
          <div class="merchant-info-desc">Placeholder mô tả sản phẩm</div>
        </div>
      </div>
      <div class="merchant-pagination" id="merchant-pagination">
        ${Array.from({ length: totalPages }, (_, p) => `<button class="${p === 0 ? 'merchant-page-btn active' : 'merchant-page-btn'}" type="button" data-page="${p + 1}">${p === 0 ? 'Trang 1' : p + 1}</button>`).join('')}
      </div>
    </div>`
}
