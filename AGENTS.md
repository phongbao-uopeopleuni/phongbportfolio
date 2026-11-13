# AGENTS.md — hướng dẫn cho agent làm việc trên repo này

Portfolio cá nhân của Bảo Phong. React 19 + TypeScript + Vite 6 + Tailwind CSS v4,
deploy tĩnh lên GitHub Pages.

Đọc hết phần **Ràng buộc bắt buộc** trước khi sửa bất cứ gì. Những điều ở đó không
phải sở thích — mỗi mục là kết quả của một lỗi đã thực sự xảy ra trong dự án này.

---

## Chạy và kiểm tra

```bash
npm run dev              # cổng 3000
npm run lint             # tsc --noEmit
npm run test:assessment  # test thuần Node cho lab khảo thí
npm run build            # build thường
GITHUB_PAGES=true npm run build   # build đúng như CI
```

Script tiện ích: `npm run fonts` (tải lại font tự host), `npm run og`
(sinh ảnh og:image), `npm run optimize:album`, `npm run optimize:canva`.

---

## Ràng buộc bắt buộc

### 1. Mọi đường dẫn tới `public/` phải đi qua `publicUrl()`

Site chạy ở `https://…github.io/phongbportfolio/`, tức Vite `base` là
`/phongbportfolio/` khi `GITHUB_PAGES=true`. Một đường dẫn tuyệt đối như
`/images/x.webp` sẽ **vỡ toàn bộ ảnh trên bản deploy** dù chạy local vẫn tốt.

`publicUrl()` xuất từ `src/App.tsx`. Ảnh import qua `src/assets/` thì Vite tự
xử lý, không cần hàm này.

### 2. Font tự host — tuyệt đối không thêm Google Fonts

`src/fonts.css` + `src/assets/fonts/` giữ Inter và JetBrains Mono (subset
latin + vietnamese). Trước đây site nạp từ Google Fonts; khi trình duyệt người
dùng không tải được subset tiếng Việt thì toàn bộ dấu tiếng Việt biến thành
`?` và ký tự notdef.

Font đặt trong `src/assets` chứ không phải `public/` để Vite viết lại đường dẫn
theo base. Sinh lại bằng `npm run fonts` — script đã khử trùng lặp, vì Google
phục vụ font biến thiên nên một file dùng chung cho mọi độ đậm.

### 3. Giữ nguyên TÊN token Tailwind, chỉ đổi giá trị

`src/index.css` định nghĩa `--color-surface`, `--color-panel`, `--color-raised`,
`--color-line`, `--color-ink`, `--color-muted`, `--color-accent`,
`--color-accent-ink`. Đổi tên sẽ phải sửa class ở hàng trăm chỗ.

Giao diện sáng là mặc định trong `@theme`; giao diện tối ghi đè dưới
`[data-theme='dark']`. Script trong `index.html` đặt `data-theme` **trước khi vẽ
lần đầu** để không nháy sáng — đừng chuyển logic đó vào React.

Độ tương phản đã đo: ink/panel 17.8:1 (sáng) và 15.9:1 (tối); muted/panel 5.9:1
và 7.3:1; accent-ink/accent 5.2:1 và 8.2:1. **Đo lại nếu đổi bất kỳ giá trị nào.**

### 4. Hoa văn nền chỉ nằm trên nền trang, không bao giờ sau chữ

`body::before` (lưới chấm + kẻ) và `body::after` (quầng màu nhấn) nằm ở
`z-index: -1`. Mọi thẻ đều đục màu `--color-panel`, nhờ đó các số đo tương phản
ở trên không bị ảnh hưởng. Đặt hoa văn sau chữ thì phải đo lại toàn bộ.

### 5. `App.tsx` không được import `data/registry.ts`

Registry chứa hàng chục kB nội dung dự án giáo dục. Import vào `App.tsx` sẽ kéo
nó vào chunk trang chủ và phá mục tiêu tách chunk. Cờ bật/tắt nằm riêng ở
`src/features/showcase/enabled.ts` chính vì lý do này.

### 6. Mọi chuỗi hiển thị đi qua `src/i18n.tsx`, đủ cả `vi` và `en`

`const vi: typeof en` khiến TypeScript báo lỗi ngay khi một ngôn ngữ thiếu khoá.
Dữ liệu riêng của showcase nằm ở `src/features/showcase/i18n/strings.ts` và
nhúng song ngữ trong từng bản ghi của registry.

### 7. Ảnh: dùng đúng bản, đừng nén lại từ bản đã nén

- Album: ảnh gốc ở `public/images/album/` (~240 kB/ảnh) dùng cho lightbox;
  bản thu nhỏ ở `public/images/album/thumbs/` (~16 kB/ảnh) dùng cho dải chạy
  ở trang chủ.
- Chân dung hero: `src/assets/hero/profile.webp`, mã hoá từ bản gốc không mất
  dữ liệu `public/images/hero/abc.png`. Nén lại từ bản JPEG đã hỏng sẽ không
  lấy lại được chi tiết đã mất.

### 8. Không sửa phần lõi của lab

`src/features/showcase/demos/**`, `data/registry.ts` và các file test là vùng
cấm trừ khi được yêu cầu rõ. Trang showcase chỉ thừa hưởng token màu.

### 9. Mã hoá tệp và xuống dòng

Toàn bộ file là UTF-8. Repo đặt `core.autocrlf=true` nhưng **không có**
`.gitattributes`, nên `git status` hay báo file "đã sửa" trong khi nội dung
giống hệt — kiểm bằng `git diff --ignore-all-space` trước khi kết luận.

Đã từng có sự cố 36 ký tự tiếng Việt bị thay bằng `?` và U+FFFD ngay trong mã
nguồn. Quét bằng Python (`text.count('�')`), đừng dùng
`grep -c $'�'` — shell không nở escape đó và sẽ báo sạch nhầm.

---

## Bản đồ mã nguồn

```
index.html              script đặt theme trước khi vẽ; thẻ og/twitter
src/
  main.tsx              BrowserRouter basename = import.meta.env.BASE_URL
  App.tsx               toàn bộ trang chủ + router + publicUrl()
  i18n.tsx              mọi chuỗi hiển thị, hai ngôn ngữ
  index.css             token, theme, hoa văn nền, marquee, skip-link
  fonts.css             @font-face tự host (sinh tự động)
  components/Lightbox.tsx   <dialog> dùng chung cho album và Canva
  pages/AlbumPage.tsx   route /album, nạp lazy
  features/showcase/    khu vực lab, tách chunk riêng
scripts/                fetch-fonts, make-og-image, optimize-album, optimize-canva
docs/                   tài liệu (xem docs/ARCHITECTURE.md)
```

### Route

| Đường dẫn | Nội dung |
|---|---|
| `/` | Trang chủ: Hero, 01 Dự án, 02 Website, 03 Kinh nghiệm, 04 Album, 05 Liên hệ |
| `/album` | Lưới 30 ảnh + lightbox (lazy) |
| `/showcase`, `/showcase/:slug` | Lab giáo dục (lazy) |
| khác | chuyển hướng về `/` |

GitHub Pages không có SPA fallback, nên `vite.config.ts` có plugin copy
`index.html` thành `404.html` lúc build. **Đừng gỡ plugin đó** — gỡ là mọi
đường dẫn con sẽ 404 khi tải trực tiếp hoặc bấm F5.

---

## Quy ước commit

Tiếng Việt **không dấu**, dòng đầu nêu việc, thân nêu lý do và bằng chứng kiểm
chứng. Ví dụ: `Sua loi: menu mobile ket lai khi nguoi dung noi rong cua so`.

Không push lên `main` trừ khi được yêu cầu rõ — push vào `main` kích hoạt
workflow deploy GitHub Pages.

---

## Việc còn treo

1. **Tương phản giao diện sáng ở trang showcase.** 26 phần tử chữ chỉ đạt
   3.4:1 (cần 4.5:1) khi bật giao diện sáng, do `glass.css` vốn chỉnh cho nền
   tối. Hướng sửa đã thống nhất: chuyển các panel kính bị ảnh hưởng sang nền
   đục `--color-panel` ở giao diện sáng, không đổi bố cục.
2. **Nghiệm thu mục 10 của `docs/redesign/PROMPT.md`** chưa chạy đủ: đối chiếu
   360/768/1280px ở hai theme và hai ngôn ngữ, kiểm bàn phím, kiểm vùng chạm,
   tải trực tiếp `/phongbportfolio/album` trên bản Pages.
3. **Dọn dẹp:** `motion` không còn nơi nào import, gỡ được khỏi `package.json`;
   vài khoá i18n thừa (`album.kicker`, `canvaAlbum.kicker`,
   `canvaAlbum.itemsLabel`); `src/assets/hero/profile.jpg` cũ không còn dùng.
4. **`public/images/hero/abc.png`** (2,8 MB, ảnh gốc) đang nằm trong `public/`
   nên bị copy vào `dist/` mỗi lần build cục bộ. Nên chuyển sang
   `_hero-originals/` cho đúng nếp đã có với album và Canva.
