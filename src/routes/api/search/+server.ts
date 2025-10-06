import { resolve } from '$app/paths';
import type { Account } from '$lib/models/Account';
import type { Expense } from '$lib/models/Expense';
import type SearchResult from '$lib/models/SearchResult';
import { RecordType } from '$lib/models/SearchResult';
import { AccountClient } from '$lib/server/clients/AccountClient';
import { ExpenseClient } from '$lib/server/clients/ExpenseClient.js';
import { json, redirect, type RequestEvent } from '@sveltejs/kit';

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
	const results: SearchResult[] = [];
	results.push(...accountResults);
	results.push(...expenseResults);
	results.push(...tagResults);

	results.sort((r1, r2) => r1.name.localeCompare(r2.name));

	return json(results);
};

function accountToSearchResult(account: Account): SearchResult {
	const url = resolve('/accounts/[accountId]', { accountId: String(account.id) });
	return { name: account.name, url: url, recordType: RecordType.ACCOUNT };
}

function expenseToSearchResult(expense: Expense): SearchResult {
	const url = resolve('/accounts/[accountId]/[expenseId]', {
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
	const url = resolve('/tags/[name]', { name: tag });
	return { name: tag, url: url, recordType: RecordType.TAG };
}
