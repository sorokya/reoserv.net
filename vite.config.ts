import { reactRouter } from '@react-router/dev/vite';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    target: 'ES2022',
    minify: true,
    cssMinify: true,
  },
  css: {
    postcss: { plugins: [tailwindcss, autoprefixer] },
  },
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    imagetools({
      defaultDirectives(url, metadata) {
        return new URLSearchParams({
          format: 'webp',
        });
      },
    }),
  ],
});
