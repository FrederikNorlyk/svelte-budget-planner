import { building } from '$app/env';
import { redirect } from '@sveltejs/kit';
import { sequence, type Handle } from '@sveltejs/kit/hooks';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { locale } from 'svelte-i18n';
import { auth } from './auth';

type HandleParams = Parameters<Handle>[0];

async function authorizationHandle({ event, resolve }: HandleParams) {
	const pathname = event.url.pathname;
	if (
		pathname === '/api/auth' ||
		pathname.startsWith('/api/auth/') ||
		pathname === '/auth/signin' ||
		pathname === '/auth/signin/'
	) {
		return resolve(event);
	}

	const session = await event.locals.auth();

	if (session == null) {
		redirect(303, '/auth/signin');
	}

	return resolve(event);
}

async function authenticationHandle({ event, resolve }: HandleParams) {
	const session = await auth.api.getSession({ headers: event.request.headers });
	const demoUser = event.cookies.get('demo_user') === '1';

	event.locals.auth = async () => {
		if (session) {
			return {
				...session,
				user: {
					...session.user,
					id: session.user.githubId ?? session.user.id
				}
			};
		}

		return demoUser ? { user: { id: '1' } } : null;
	};

	return resolve(event);
}

async function localizationHandle({ event, resolve }: HandleParams) {
	const lang = event.request.headers.get('accept-language')?.split(',')[0];
	if (lang) {
		locale.set(lang);
	}
	return resolve(event);
}

export const handle: Handle = sequence(
	authenticationHandle,
	authorizationHandle,
	localizationHandle,
	({ event, resolve }) => svelteKitHandler({ event, resolve, auth, building })
);
