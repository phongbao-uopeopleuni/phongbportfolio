/**
 * Render ảnh xem trước khi chia sẻ link (og:image) từ chính nhận diện của favicon:
 * nền tối, khung bo góc, ký tự `>_` màu accent — cùng bảng màu với site.
 *
 * Data URI và SVG đều không dùng được cho og:image (Facebook, Zalo, LinkedIn
 * chỉ đọc URL tuyệt đối trỏ tới PNG/JPEG), nên phải xuất ra file PNG thật.
 *
 * Cách dùng: npm run og
 */
import sharp from 'sharp';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, 'public/og-image.png');

/* Kích thước chuẩn cho thẻ chia sẻ mạng xã hội (tỉ lệ 1.91:1). */
const W = 1200;
const H = 630;

/* Bảng màu lấy từ src/index.css để ảnh khớp với giao diện site. */
const BG = '#0b0e14';
const PANEL = '#10141c';
const LINE = '#1e2430';
const INK = '#e6eaf2';
const MUTED = '#94a0b3';
const ACCENT = '#4ade80';

const MONO = "Consolas, 'Courier New', 'DejaVu Sans Mono', monospace";
const SANS = "'Segoe UI', Inter, Arial, sans-serif";

/* Lưới mờ phía sau, gợi lại nền hero-grid của trang. */
const gridLines = () => {
  const step = 60;
  let out = '';
  for (let x = step; x < W; x += step) {
    out += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${LINE}" stroke-width="1" opacity="0.55"/>`;
  }
  for (let y = step; y < H; y += step) {
    out += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${LINE}" stroke-width="1" opacity="0.55"/>`;
  }
  return out;
};

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  ${gridLines()}

  <rect x="96" y="171" width="288" height="288" rx="54" fill="${PANEL}" stroke="${LINE}" stroke-width="2"/>
  <text x="150" y="352" font-family="${MONO}" font-size="118" font-weight="700" fill="${ACCENT}">&gt;_</text>

  <text x="452" y="270" font-family="${MONO}" font-size="30" fill="${ACCENT}">$ whoami</text>
  <text x="452" y="360" font-family="${SANS}" font-size="76" font-weight="700" fill="${INK}">Bảo Phong</text>
  <text x="452" y="416" font-family="${SANS}" font-size="30" fill="${MUTED}">Vận hành đào tạo · Toàn vẹn dữ liệu · Tự động hóa</text>
  <text x="452" y="470" font-family="${MONO}" font-size="26" fill="${MUTED}">Python · Excel · MySQL · React</text>

  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="${ACCENT}"/>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(OUT);

const { size } = await stat(OUT);
console.log(
  `Đã tạo ${path.relative(root, OUT)} — ${W}×${H}, ${(size / 1024).toFixed(1)} kB`,
);
