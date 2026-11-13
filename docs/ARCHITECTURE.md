# Kiến trúc dự án

Tài liệu này mô tả trạng thái thực tế của mã nguồn sau đợt thiết kế lại
(nhánh `redesign/card-layout`). Phần ràng buộc dành cho người và agent sửa code
nằm ở [`AGENTS.md`](../AGENTS.md) ở gốc repo.

---

## 1. Tổng quan

| Hạng mục | Giá trị |
|---|---|
| Khung | React 19, TypeScript, Vite 6 |
| CSS | Tailwind CSS v4 qua `@tailwindcss/vite` (không có `tailwind.config.js`) |
| Định tuyến | `react-router-dom` 7, `BrowserRouter` |
| Deploy | GitHub Pages, GitHub Actions, base `/phongbportfolio/` |
| Ngôn ngữ | Song ngữ Việt – Anh, mặc định tiếng Việt |
| Giao diện | Sáng và tối, lưu lựa chọn vào `localStorage` |

---

## 2. Hệ thiết kế

### Token màu

Khai báo trong `src/index.css`. Tên token giữ nguyên theo Tailwind để các
utility như `bg-panel`, `text-ink`, `border-line` tiếp tục hoạt động.

| Token | Vai trò | Sáng | Tối |
|---|---|---|---|
| `--color-surface` | Nền trang | `#F2F3F5` | `#0E1013` |
| `--color-panel` | Thẻ section | `#FAFAFB` | `#16191D` |
| `--color-raised` | Thẻ bên trong, pill nav đang chọn | `#FFFFFF` | `#1E2227` |
| `--color-line` | Viền | `#E3E5E8` | `#2A2F36` |
| `--color-ink` | Chữ chính | `#111317` | `#F1F3F5` |
| `--color-muted` | Chữ phụ | `#5A6270` | `#A0A8B3` |
| `--color-accent` | Nút chính, trạng thái chọn, vòng focus | `#C2410C` | `#FB923C` |
| `--color-accent-ink` | Chữ trên nền nhấn | `#FFFFFF` | `#111317` |

Độ tương phản đã đo: ink/panel **17.8:1** (sáng) và **15.9:1** (tối);
muted/panel **5.9:1** và **7.3:1**; accent-ink/accent **5.2:1** và **8.2:1**.

### Bán kính và bóng

`--radius-section: 28px` (20px dưới 768px), `--radius-card: 20px`,
`--radius-media: 14px`, pill `999px`. Bóng `--shadow-card` chỉ dùng ở giao diện
sáng; giao diện tối đặt `none` vì viền đã đủ tách lớp.

### Chữ

Gốc `html { font-size: 100% }`, mọi kích thước tính theo 16px.

| Vai trò | Font | Cỡ | Đậm / giãn |
|---|---|---|---|
| H1 hero | Inter | `clamp(40px, 6vw, 64px)` | 700, −0.02em |
| H2 section | Inter | `clamp(28px, 3.5vw, 40px)` | 700, −0.015em |
| H3 thẻ | Inter | 20px | 600 |
| Lead | Inter | 20px (18px mobile) | 400 |
| Thân | Inter | 16px, dòng 1.6 | 400 |
| Nhãn / tag | JetBrains Mono | 12px (tag 11px), in hoa | 500, 0.12em |

### Hoa văn nền

Hai lớp `position: fixed`, `z-index: -1`, `pointer-events: none`:
`body::before` vẽ lưới chấm 28px lồng trong lưới kẻ 112px, nhạt dần xuống dưới
bằng mask; `body::after` vẽ hai quầng radial màu nhấn ở góc trên.

Token riêng theo theme: `--pattern-dot`, `--pattern-line`, `--pattern-glow`.

**Hoa văn chỉ nằm trên nền trang, không bao giờ sau chữ.** Mọi thẻ đều đục màu
`--color-panel` nên các số đo tương phản ở trên không bị ảnh hưởng. Đoạn chữ duy
nhất nằm trực tiếp trên nền có hoa văn là dòng footer, đo được **7.94:1** ở nền
tối và **5.54:1** ở nền sáng.

---

## 3. Bố cục trang chủ

Khung nội dung rộng tối đa 1120px, lề hai bên 16px. Các thẻ section cách nhau
32px (24px trên mobile).

| # | Mục | `id` | Nội dung |
|---|---|---|---|
| — | Hero | `home` | Hai cột 7:5, ảnh chân dung 4:5, ba số liệu |
| 01 | Dự án | `projects` | 4 thẻ ngang, ảnh 40% bên trái |
| 02 | Website & sản phẩm | `works` | Lưới 3 cột, thẻ chữ, cộng thẻ Canva mở lightbox |
| 03 | Kinh nghiệm & học vấn | `timeline` | Dòng thời gian + học vấn + thành tích |
| 04 | Album | `album` | Dải ảnh chạy ngang, dẫn sang `/album` |
| 05 | Liên hệ | `contact` | Hai thẻ chữ + hàng hành động |

Header là thanh pill dính mép, nền kính mờ 80% kèm `backdrop-filter: blur(12px)`,
có scroll-spy làm sáng mục đang xem. Dưới 768px nav thu thành nút menu mở sheet.

Sheet tự đóng khi cửa sổ nới qua 768px — nếu không, nút đóng bị CSS ẩn và sheet
sẽ kẹt lại không tắt được.

### Chính sách icon

Chỉ hai icon trên trang chủ, header, footer và trang album: nút đổi giao diện
(mặt trời / mặt trăng) và nút menu mobile. Các mũi tên `↗` và `→` là ký tự chữ,
không phải icon. Bên trong khu vực showcase vẫn dùng icon bình thường.

---

## 4. Tách chunk

| Chunk | Khi nào tải |
|---|---|
| `index` | Trang chủ |
| `AlbumPage` | Vào `/album` |
| `ShowcaseRoutes` | Vào `/showcase` |
| `AssessmentIntegrityLab`, `CpuSchedulingLab` | Mở trang chi tiết lab tương ứng |

Người vào trang chủ không tải một dòng code nào của album hay showcase. Vì vậy
`App.tsx` **không được** import `data/registry.ts`; cờ bật/tắt tách riêng ở
`features/showcase/enabled.ts`.

---

## 5. Ảnh

| Loại | Vị trí | Kích thước | Dùng ở đâu |
|---|---|---|---|
| Chân dung hero | `src/assets/hero/profile.webp` | 1254², 140 kB | Hero |
| Ảnh gốc hero | `public/images/hero/abc.png` | 1254², 2,8 MB | Nguồn mã hoá lại |
| Album gốc | `public/images/album/` | ~240 kB/ảnh | Lightbox |
| Album thu nhỏ | `public/images/album/thumbs/` | 321×240, ~16 kB/ảnh | Dải chạy trang chủ |
| Ảnh bìa lab | `public/images/projects/labs/` | WebP | Thẻ mục 01 |

Dải chạy dùng 16 ảnh thu nhỏ, tốn khoảng 253 kB thay vì 3,8 MB nếu dùng ảnh gốc.

---

## 6. Font

Tự host trong `src/assets/fonts/`, khai báo ở `src/fonts.css` (sinh bằng
`npm run fonts`). Bốn file, tổng 93,6 kB: Inter và JetBrains Mono, mỗi font hai
subset latin và vietnamese.

Google phục vụ font biến thiên nên một file dùng chung cho cả bốn độ đậm —
script khử trùng lặp theo nội dung, nếu không sẽ ghi 16 bản sao y hệt.

Lý do bỏ Google Fonts: khi trình duyệt không tải được subset tiếng Việt, chữ có
dấu rơi về font hệ thống thiếu glyph dải `U+1EA0–1EF9` và hiện thành `?` cùng
ký tự notdef.

---

## 7. Deploy

GitHub Actions build với `GITHUB_PAGES=true` rồi đẩy `dist/` lên Pages.
`vite.config.ts` có plugin `spa-404-fallback` copy `index.html` thành `404.html`,
vì Pages không có SPA fallback — thiếu nó thì mọi đường dẫn con sẽ 404 khi tải
trực tiếp hoặc bấm F5.

Thẻ `og:image` dùng URL tuyệt đối tới PNG 1200×630 (`npm run og`). Crawler mạng
xã hội không đọc data URI, không đọc SVG và không ghép đường dẫn tương đối.
Nếu đổi sang tên miền riêng thì phải sửa `og:url`, `og:image`, `twitter:image`
trong `index.html` và `base` trong `vite.config.ts`.

---

## 8. Sai khác so với brief thiết kế

`docs/redesign/PROMPT.md` là brief đã duyệt. Bản dựng thực tế lệch ba chỗ, đều
do người dùng yêu cầu sau khi xem kết quả:

1. **Hoa văn nền.** Brief §1 yêu cầu gỡ lưới nền hero. Thực tế đã thêm lại lưới
   chấm và quầng sáng ở mức rất nhẹ, đặt trên nền trang.
2. **Mục Album ở trang chủ.** Brief §2 yêu cầu chuyển marquee album sang
   `/album`. Thực tế trang chủ có thêm mục 04 với dải ảnh chạy; Liên hệ dời
   thành 05.
3. **Chứng chỉ.** Thêm "Tin học văn phòng" vào dòng chứng chỉ.

Ai dùng lại brief đó làm chuẩn nghiệm thu cần biết ba điểm này.

---

## 9. Việc còn treo

1. Tương phản giao diện sáng ở trang showcase: 26 phần tử chữ đạt 3.4:1,
   cần 4.5:1. Hướng sửa: chuyển panel kính bị ảnh hưởng sang nền đục.
2. Nghiệm thu mục 10 của brief chưa chạy đủ.
3. Dọn dẹp: gỡ `motion` khỏi `package.json`, vài khoá i18n thừa,
   `src/assets/hero/profile.jpg` cũ.
4. Chuyển `public/images/hero/abc.png` sang `_hero-originals/`.

---

## 10. Tài liệu khác

- [`AGENTS.md`](../AGENTS.md) — ràng buộc bắt buộc khi sửa code
- [`docs/redesign/PROMPT.md`](redesign/PROMPT.md) — brief thiết kế đã duyệt
- [`docs/redesign/reference.html`](redesign/reference.html) — bản mẫu tĩnh
- [`docs/assessment-data-integrity-lab/`](assessment-data-integrity-lab/) —
  tài liệu lab khảo thí
