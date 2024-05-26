import { AccountClient } from '$lib/clients/AccountClient.js';

export const load = async (event) => {
	const session = await event.locals.getSession();
	if (session == null) {
		throw Error('Invalid session');
	}

	const accountClient = new AccountClient(session.user.id);

	const id = +event.params.accountId;
	if (id === 0) {
		return {
			title: '',
			details: ''
		};
	}

	const account = await accountClient.getById(id);
	if (account == null) {
		throw Error('Could not get account #' + id);
	}

	return {
		title: account.getName(),
		details: 'account.details',
		editHref: `/accounts/${account.getId()}/edit`
	};
};
