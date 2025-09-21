import { AccountClient } from '$lib/server/clients/AccountClient.js';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	const session = await event.locals.auth();
	if (!session) {
		redirect(303, '/');
	}

	const accountClient = new AccountClient(session.user.id);

	const id = +event.params.accountId;

	if (isNaN(id)) {
		redirect(303, '/accounts');
	}

	const account = await accountClient.getByIdExpanded(id);

	if (!account) {
		redirect(303, '/accounts');
	}

	return {
		session: session,
		account: account
	};
}
