import { AccountClient } from '$lib/server/clients/AccountClient';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();
	if (!session) {
		redirect(303, '/');
	}

	const accountClient = new AccountClient(session.user.id);

	const id = +event.params.accountId;
	if (isNaN(id)) {
		redirect(303, '/balance');
	}

	const accounts = await accountClient.listAllExpanded({ ids: [id], expense: { isEnabled: true } });

	if (accounts.length === 0) {
		redirect(303, '/balance');
	}

	return {
		session: session,
		account: accounts[0]
	};
};
