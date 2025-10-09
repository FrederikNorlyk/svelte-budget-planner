import { AccountClient } from '$lib/server/clients/AccountClient.js';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	const session = await event.locals.auth();
	if (!session) {
		redirect(303, '/');
	}

	const id = +event.params.accountId;
	let account = null;

	if (id !== 0) {
		const accountClient = new AccountClient(session.user.id);

		account = await accountClient.getById(id);
	}

	return {
		account: account
	};
}
