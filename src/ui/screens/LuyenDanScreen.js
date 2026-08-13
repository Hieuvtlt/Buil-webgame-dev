import '../../craft.css'
import { mountLuyenDan } from '../controllers/CraftController.js'

export function LuyenDanScreen() {
  const html = `
    <div class="craft-screen game-screen">
      <h1 class="craft-title">LUYỆN ĐAN</h1>
      <div class="craft-layout">
        <section class="craft-main-panel">
          <div class="craft-machine-frame"><div class="craft-machine-placeholder">ĐAN LÔ</div></div>
          <div class="craft-fields">
            <label class="craft-field"><span>Loại đan</span><select data-craft-type><option value="">-- Chọn loại đan --</option><option value="hoimau">Hồi Khí Đan</option><option value="hoimana">Hồi Nguyên Đan</option><option value="exp">Tụ Linh Đan</option><option value="expskill">Ngộ Đạo Đan</option></select></label>
            <label class="craft-field"><span>Level</span><select data-craft-level><option value="">-- Chọn level --</option>${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">Đan dược Lv${i + 1}</option>`).join('')}</select></label>
            <label class="craft-field"><span>Phẩm cấp</span><select data-craft-quality><option value="">-- Chọn phẩm cấp --</option><option>Hạ phẩm</option><option>Trung phẩm</option><option>Thượng phẩm</option><option>Cực phẩm</option></select></label>
            <label class="craft-field"><span>Số lượng</span><input type="number" min="1" max="99" value="1"></label>
            <button class="craft-button" type="button">LUYỆN ĐAN</button>
          </div>
        </section>
        <aside class="craft-side-panel">
          <section class="craft-info-box craft-info-unified"><h3>Thông tin luyện</h3><div data-craft-info class="craft-result-placeholder">Chọn loại đan, level và phẩm cấp để xem thông tin và nguyên liệu.</div></section>
        </aside>
      </div>
    </div>`
  setTimeout(() => mountLuyenDan(document.querySelector('.craft-screen')), 0)
  return html
}

export function mountLuyenDanScreen(root) {
  mountLuyenDan(root)
}
