export function NghenghiepScreen() {
  return `
    <div class="profession-screen">
      <div class="profession-columns">
        <!-- Cột 1: Luyện đan -->
        <section class="profession-col">
          <div class="profession-title">Luyện đan</div>

          <div class="profession-image-slot">Placeholder: hình luyện đan</div>

          <div class="profession-list">
            <!-- Slot 1: chọn loại (không active) -->
            <div class="profession-small-item profession-pick">Chọn đan dược</div>

            <!-- 4 ô dưới: active -->
            <div class="profession-small-item profession-rank is-selected" data-col="dan" data-rank="ha">Hạ phẩm</div>
            <div class="profession-small-item profession-rank" data-col="dan" data-rank="trung">Trung phẩm</div>
            <div class="profession-small-item profession-rank" data-col="dan" data-rank="thuong">Thượng phẩm</div>
            <div class="profession-small-item profession-rank" data-col="dan" data-rank="cuc">Cực phẩm</div>
          </div>
        </section>

        <!-- Cột 2: Luyện khí -->
        <section class="profession-col">
          <div class="profession-title">Luyện khí</div>

          <div class="profession-image-slot">Placeholder: hình luyện khí</div>

          <div class="profession-list">
            <!-- Slot 1: chọn loại (không active) -->
            <div class="profession-small-item profession-pick">Chọn trang bị</div>

            <!-- 4 ô dưới: active -->
            <div class="profession-small-item profession-rank is-selected" data-col="khi" data-rank="ha">Hạ phẩm</div>
            <div class="profession-small-item profession-rank" data-col="khi" data-rank="trung">Trung phẩm</div>
            <div class="profession-small-item profession-rank" data-col="khi" data-rank="thuong">Thượng phẩm</div>
            <div class="profession-small-item profession-rank" data-col="khi" data-rank="cuc">Cực phẩm</div>
          </div>
        </section>

        <!-- Cột 3: Thông tin sản phẩm -->
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