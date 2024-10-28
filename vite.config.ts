import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import tsconfigPaths from 'vite-tsconfig-paths';

declare module '@remix-run/node' {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_singleFetch: true,
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
        unstable_optimizeDeps: true,
      },
    }),
    imagetools({
      defaultDirectives(url, metadata) {
        return new URLSearchParams({
          format: 'webp',
        });
      },
    }),
    tsconfigPaths(),
  ],
});
