# Kiến trúc Game Web

## 1. Nhân vật

- Level nhân vật: 1–200.
- Mỗi lần lên Level: +5 điểm tự do.
- Điểm tự do chỉ cộng vào: Sức mạnh, Thân pháp, Sinh khí, Nội lực.
- HP = Sinh lực; MP = Nội lực.
- Ngoại công là hướng sát thương chiến đấu chính.
- Không có thuộc tính Nội công và không có điểm Võ học.

## 2. Trùng sinh

- Trùng Sinh 1: Level >= 100 + Trùng Sinh Đan I.
- Trùng Sinh 2: Level >= 120 + Trùng Sinh Đan II.
- Các mốc tiếp theo được cấu hình trong `src/data/rebirth.js`.
- Sau Trùng Sinh: Level về 1; điểm thuộc tính do Level được reset; nhận thêm 50 điểm thuộc tính vĩnh viễn; võ kỹ giữ nguyên.
- Max võ kỹ = `10 + rebirth * 10`.

## 3. Trang bị

- Max Level trang bị: 120.
- Hoàng cấp: Lv1–30, màu trắng, 0–2 thuộc tính.
- Huyền cấp: Lv31–60, màu xanh, 3–5 thuộc tính.
- Địa cấp: Lv61–90, màu vàng, 6–8 thuộc tính.
- Thiên cấp: Lv91–120, màu đỏ, 8–10 thuộc tính.
- Màu của tất cả thuộc tính đi theo màu phẩm cấp của trang bị.
- Hạ/Trung/Thượng/Cực phẩm chỉ quyết định độ mạnh thuộc tính: 0–20%, 40–50%, 60–80%, 80–120%.
- Không có thuộc tính Nội công.
- Có Nội lực vì MP của nhân vật dùng Nội lực để thi triển kỹ năng.

## 4. Võ học

Các môn phái:

Thiên Vương, Thiếu Lâm, Võ Đang, Nga Mi, Đường Môn, Ngũ Độc, Cái Bang, Hoa Sơn, Côn Lôn, Thiên Nhẫn, Tiêu Dao, Tán Tu.

- Skill dùng hệ Ngoại công.
- Bỏ thuộc tính Nội công.
- Không xóa skill chỉ vì skill gốc có thể cưỡi ngựa; chỉ bỏ thông tin/cơ chế lên ngựa xuống ngựa.
- Mỗi skill có một bản dữ liệu.
- Skill của môn phái được mở theo môn phái + Level + bí kíp.
- Tán Tu không có skill riêng và không có Bí Kíp Tán Tu; Tán Tu có thể học skill của tất cả môn phái thông qua chính bí kíp của môn phái đó.

## 5. Item

Các nhóm chính:

- Đan hồi HP: Hồi Khí Đan Lv1–Lv10.
- Đan hồi MP: Hồi Linh Đan Lv1–Lv10.
- Đan EXP nhân vật: Tụ Linh Đan Lv1–Lv10.
- Đan EXP võ kỹ: Ngộ Đạo Đan Lv1–Lv10.
- Trùng Sinh Đan I–VI.
- Tẩy Tủy Kinh: +5 điểm thuộc tính, không giới hạn sử dụng.
- Võ Lâm Mật Tịch: +10 điểm thuộc tính, không giới hạn sử dụng.
- Linh dược cho Luyện Đan.
- Quặng Sắt, Đồng, Bạc, Vàng và kim loại/hợp kim cao cấp cho Luyện Khí.
- Không tạo ngựa và item liên quan ngựa.

## 6. Cấp đan dược

Đan dược có cấp riêng 1–10. Lv1 dùng cho nhân vật Lv1–10; Lv2 dùng Lv11–20; ...; Lv9 dùng Lv81–90; Lv10 là cấp cuối, dùng cho Lv100–200.

## 7. Nhiệm vụ

Menu `Nhiệm vụ` có 2 loại nhiệm vụ và được thiết kế để có vùng cuộn riêng, không làm mất phần nội dung phía dưới khi danh sách dài.

### 7.1. Nhiệm vụ quái vật

- Người chơi được nhận tối đa **2 nhiệm vụ quái vật cùng lúc**.
- Đây là giới hạn số nhiệm vụ đang nhận, **không phải giới hạn theo ngày**: có thể nhận nhiệm vụ cả ngày và sau khi hoàn thành có thể tiếp tục nhận nhiệm vụ mới.
- Nhiệm vụ chọn từ bảng **10 nhiệm vụ đa dạng** trong `src/data/questData.js` để dễ thay tên quái, map, phần thưởng và loại nhiệm vụ.
- Quái vật được đặt ở map phù hợp với Level nhân vật; cấp quái có thể chênh lệch tối đa khoảng ±5 Level.
- Level nhân vật dưới 50: mỗi nhiệm vụ yêu cầu khoảng **30–60 quái**.
- Level nhân vật từ 50 đến 89: khoảng **60–100 quái**.
- Level 90–200: khoảng **200–300 quái**.
- Phần thưởng gồm **tiền + đan dược + linh dược**.
- Danh sách 10 nhiệm vụ được hiển thị trong vùng scroll để người chơi tự chọn.

### 7.2. Nhiệm vụ truy nã

- Mỗi lần chỉ được nhận tối đa **1 nhiệm vụ truy nã**.
- Có bảng **5 mục tiêu truy nã** để người chơi tự chọn.
- Danh sách truy nã làm mới mỗi **1 giờ**.
- Mỗi ngày hoàn thành tối đa **10 nhiệm vụ truy nã**.
- Mục tiêu là các **boss nhỏ/người bị truy nã**, được phân bổ ngẫu nhiên ở nhiều map.
- Xác suất gặp mục tiêu thấp để tạo cảm giác phải đi tìm mới gặp.
- Phần thưởng gồm **EXP + tiền + đan dược + linh dược**.

### 7.3. Trạng thái nhiệm vụ

- Trạng thái nhận nhiệm vụ hiện được lưu bằng `localStorage` với key `vltk.questState.v1` để khi chuyển menu hoặc tải lại trang không mất lựa chọn đang nhận.
- Đây là nền tảng UI/logic ban đầu; hệ thống hoàn thành nhiệm vụ, cộng EXP/tiền/item và liên kết trực tiếp với combat/map sẽ được nối vào hệ thống chiến đấu sau.

## 8. Thư mục dữ liệu

- `src/data/character.js`: trạng thái và thuộc tính nhân vật.
- `src/data/rebirth.js`: điều kiện và logic trùng sinh.
- `src/data/questData.js`: dữ liệu 10 nhiệm vụ quái vật, 5 mục tiêu truy nã và quy tắc số lượng quái.
- `src/data/items/itemSchema.js`: schema item và bảng cấp.
- `src/data/items/consumables.js`: đan dược.
- `src/data/items/alchemy.js`: linh dược.
- `src/data/items/forging.js`: quặng và hợp kim.
- `src/data/items/manuals.js`: Tẩy Tủy, Mật Tịch và bí kíp.
- `src/data/items/index.js`: registry item.
- `src/data/skills/skillSchema.js`: schema môn phái/skill.
- `src/data/skills/index.js`: registry skill hiện tại.
- `src/systems/skillSystem.js`: học và luyện võ kỹ.
- `src/systems/itemSystem.js`: sử dụng item.
- `src/ui/screens/CharacterScreen.js`: giao diện nhân vật.
- `src/ui/screens/InventoryScreen.js`: giao diện túi đồ.
- `src/ui/screens/SkillsScreen.js`: giao diện võ học.
- `src/ui/screens/NhiemVuScreen.js`: giao diện nhiệm vụ, tab Quái vật/Truy nã và các vùng scroll.
- `src/quest.css`: style riêng cho menu nhiệm vụ và thanh scroll.
- `src/ui/controllers/*`: xử lý tương tác từng màn hình.

## 9. Ghi chú dữ liệu VLTK

Kiến trúc đã sẵn sàng để nhập đầy đủ dữ liệu skill/trang bị VLTK theo từng môn phái và từng nhóm item. Dữ liệu trong `src/data/skills/index.js` hiện là bộ khởi tạo để kiểm tra logic; không coi đây là danh sách skill VLTK hoàn chỉnh.
