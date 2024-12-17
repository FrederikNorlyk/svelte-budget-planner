import { AccountClient } from '$lib/clients/AccountClient';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	if (!session) {
		redirect(303, '/');
	}

	const accountClient = new AccountClient(session.user.id);
	let accounts = await accountClient.listAllExpanded();

	// Don't include accounts that only have monthly expenses
	accounts = accounts.filter((account) =>
		account.expenses.find((expense) => expense.isEnabled && !expense.isMonthlyExpense)
	);

	return {
		session: session,
		accounts: accounts.map((account) => account.serialize())
	};
};
