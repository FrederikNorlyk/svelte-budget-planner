import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import dotenvExpand from 'dotenv-expand';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
	if (mode === 'development') {
		const env = loadEnv(mode, process.cwd(), '');
		dotenvExpand.expand({ parsed: env });
	}

	return {
		plugins: [tailwindcss(), sveltekit()],
		test: {
			include: ['tests/lib/**/*.{test,spec}.{js,ts}'],
			coverage: {
				include: ['src/**'],
				exclude: ['src/routes/**']
			}
		}
	};
});
