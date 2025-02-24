import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    target: 'ES2022',
  },
  plugins: [
    tailwindcss(),
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
