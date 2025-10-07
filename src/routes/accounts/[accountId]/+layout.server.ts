import { resolve } from '$app/paths';
import { AccountClient } from '$lib/server/clients/AccountClient.js';

export const load = async (event) => {
	const session = await event.locals.auth();
	if (session == null) {
		throw new Error('Invalid session');
	}

	const accountClient = new AccountClient(session.user.id);

	const id = +event.params.accountId;
	if (id === 0 || Number.isNaN(id)) {
		return {
			title: '',
			details: ''
		};
	}

	const accounts = await accountClient.listAllExpanded({ ids: [id] });

	if (accounts.length === 0) {
		throw new Error('No account found with id: ' + id);
	}

	const account = accounts[0];

	return {
		account: account,
		title: account.name,
		details: 'account.details',
		backHref: '.',
		editHref: resolve('/accounts/[accountId]/edit', { accountId: event.params.accountId })
	};
};
