import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, type HtmlTagDescriptor } from 'vite';
import compression from 'vite-plugin-compression';
import Preload from 'vite-plugin-preload';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    resolve: {
      alias: { '#': '/src' },
    },

    plugins: [
      react(),
      tailwindcss(),
      tsconfigPaths(),

      Preload({
        includeJs: true,
        includeCss: true,
        format: true,
        mode: 'preload',
        shouldPreload: chunk => {
          if (chunk.type === 'chunk') {
            const name = chunk.fileName;
            return ['index', 'table', 'charts', 'forms'].some(n =>
              name.includes(n)
            );
          }
          return (
            chunk.type === 'asset' &&
            (chunk.fileName.endsWith('.css') ||
              chunk.fileName.endsWith('.woff2'))
          );
        },
      }),

      compression({
        algorithm: 'gzip',
        ext: '.gz',
        compressionOptions: { level: 9 },
        threshold: 1024,
      }),

      {
        name: 'add-preconnect',
        transformIndexHtml() {
          const tags: HtmlTagDescriptor[] = [
            {
              tag: 'link',
              injectTo: 'head-prepend',
              attrs: {
                rel: 'preconnect',
                href: 'https://ingo360.pro',
                crossorigin: '',
              },
            },
            {
              tag: 'script',
              injectTo: 'head-prepend',
              attrs: {
                src: 'https://unpkg.com/modulepreload-polyfill/dist/modulepreload-polyfill.min.js',
              },
            },
          ];
          return tags;
        },
      },
    ],

    server: {
      host: true,
      port: 4000,
      strictPort: true,
    },

    preview: {
      host: true,
      port: 4000,
      strictPort: true,
      allowedHosts: ['ingo360.pro'],
    },

    build: {
      target: 'esnext',
      cssMinify: 'esbuild',
      cssCodeSplit: true,
      minify: 'esbuild',
      sourcemap: false,
      chunkSizeWarningLimit: 1200,

      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) return 'vendor';
            if (id.includes('@tanstack/react-table')) return 'table';
            if (id.includes('recharts')) return 'charts';
            if (id.includes('xlsx')) return 'xlsx-lib';
            if (id.includes('react-hook-form')) return 'forms';
          },
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },

    esbuild: {
      drop: isDev ? [] : ['console', 'debugger'],
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@tanstack/react-query',
        '@tanstack/react-table',
        'recharts',
      ],
      esbuildOptions: {
        target: 'esnext',
      },
    },

    /**
     * Полезно: отключаем трешевые циклические импорты в vite
     */
    logLevel: 'info',
    clearScreen: false,
  };
});
