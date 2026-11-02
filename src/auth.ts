import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { betterAuth } from 'better-auth';
import { sveltekitCookies } from 'better-auth/svelte-kit';

export const auth = betterAuth({
	// Without a database adapter, Better Auth keeps its session in stateless cookies.
	secret: env.BETTER_AUTH_SECRET ?? env.AUTH_SECRET!,
	baseURL: env.BETTER_AUTH_URL,
	account: {
		// The app only needs the GitHub ID, not long-lived provider tokens.
		storeAccountCookie: false
	},
	user: {
		additionalFields: {
			githubId: {
				type: 'string',
				required: false,
				input: true,
				returned: true
			}
		}
	},
	socialProviders: {
		github: {
			clientId: env.AUTH_GITHUB_ID ?? env.GITHUB_CLIENT_ID!,
			clientSecret: env.AUTH_GITHUB_SECRET ?? env.GITHUB_CLIENT_SECRET!,
			mapProfileToUser(profile) {
				return {
					email: profile.email ?? `${profile.id}@github.placeholder.invalid`,
					githubId: String(profile.id)
				};
			}
		}
	},
	// The GitHub ID is provided by the trusted profile mapper. Block the user
	// profile endpoint so a client cannot replace that ID in its session.
	disabledPaths: ['/update-user'],
	plugins: [sveltekitCookies(getRequestEvent)]
});
