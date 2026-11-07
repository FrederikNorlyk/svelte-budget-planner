import type { Account } from '#lib/models/Account.ts';
import type { Expense } from '#lib/models/Expense.ts';
import type SearchResult from '#lib/models/SearchResult.ts';
import { RecordType } from '#lib/models/SearchResult.ts';
import { AccountClient } from '#lib/server/clients/AccountClient.ts';
import { ExpenseClient } from '#lib/server/clients/ExpenseClient.ts';
import { resolve } from '$app/paths';
import { redirect, type RequestEvent } from '@sveltejs/kit';

export const GET = async (request: RequestEvent) => {
	const session = await request.locals.auth();
	if (!session) {
		redirect(303, '/');
	}

	const query = request.url.searchParams.get('q') ?? '';

	const accountClient = new AccountClient(session.user.id);
	const expenseClient = new ExpenseClient(session.user.id);

	// Query the records
	const [accounts, expenses, tags] = await Promise.all([
		accountClient.search(query),
		expenseClient.search(query),
		expenseClient.searchTags(query)
	]);

	// Convert them to SearchResult objects
	const accountResults: SearchResult[] = accounts.map((account) => accountToSearchResult(account));
	const expenseResults: SearchResult[] = expenses.map((expense) => expenseToSearchResult(expense));
	const tagResults: SearchResult[] = tags.map((tag) => tagToSearchResult(tag));

	// Gather the results
	const results: SearchResult[] = [...accountResults, ...expenseResults, ...tagResults];
	results.sort((r1, r2) => r1.name.localeCompare(r2.name));

	return Response.json(results);
};

function accountToSearchResult(account: Account): SearchResult {
	const url = resolve('/(authenticated)/accounts/[accountId]', { accountId: String(account.id) });
	return { name: account.name, url: url, recordType: RecordType.ACCOUNT };
}

function expenseToSearchResult(expense: Expense): SearchResult {
	const url = resolve('/(authenticated)/accounts/[accountId]/[expenseId]', {
		accountId: String(expense.accountId),
		expenseId: String(expense.id)
	});

	return {
		name: expense.name,
		url: url,
		recordType: RecordType.EXPENSE
	};
}

function tagToSearchResult(tag: string): SearchResult {
	const url = resolve('/(authenticated)/tags/[name]', { name: tag });
	return { name: tag, url: url, recordType: RecordType.TAG };
}
