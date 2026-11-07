import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	BETTER_AUTH_SECRET: {},
	AUTH_GITHUB_ID: {},
	AUTH_GITHUB_SECRET: {},
	DATABASE_URL: {}
});
