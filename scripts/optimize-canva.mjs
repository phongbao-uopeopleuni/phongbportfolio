/**
 * Convert Canva publication PNG/JPEG files to web-friendly WebP assets.
 * Originals are preserved outside public/ so they are not included in deploys.
 *
 * Usage: place new images in public/images/projects/canvathietke, then run:
 *   npm run optimize:canva
 */
import sharp from 'sharp';
import {mkdir, readdir, rename, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const canvaDirectory = path.join(
  root,
  'public',
  'images',
  'projects',
  'canvathietke',
);
const originalsDirectory = path.join(root, '_canvathietke-originals');
const isRaster = (file) => /\.(jpe?g|png)$/i.test(file);

const files = (await readdir(canvaDirectory))
  .filter(isRaster)
  .sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10));

if (!files.length) {
  console.log('No new Canva PNG/JPEG files to optimize.');
  process.exit(0);
}

await mkdir(originalsDirectory, {recursive: true});

let beforeTotal = 0;
let afterTotal = 0;

for (const file of files) {
  const source = path.join(canvaDirectory, file);
  const base = file.replace(/\.(jpe?g|png)$/i, '');
  const output = path.join(canvaDirectory, `${base}.webp`);
  const beforeSize = (await stat(source)).size;

  await sharp(source)
    .rotate()
    .resize(2000, 2000, {fit: 'inside', withoutEnlargement: true})
    .webp({quality: 82, effort: 5})
    .toFile(output);

  const afterSize = (await stat(output)).size;
  await rename(source, path.join(originalsDirectory, file));

  beforeTotal += beforeSize;
  afterTotal += afterSize;
  console.log(
    `${base}.webp: ${(beforeSize / 1024 / 1024).toFixed(1)} MB -> ${(afterSize / 1024).toFixed(0)} KB`,
  );
}

console.log(
  `Total: ${(beforeTotal / 1024 / 1024).toFixed(1)} MB -> ${(afterTotal / 1024 / 1024).toFixed(1)} MB`,
);
