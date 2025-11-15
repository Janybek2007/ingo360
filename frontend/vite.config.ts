import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, type HtmlTagDescriptor } from 'vite';
import compression from 'vite-plugin-compression';
import Preload from 'vite-plugin-preload';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const isProd = mode === 'production';

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
            return ['index', 'react-vendor', 'router-vendor'].some(n =>
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

      isProd &&
        compression({
          algorithm: 'gzip',
          ext: '.gz',
          compressionOptions: { level: 9 },
          threshold: 512,
          deleteOriginFile: false,
        }),

      {
        name: 'optimize-html',
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
              tag: 'link',
              injectTo: 'head-prepend',
              attrs: {
                rel: 'dns-prefetch',
                href: 'https://ingo360.pro',
              },
            },
          ];

          return tags;
        },
      },
    ].filter(Boolean),

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
      target: ['es2022', 'chrome100', 'safari15', 'firefox100', 'edge100'],
      cssMinify: 'lightningcss',
      cssCodeSplit: true,
      minify: 'esbuild',
      sourcemap: isDev,
      chunkSizeWarningLimit: 800,
      reportCompressedSize: false,

      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',

          manualChunks(id) {
            // Vendor chunks - только то что есть в package.json
            if (id.includes('node_modules')) {
              // React core (19.2.0)
              if (
                id.includes('react/') ||
                id.includes('react-dom/') ||
                id.includes('scheduler')
              ) {
                return 'react-vendor';
              }

              // Router (react-router 7.8.0)
              if (id.includes('react-router')) {
                return 'router-vendor';
              }

              // TanStack ecosystem
              if (
                id.includes('@tanstack/react-query') ||
                id.includes('@tanstack/query-core')
              ) {
                return 'query-vendor';
              }
              if (
                id.includes('@tanstack/react-table') ||
                id.includes('@tanstack/table-core')
              ) {
                return 'table-vendor';
              }
              if (
                id.includes('@tanstack/react-virtual') ||
                id.includes('@tanstack/virtual-core')
              ) {
                return 'virtual-vendor';
              }

              // Charts (recharts + d3 dependencies)
              if (id.includes('recharts') || id.includes('d3-')) {
                return 'charts-vendor';
              }

              // Forms ecosystem
              if (id.includes('react-hook-form') || id.includes('@hookform')) {
                return 'forms-vendor';
              }
              if (id.includes('zod')) {
                return 'zod-vendor';
              }

              // Excel обработка (большой, lazy load рекомендуется)
              if (id.includes('xlsx')) {
                return 'xlsx-vendor';
              }

              // HTTP & Utils
              if (id.includes('ky')) {
                return 'http-vendor';
              }

              // UI utilities
              if (id.includes('clsx') || id.includes('tailwind-merge')) {
                return 'ui-utils-vendor';
              }

              // Прочие небольшие библиотеки
              if (
                id.includes('js-cookie') ||
                id.includes('qs') ||
                id.includes('sonner') ||
                id.includes('use-debounce') ||
                id.includes('use-local-storage-state') ||
                id.includes('react-error-boundary')
              ) {
                return 'utils-vendor';
              }

              // Остальные зависимости
              return 'vendor';
            }

            // App chunks - FSD архитектура
            if (id.includes('/src/app/')) return 'app';
            if (id.includes('/src/routes/')) return 'routes';
            if (id.includes('/src/widgets/')) return 'widgets';
            if (id.includes('/src/features/')) return 'features';
            if (id.includes('/src/entities/')) return 'entities';

            // Shared слой
            if (id.includes('/src/shared/ui/')) return 'shared-ui';
            if (id.includes('/src/shared/lib/')) return 'shared-lib';
            if (id.includes('/src/shared/api/')) return 'shared-api';
            if (id.includes('/src/shared/')) return 'shared';
          },

          experimentalMinChunkSize: 20000, // 20kb
        },

        treeshake: isProd
          ? {
              moduleSideEffects: 'no-external',
              preset: 'recommended',
              propertyReadSideEffects: false,
              unknownGlobalSideEffects: false,
            }
          : false,

        onwarn(warning, warn) {
          // Игнорируем предупреждения о circular dependencies в dev
          if (warning.code === 'CIRCULAR_DEPENDENCY') return;
          warn(warning);
        },
      },
    },

    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
      legalComments: 'none',
      treeShaking: true,
      minifyIdentifiers: isProd,
      minifySyntax: isProd,
      minifyWhitespace: isProd,
      drop: isProd ? ['console', 'debugger'] : [],
      pure: isProd ? ['console.log', 'console.info', 'console.debug'] : [],
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-router',
        '@tanstack/react-query',
        '@tanstack/react-table',
        '@tanstack/react-virtual',
        'ky',
        'clsx',
        'tailwind-merge',
        'sonner',
        'use-debounce',
      ],
      exclude: [
        'xlsx', // Большой, загружать lazy
        isProd && 'recharts',
      ].filter(Boolean) as string[],
      esbuildOptions: {
        target: 'es2022',
        supported: {
          'top-level-await': true,
        },
      },
      force: isDev,
    },

    json: {
      stringify: true,
    },

    logLevel: isDev ? 'info' : 'warn',
    clearScreen: false,
  };
});
