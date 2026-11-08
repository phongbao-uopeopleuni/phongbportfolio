import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

/**
 * GitHub Pages khong co SPA fallback: mot duong dan nhu /showcase se tra 404 that.
 * Copy index.html thanh 404.html de Pages van giao app, nho do link truc tiep va F5 chay dung.
 * Danh doi: Pages tra ma HTTP 404 kem trang nay - nguoi dung khong thay, crawler thi co.
 */
function spaFallback(): Plugin {
  return {
    name: 'spa-404-fallback',
    apply: 'build',
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist');
      const index = path.join(dist, 'index.html');
      if (fs.existsSync(index)) {
        fs.copyFileSync(index, path.join(dist, '404.html'));
      }
    },
  };
}

export default defineConfig(() => {
  const githubPages = process.env.GITHUB_PAGES === 'true';
  return {
    // GitHub project page: https://phongbao-uopeopleuni.github.io/phongbportfolio/
    base: githubPages ? '/phongbportfolio/' : '/',
    plugins: [react(), tailwindcss(), spaFallback()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
