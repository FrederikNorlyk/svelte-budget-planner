import { AccountClient } from '$lib/server/clients/AccountClient';
import { ExpenseClient } from '$lib/server/clients/ExpenseClient';
import { SettingsClient } from '$lib/server/clients/SettingsClient';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, setHeaders }) => {
	const session = await locals.auth();
	if (!session) error(401, 'Unauthorized');

	const userId = session.user.id;
	try {
		const [accounts, expenses, settings] = await Promise.all([
			new AccountClient(userId).listAllExpanded(),
			new ExpenseClient(userId).listAllExpanded(),
			new SettingsClient(userId).getForCurrentUser()
		]);
		setHeaders({ 'cache-control': 'no-store' });
		return json({
			userId,
			accounts: accounts.map((account) => ({
				id: account.id,
				name: account.name,
				userIds: account.userIds,
				expenses: account.expenses.map((expense) => ({
					id: expense.id,
					name: expense.name,
					amount: expense.amount,
					tag: expense.tag,
					accountId: expense.accountId,
					isEnabled: expense.isEnabled,
					isShared: expense.isShared,
					userIds: expense.userIds,
					paymentDates: expense.paymentDates.map((date) => ({
						id: date.id,
						expenseId: date.expenseId,
						month: date.month,
						userIds: date.userIds
					}))
				}))
			})),
			expenses: expenses.map((expense) => ({
				id: expense.id,
				name: expense.name,
				amount: expense.amount,
				tag: expense.tag,
				accountId: expense.accountId,
				isEnabled: expense.isEnabled,
				isShared: expense.isShared,
				userIds: expense.userIds,
				paymentDates: expense.paymentDates.map((date) => ({
					id: date.id,
					expenseId: date.expenseId,
					month: date.month,
					userIds: date.userIds
				}))
			})),
			settings: {
				id: settings.id,
				income: settings.income,
				locale: settings.locale,
				partnerId: settings.partnerId,
				userId: settings.userId
			},
			complete: true,
			savedAt: new Date().toISOString()
		});
	} catch {
		error(503, 'Remote snapshot unavailable');
	}
};
