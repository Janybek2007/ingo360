import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    resolve: {
      alias: {
        '#': '/src',
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      tsconfigPaths(),
      ViteImageOptimizer({
        jpg: { quality: 75 },
        png: { quality: 80 },
        webp: { quality: 80 },
      }),
    ],
    server: { port: 4000, host: true, strictPort: true },
    preview: {
      host: true,
      port: 4000,
      strictPort: true,
      allowedHosts: ['ingo360.rootzone.work'],
    },
    build: {
      target: 'esnext',
      sourcemap: isDev,
      chunkSizeWarningLimit: 1000,
      cssMinify: true,
      ssr: false,
      cssCodeSplit: true,
    },
  };
});
