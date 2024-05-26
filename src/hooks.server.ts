import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import Credentials from '@auth/core/providers/credentials';

type HandleParams = Parameters<Handle>[0];

async function authorization({ event, resolve }: HandleParams) {
	const session = await event.locals.getSession();
	const isLoggedIn = !!session;

	if (!isLoggedIn) {
		throw redirect(303, '/auth/signin');
	}

	return resolve(event);
}

export const handle: Handle = sequence(
	SvelteKitAuth({
		providers: [
			GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
			Credentials({
				name: 'a demo user',
				async authorize() {
					return { id: '1', name: 'Jane Doe', email: 'jsmith@example.com', image: '/demouser.jpg' };
				}
			})
		],
		callbacks: {
			async session({ session, token }) {
				return Promise.resolve({ ...session, user: { ...session.user, id: token.sub } });
			}
		}
	}),
	authorization
);
