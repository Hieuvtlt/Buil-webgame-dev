# Nhập icon VLTK vào Game Web

## Nguồn tham khảo

Bộ dữ liệu VLTK được đặt local tại:

```text
D:\webgame\thamkhao\
```

Các thư mục cần quan tâm:

```text
thamkhao\spr\item\
thamkhao\spr\skill\
thamkhao\spr\skillnew\
```

## Quan trọng

File `.spr` là resource của client VLTK và trình duyệt không thể dùng trực tiếp làm `<img>`.
Cần export SPR thành PNG trước.

Công cụ JxSprViewer/JxSprEditor có chức năng xem SPR và export PNG. Sau khi export, đặt ảnh PNG vào:

```text
public\assets\vltk\items\
public\assets\vltk\skills\
```

## Script hỗ trợ

Có script:

```text
powershell -ExecutionPolicy Bypass -File .\tools\import-vltk-assets.ps1
```

Script sẽ tìm các PNG/WEBP đã export trong `thamkhao\spr\item`, `skill`, `skillnew` và copy sang `public\assets\vltk`.

## Quy tắc sử dụng

- Không đưa toàn bộ thư mục `thamkhao` 222 MB vào repository.
- Chỉ đưa các ảnh đã export và thực sự sử dụng vào game.
- Item dùng `public/assets/vltk/items/...`.
- Skill dùng `public/assets/vltk/skills/...`.
- Nếu chưa có ảnh VLTK tương ứng, hệ thống vẫn dùng icon fallback hiện tại.

## Quy trình

1. Giữ nguyên `D:\webgame\thamkhao`.
2. Mở SPR item/skill bằng công cụ SPR.
3. Export frame/icon cần dùng thành PNG.
4. Chạy script import.
5. Gắn filename PNG vào trường `icon` của item/skill tương ứng.
6. Test bằng `npm run dev`.
