import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// BaseKit V1 is vendored under vendor/basekit (see docs/basekit-integration.md).
// We resolve the @basekit/* package entry points to their prebuilt dist so the
// app, tests and build consume the compiled library without a separate build step.
const basekit = (pkg: string) =>
  fileURLToPath(new URL(`./vendor/basekit/packages/${pkg}/dist/index.js`, import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@basekit/tokens': basekit('tokens'),
      '@basekit/core': basekit('core'),
      '@basekit/ui': basekit('ui'),
      '@basekit/api': basekit('api'),
    },
  },
  server: {
    proxy: {
      '/bible-proxy': {
        target: 'https://api.scripture.api.bible',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/bible-proxy/, '/v1'),
      },
      '/bible-api': {
        target: 'https://bible-api.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/bible-api/, ''),
      },
    },
  },
});
