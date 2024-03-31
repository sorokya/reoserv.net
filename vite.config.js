import { vitePlugin as remix } from '@remix-run/dev';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    imagetools({
      defaultDirectives(url, metadata) {
        return new URLSearchParams({
          format: 'webp',
        });
      },
    }),
    tailwindcss(),
  ],
});
