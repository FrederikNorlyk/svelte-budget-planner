import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handle as authenticationHandle } from './auth';

type HandleParams = Parameters<Handle>[0];

async function authorizationHandle({ event, resolve }: HandleParams) {
	const session = await event.locals.auth();

	if (session == null) {
		redirect(303, '/auth/signin');
	}

	return resolve(event);
}

export const handle: Handle = sequence(authenticationHandle, authorizationHandle);
