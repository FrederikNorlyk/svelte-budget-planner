import type { Account } from '$lib/models/Account.js';
import { AccountClient } from '$lib/server/clients/AccountClient.js';
import { ExpenseClient } from '$lib/server/clients/ExpenseClient';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	const session = await event.locals.auth();
	if (!session) {
		redirect(303, '/');
	}

	const tagName = event.params.name;

	const accountClient = new AccountClient(session.user.id);
	const expenseClient = new ExpenseClient(session.user.id);

	let expenses = await expenseClient.listAll({ tag: tagName });
	let accounts: Account[] = [];

	if (expenses.length > 0) {
		const accountIds = new Set(expenses.map((e) => e.accountId));

		expenses = await expenseClient.addPaymentDatesTo(expenses);
		accounts = await accountClient.listAll({ ids: Array.from(accountIds) });
	}

	return {
		session: session,
		expenses: expenses,
		accounts: accounts
	};
}
