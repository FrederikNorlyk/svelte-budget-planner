import { resolve } from '$app/paths';
import type { Expense } from '$lib/models/Expense.js';
import { ExpenseClient } from '$lib/server/clients/ExpenseClient';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	const session = await event.locals.auth();

	if (!session) {
		redirect(303, '/');
	}

	const expenseClient = new ExpenseClient(session.user.id);
	const id = +event.params.expenseId;

	if (Number.isNaN(id)) {
		redirect(303, resolve('/accounts/[accountId]', { accountId: event.params.accountId }));
	}

	let expense: Expense | null = null;

	if (id !== 0) {
		const expenses = await expenseClient.listAllExpanded({ ids: [id] });

		if (expenses.length === 0) {
			redirect(303, resolve('/accounts/[accountId]', { accountId: event.params.accountId }));
		}

		expense = expenses[0];
	}

	return {
		session: session,
		expense: expense,
		tags: await expenseClient.listAllTags()
	};
}
