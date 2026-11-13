# PhongB Portfolio

Portfolio cá nhân song ngữ Việt – Anh của Bảo Phong, hướng Educational
Technology & Assessment. React 19 + TypeScript + Vite 6 + Tailwind CSS v4.

Bản chạy thật: <https://phongbao-uopeopleuni.github.io/phongbportfolio/>

## Chạy tại máy

Cần Node.js 20 trở lên.

```bash
npm install
npm run dev          # http://localhost:3000
```

## Các lệnh

| Lệnh | Việc |
|---|---|
| `npm run dev` | Chạy máy chủ phát triển ở cổng 3000 |
| `npm run lint` | Kiểm kiểu bằng `tsc --noEmit` |
| `npm run test:assessment` | Test thuần Node cho lab khảo thí |
| `npm run build` | Build bản phát hành |
| `GITHUB_PAGES=true npm run build` | Build đúng như CI (base `/phongbportfolio/`) |
| `npm run fonts` | Tải lại font tự host |
| `npm run og` | Sinh ảnh xem trước khi chia sẻ link |
| `npm run optimize:album` | Tối ưu ảnh album sang WebP |
| `npm run optimize:canva` | Tối ưu ảnh thiết kế Canva |

## Nội dung chính

| Đường dẫn | Nội dung |
|---|---|
| `/` | Hero, Dự án, Website, Kinh nghiệm, Album, Liên hệ |
| `/album` | 30 ảnh công tác kèm lightbox |
| `/showcase` | Hai lab giáo dục tương tác |

Trang có giao diện sáng và tối, lưu lựa chọn vào trình duyệt, và chuyển được
giữa tiếng Việt và tiếng Anh.

## Tài liệu

- [`AGENTS.md`](AGENTS.md) — ràng buộc bắt buộc khi sửa mã nguồn. **Đọc trước
  khi thay đổi bất cứ gì.**
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — hệ thiết kế, bố cục, tách
  chunk, ảnh, font, deploy
- [`docs/redesign/`](docs/redesign/) — brief thiết kế và bản mẫu tĩnh
- [`docs/assessment-data-integrity-lab/`](docs/assessment-data-integrity-lab/) —
  tài liệu lab khảo thí

## Deploy

Đẩy lên nhánh `main` sẽ kích hoạt GitHub Actions build và deploy lên GitHub
Pages. Nội dung `public/` được copy nguyên vào bản phát hành, nên đừng để file
gốc dung lượng lớn ở đó.
