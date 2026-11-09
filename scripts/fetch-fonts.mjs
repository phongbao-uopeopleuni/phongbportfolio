import {writeFile, mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const OUT = 'src/assets/fonts';
const KEEP = new Set(['latin', 'vietnamese']);
const families = [
  {name: 'Inter', q: 'Inter:wght@400;500;600;700', slug: 'inter'},
  {name: 'JetBrains Mono', q: 'JetBrains+Mono:wght@400;500;600;700', slug: 'jetbrains-mono'},
];

await mkdir(OUT, {recursive: true});
const faces = [];
const byHash = new Map(); // noi dung -> ten file da ghi
let bytesWritten = 0;

for (const fam of families) {
  const url = `https://fonts.googleapis.com/css2?family=${fam.q}&display=swap`;
  const css = await fetch(url, {headers: {'User-Agent': UA}}).then((r) => r.text());

  for (const b of css.split('/*').slice(1)) {
    const subset = b.slice(0, b.indexOf('*/')).trim();
    if (!KEEP.has(subset)) continue;
    const weight = (b.match(/font-weight:\s*(\d+)/) || [])[1];
    const range = (b.match(/unicode-range:\s*([^;]+);/) || [])[1];
    const src = (b.match(/url\((https:[^)]+\.woff2)\)/) || [])[1];
    if (!weight || !range || !src) continue;

    const buf = Buffer.from(await fetch(src, {headers: {'User-Agent': UA}}).then((r) => r.arrayBuffer()));
    const hash = createHash('md5').update(buf).digest('hex');

    // Google phuc vu font bien thien: cung mot file dung cho moi do dam.
    // Khu trung lap theo noi dung, neu khong se ghi 4 ban sao y het nhau.
    let file = byHash.get(hash);
    if (!file) {
      file = `${fam.slug}-${subset}.woff2`;
      await writeFile(path.join(OUT, file), buf);
      byHash.set(hash, file);
      bytesWritten += buf.length;
    }
    faces.push({family: fam.name, weight, range: range.trim(), file});
  }
}

const css = `/* Font tu host — sinh boi scripts/fetch-fonts.mjs, dung \`npm run fonts\`.
 *
 * Vi sao bo Google Fonts: neu trinh duyet khong tai duoc file subset tieng Viet
 * (mang chan, CDN cham hoac bi loc), no roi ve font he thong thieu glyph
 * U+1EA0-1EF9 va ve ra ky tu notdef — chu tieng Viet hien thanh "?" va "\uFFFD".
 * Tu host thi font di kem site, khong con phu thuoc ben ngoai.
 *
 * File nam trong src/assets nen Vite tu viet lai duong dan theo base;
 * neu de trong public/ thi link tuyet doi se vo tren GitHub Pages.
 *
 * Google phuc vu font bien thien: mot file dung chung cho ca 4 do dam, nen
 * cac @font-face duoi day tro cung mot file va chi khac font-weight.
 */
${faces.map((f) => `@font-face {
  font-family: '${f.family}';
  font-style: normal;
  font-weight: ${f.weight};
  font-display: swap;
  src: url('./assets/fonts/${f.file}') format('woff2');
  unicode-range: ${f.range};
}`).join('\n\n')}
`;
await writeFile('src/fonts.css', css);

console.log(`${faces.length} @font-face -> ${byHash.size} file duy nhat, ${(bytesWritten / 1024).toFixed(1)} kB`);
for (const [, f] of byHash) console.log('  ' + f);
