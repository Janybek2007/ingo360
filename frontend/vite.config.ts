import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, type HtmlTagDescriptor } from 'vite';
import compression from 'vite-plugin-compression';
import tsconfigPaths from 'vite-tsconfig-paths';

// Вынести ЗА пределы defineConfig (на уровень модуля)

const VENDOR_CHUNKS: [patterns: string[], chunk: string][] = [
  [['react/', 'react-dom/', 'scheduler'], 'react-vendor'],
  [['react-router'], 'router-vendor'],
  [['@tanstack/react-query', '@tanstack/query-core'], 'query-vendor'],
  [['@tanstack/react-table', '@tanstack/table-core'], 'table-vendor'],
  [['@tanstack/react-virtual', '@tanstack/virtual-core'], 'virtual-vendor'],
  [['recharts', 'd3-'], 'charts-vendor'],
  [['react-hook-form', '@hookform'], 'forms-vendor'],
  [['zod'], 'zod-vendor'],
  [['xlsx'], 'xlsx-vendor'],
  [['ky'], 'http-vendor'],
  [['clsx', 'tailwind-merge'], 'ui-utils-vendor'],
  [
    [
      'js-cookie',
      'qs',
      'react-hot-toast',
      'use-debounce',
      'use-local-storage-state',
    ],
    'utils-vendor',
  ],
];

const SRC_CHUNKS: [pattern: string, chunk: string][] = [
  ['/src/app/', 'app'],
  ['/src/shared/components/ui', 'shared-ui'],
  ['/src/shared/components/table', 'shared-table-ui'],
  ['/src/shared/hooks/', 'shared-hooks'],
  ['/src/shared/utils/', 'shared-utils'],
];

function resolveVendorChunk(id: string): string {
  const match = VENDOR_CHUNKS.find(([patterns]) =>
    patterns.some(p => id.includes(p))
  );
  return match?.[1] ?? 'vendor';
}

function resolveSourceChunk(id: string): string | undefined {
  return SRC_CHUNKS.find(([pattern]) => id.includes(pattern))?.[1];
}

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';
  const isProduction = mode === 'production';

  return {
    resolve: {
      alias: { '#': '/src' },
    },

    target: ['es2023', 'chrome107', 'safari16', 'firefox109', 'edge107'],

    plugins: [
      react(),

      tailwindcss(),
      tsconfigPaths(),

      isProduction &&
        compression({
          algorithm: 'gzip',
          ext: '.gz',
          compressionOptions: { level: 9 },
          threshold: 512,
          deleteOriginFile: false,
        }),
      isProduction &&
        compression({
          algorithm: 'brotliCompress',
          ext: '.br',
          threshold: 512,
          compressionOptions: { level: 11 },
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
      minify: 'terser',
      sourcemap: isDevelopment,
      chunkSizeWarningLimit: 800,
      reportCompressedSize: false,

      rollupOptions: {
        output: {
          entryFileNames: 'assets/js/[name]-[hash].js',
          chunkFileNames: chunk => {
            if (chunk.name.includes('vendor')) {
              return 'assets/vendors/[name]-[hash].js';
            }
            return 'assets/js/[name]-[hash].js';
          },

          assetFileNames: assetInfo => {
            const name =
              (assetInfo as any).name ?? (assetInfo as any).fileName ?? '';

            if (/\.css$/.test(name)) return 'assets/css/[name]-[hash][extname]';
            if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(name))
              return 'assets/images/[name]-[hash][extname]';
            if (/\.(woff2?|ttf|otf|eot)$/.test(name))
              return 'assets/fonts/[name]-[hash][extname]';
            if (/\.(mp4|webm|ogg|mp3|wav)$/.test(name))
              return 'assets/media/[name]-[hash][extname]';
            return 'assets/other/[name]-[hash][extname]';
          },
          manualChunks(id) {
            if (id.includes('node_modules')) return resolveVendorChunk(id);
            return resolveSourceChunk(id);
          },

          experimentalMinChunkSize: 20_000, // 20kb
        },

        treeshake: isProduction
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
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },

    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
      legalComments: 'none',
      treeShaking: true,
      minifyIdentifiers: isProduction,
      minifySyntax: isProduction,
      minifyWhitespace: isProduction,
      drop: isProduction ? ['console', 'debugger'] : [],
      pure: isProduction
        ? ['console.log', 'console.info', 'console.debug']
        : [],
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
        'react-hot-toast',
        'use-debounce',
      ],
      exclude: [
        'xlsx', // Большой, загружать lazy
        isProduction && 'recharts',
      ].filter(Boolean) as string[],
      esbuildOptions: {
        target: 'es2022',
        supported: {
          'top-level-await': true,
        },
      },
      force: isDevelopment,
    },

    json: {
      stringify: true,
    },

    logLevel: isDevelopment ? 'info' : 'warn',
    clearScreen: false,
  };
});
