import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (await locals.auth()) {
		redirect(303, '/accounts');
	}

	return {};
};

export const actions: Actions = {
	demo: async ({ cookies }) => {
		cookies.set('demo_user', '1', {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 30
		});

		redirect(303, '/accounts');
	}
};
