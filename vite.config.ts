import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const githubPages = process.env.GITHUB_PAGES === 'true';
  return {
    // GitHub project page: https://phongbao-uopeopleuni.github.io/phongbportfolio/
    base: githubPages ? '/phongbportfolio/' : '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
