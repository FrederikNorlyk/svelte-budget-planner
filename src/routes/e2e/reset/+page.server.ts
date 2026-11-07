import { ResetClient } from '#lib/server/clients/ResetClient.ts';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	if (!session) {
		redirect(303, '/');
	}

	const client = new ResetClient(session.user.id);

	await client.reset();

	return {
		session: session
	};
};
