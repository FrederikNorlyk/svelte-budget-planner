import type { Month } from '$lib/enums/Month.js';
import type { Expense } from '$lib/models/Expense.js';
import { ExpenseClient } from '$lib/server/clients/ExpenseClient';
import { PaymentDateClient } from '$lib/server/clients/PaymentDateClient.js';
import { SettingsClient } from '$lib/server/clients/SettingsClient';
import PaymentDateValidationUtil from '$lib/util/PaymentDateValidationUtil.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load(event) {
	const session = await event.locals.auth();

	if (!session) {
		redirect(303, '/');
	}

	const expenseClient = new ExpenseClient(session.user.id);
	const id = +event.params.expenseId;

	if (isNaN(id)) {
		redirect(303, '/accounts/' + event.params.accountId);
	}

	let expense: Expense | null = null;

	if (id !== 0) {
		const expenses = await expenseClient.listAllExpanded({ ids: [id] });

		if (expenses.length === 0) {
			redirect(303, '/accounts/' + event.params.accountId);
		}

		expense = expenses[0];
	}

	return {
		session: session,
		expense: expense,
		tags: await expenseClient.listAllTags()
	};
}

export const actions = {
	save: async ({ request, params, locals }) => {
		const session = await locals.auth();

		if (!session) {
			redirect(303, '/');
		}

		const data = await request.formData();
		const name = data.get('name')?.toString();
		const amount = +(data.get('amount')?.toString() || '');
		const isEnabled = !!data.get('isEnabled');
		const isShared = data.get('isShared') == 'true';
		const monthNumbers: number[] = data.getAll('month').map(Number);
		const months: Month[] = monthNumbers.map((month) => month as Month);

		if (name == null || amount == 0 || isNaN(amount)) {
			return fail(400, { error: 'expense.error.requiredFields' });
		}

		if (!PaymentDateValidationUtil.validateCombination(months)) {
			return fail(400, { error: 'expense.error.invalidCombinationOfMonths' });
		}

		const id = +params.expenseId;
		const accountId = +params.accountId;

		const userIds = [session.user.id];
		if (isShared) {
			const settingsClient = new SettingsClient(session.user.id);
			const setting = await settingsClient.getForCurrentUser();

			const partnerId = setting.partnerId;
			if (partnerId != null) {
				userIds.push(partnerId);
			}
		}

		const tag = data.get('tag')?.toString().trim() ?? null;

		const expenseClient = new ExpenseClient(session.user.id);

		let newExpense: Expense;
		if (id == 0) {
			newExpense = await expenseClient.create({
				userIds: userIds,
				name: name,
				amount: amount,
				accountId: accountId,
				isEnabled: isEnabled,
				isShared: isShared,
				tag: tag
			});
		} else {
			newExpense = await expenseClient.update(id, {
				userIds: userIds,
				name: name,
				amount: amount,
				accountId: accountId,
				isEnabled: isEnabled,
				isShared: isShared,
				tag: tag
			});
		}

		const paymentDateClient = new PaymentDateClient(session.user.id);

		if (id != 0) {
			await paymentDateClient.deleteAllBelongingTo(id);
		}

		for (const month of months) {
			const createdPaymentDate = await paymentDateClient.create({
				userIds: userIds,
				expenseId: newExpense.id,
				month: +month
			});

			if (createdPaymentDate == null) {
				return fail(400, { error: 'Could not create payment date' });
			}
		}

		redirect(303, '/accounts/' + params.accountId);
	},

	delete: async ({ params, locals }) => {
		const session = await locals.auth();

		if (!session) {
			redirect(303, '/');
		}

		const client = new ExpenseClient(session.user.id);
		const id = +params.expenseId;
		const result = await client.delete(id);

		if (result.getError() != null) {
			return fail(400, { error: result.getError() });
		}

		redirect(303, '/accounts/' + params.accountId);
	}
};
