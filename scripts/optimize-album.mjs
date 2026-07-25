/**
 * Chuyển ảnh trong public/images/album sang WebP (giảm dung lượng cho web).
 * Ảnh gốc được chuyển ra _album-originals/ (ngoài public, không deploy).
 *
 * Cách dùng: đặt ảnh mới (.jpg/.jpeg/.png) vào public/images/album rồi chạy:
 *   node scripts/optimize-album.mjs
 */
import sharp from 'sharp';
import { readdir, stat, mkdir, rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ALBUM = path.join(root, 'public/images/album');
const ORIGINALS = path.join(root, '_album-originals');

const isRaster = (f) => /\.(jpe?g|png)$/i.test(f);

const files = (await readdir(ALBUM)).filter(isRaster);
if (!files.length) {
  console.log('Không có ảnh .jpg/.jpeg/.png nào để tối ưu.');
  process.exit(0);
}
await mkdir(ORIGINALS, { recursive: true });

let beforeTotal = 0;
let afterTotal = 0;
const results = [];

for (const file of files) {
  const src = path.join(ALBUM, file);
  const base = file.replace(/\.(jpe?g|png)$/i, '');
  const out = path.join(ALBUM, `${base}.webp`);

  const beforeSize = (await stat(src)).size;
  await sharp(src)
    .rotate() // tôn trọng EXIF orientation
    .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80, effort: 5 })
    .toFile(out);
  const afterSize = (await stat(out)).size;

  await rename(src, path.join(ORIGINALS, file));

  beforeTotal += beforeSize;
  afterTotal += afterSize;
  results.push(
    `${base}.webp  ${(beforeSize / 1024).toFixed(0)}KB -> ${(afterSize / 1024).toFixed(0)}KB`,
  );
}

console.log(results.join('\n'));
console.log('---');
console.log(
  `TONG: ${(beforeTotal / 1024 / 1024).toFixed(1)}MB -> ${(afterTotal / 1024 / 1024).toFixed(1)}MB  (${files.length} anh)`,
);
