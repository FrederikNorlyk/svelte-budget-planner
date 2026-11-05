import { redirect } from '@sveltejs/kit';
import { auth } from '../../../auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	await auth.api.signOut({ headers: request.headers });
	cookies.delete('demo_user', { path: '/' });

	redirect(303, '/auth/signin');
};
