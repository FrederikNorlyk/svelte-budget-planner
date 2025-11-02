import { resolve } from '$app/paths';
import { command, form, getRequestEvent, query } from '$app/server';
import type { Month } from '$lib/enums/Month';
import type { Expense } from '$lib/models/Expense';
import { ExpenseClient } from '$lib/server/clients/ExpenseClient';
import { PaymentDateClient } from '$lib/server/clients/PaymentDateClient';
import { SettingsClient } from '$lib/server/clients/SettingsClient';
import PaymentDateValidationUtil from '$lib/util/PaymentDateValidationUtil';
import { error, fail, redirect } from '@sveltejs/kit';
import * as v from 'valibot';
import { monthOptions, shareOptions } from './options';

export const upsertExpense = form(
	v.object({
		name: v.string(),
		amount: v.pipe(v.number(), v.minValue(1)),
		isEnabled: v.optional(v.boolean(), false),
		isShared: v.pipe(
			v.picklist(shareOptions.map((option) => option.value)),
			v.transform((value) => value === 'true')
		),
		months: v.optional(
			v.pipe(
				v.array(
					v.picklist(
						monthOptions.map((option) => {
							return option.value;
						})
					)
				),
				v.transform((values) => values.map((value) => Number(value) as Month))
			),
			[]
		),
		tag: v.string()
	}),
	async ({ name, amount, isEnabled, isShared, months, tag }, invalid) => {
		const { locals, params } = getRequestEvent();
		const session = await locals.auth();

		if (!session) {
			redirect(303, '/');
		}

		if (amount > 20) {
			return fail(400, { error: 'Omg error!' });
		}
		if (!PaymentDateValidationUtil.validateCombination(months)) {
			invalid(invalid.months('expense.error.invalidCombinationOfMonths'));
		}

		const id = params.expenseId ? +params.expenseId : 0;

		if (!params.accountId || Number.isNaN(params.accountId)) {
			throw new Error('Invalid account id: ' + params.accountId);
		}

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

		redirect(303, resolve('/accounts/[accountId]', { accountId: params.accountId }));
	}
);

export const getExpense = query(v.number(), async (id) => {
	const { locals } = getRequestEvent();
	const session = await locals.auth();

	if (!session) {
		redirect(303, '/');
	}

	const expenseClient = new ExpenseClient(session.user.id);
	let expense: Expense | null = null;

	if (id !== 0) {
		const expenses = await expenseClient.listAllExpanded({ ids: [id] });

		if (expenses.length === 0) {
			error(404, 'Expense not found');
		}

		expense = expenses[0];
	}

	return expense;
});

export const deleteExpense = command(v.number(), async (id) => {
	const { locals } = getRequestEvent();
	const session = await locals.auth();

	if (!session) {
		throw new Error('User not authorized');
	}

	const client = new ExpenseClient(session.user.id);
	const result = await client.delete(id);

	if (result.getError() != null) {
		return {
			error: result.getError()
		};
	}

	return {
		success: true
	};
});
