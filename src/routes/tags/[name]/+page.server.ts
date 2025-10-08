import { ExpenseClient } from '$lib/server/clients/ExpenseClient';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	const session = await event.locals.auth();
	if (!session) {
		redirect(303, '/');
	}

	const tagName = event.params.name;
	const expenseClient = new ExpenseClient(session.user.id);

	return {
		session: session,
		expenses: await expenseClient.listAllExpanded({ tag: tagName })
	};
}
