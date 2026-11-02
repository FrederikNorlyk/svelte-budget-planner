import { auth } from '../../../auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	await auth.api.signOut({ headers: request.headers });
	cookies.delete('demo_user', { path: '/' });

	return new Response(null, { status: 204 });
};
