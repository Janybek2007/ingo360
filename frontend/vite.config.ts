import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';
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
      compression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 1024,
        deleteOriginFile: false,
        compressionOptions: { level: 9 },
      }),
    ],
    server: { port: 4000, host: true, strictPort: true },
    preview: {
      host: true,
      port: 4000,
      strictPort: true,
      allowedHosts: ['ingo360.pro'],
    },
    build: {
      target: 'esnext',
      sourcemap: isDev,
      chunkSizeWarningLimit: 1000,
      cssMinify: true,
      ssr: false,
      cssCodeSplit: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },
    esbuild: {
      drop: isDev ? [] : ['console', 'debugger'],
    },
  };
});
