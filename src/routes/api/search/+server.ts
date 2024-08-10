import { ExpenseClient } from '$lib/clients/ExpenseClient.js';
import { json, redirect, type RequestEvent } from '@sveltejs/kit';

export const GET = async (request: RequestEvent) => {
	const session = await request.locals.auth();
	if (session == null) {
		redirect(303, '/');
	}

	const query = request.url.searchParams.get('q') ?? '';

	const expenseClient = new ExpenseClient(session.user.id);

	const expenses = await expenseClient.listAll();

	const filtered = expenses.filter((expense) => expense.name.includes(query));
	const result = filtered.map((expense) => expense.name);

	return json(result);
};
