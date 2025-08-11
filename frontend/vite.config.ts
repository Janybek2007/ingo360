import react from '@vitejs/plugin-react-swc';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import svgr from 'vite-plugin-svgr';
import VitePWA from 'vite-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
	const isDev = mode === 'development';

	return {
		plugins: [
			react(),
			tailwindcss(),
			VitePWA({ spa: true }),
			tsconfigPaths(),
			AutoImport({
				imports: ['react'],
				dts: 'src/auto-imports.d.ts'
			}),
			svgr(),
			compression({
				algorithm: 'brotliCompress',
				ext: '.br',
				threshold: 10240,
				deleteOriginFile: false
			}),
			ViteImageOptimizer({
				jpg: { quality: 75 },
				png: { quality: 80 },
				webp: { quality: 80 }
			})
		],
		server: {
			port: 4000,
			host: true,
			strictPort: true
		},
		preview: {
			host: true,
			port: 4000,
			strictPort: true
		},
		build: {
			target: 'esnext',
			sourcemap: isDev,
			chunkSizeWarningLimit: 1000,
			cssMinify: true,
			ssr: false,
			cssCodeSplit: true
		}
	};
});
