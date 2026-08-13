export function LuyenDanScreen() {
  return `
    <div class="profession-screen">
      <div class="profession-columns-2">
        <!-- Cột trái: Luyện đan -->
        <section class="profession-col">
          <div class="profession-title">Luyện đan</div>

          <div class="profession-image-slot">Placeholder: hình luyện đan</div>

          <div class="profession-list">
            <div class="profession-small-item profession-pick">Chọn đan dược</div>

            <div class="profession-small-item profession-rank">Cấp độ</div>
            <div class="profession-small-item profession-rank">Phẩm cấp</div>
            <div class="profession-small-item profession-rank">Số lượng</div>
            <div class="profession-small-item profession-rank">Bắt đầu luyện</div>
          </div>
        </section>

        <!-- Cột phải: Thông tin sản phẩm -->
        <section class="profession-info-col">
          <div class="profession-title">Thông tin sản phẩm</div>

          <div class="product-image-slot">Placeholder: ảnh sản phẩm</div>

          <div class="product-info">
            <div class="product-line"><b>Tên:</b> -</div>
            <div class="product-line"><b>Phẩm cấp:</b> -</div>
            <div class="product-line"><b>Yêu cầu:</b> -</div>
            <div class="product-line"><b>Mô tả:</b> -</div>
          </div>
        </section>
      </div>
    </div>
  `
}