import { sveltekit } from '@sveltejs/kit/vite';
import dotenvExpand from 'dotenv-expand';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
	if (mode === 'development') {
		const env = loadEnv(mode, process.cwd(), '');
		dotenvExpand.expand({ parsed: env });
	}

	return {
		plugins: [sveltekit()],
		test: {
			include: ['tests/**/*.{test,spec}.{js,ts}']
		}
	};
});
