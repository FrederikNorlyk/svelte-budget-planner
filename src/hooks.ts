import { Account } from '$lib/models/Account';
import { Expense } from '$lib/models/Expense';
import { PaymentDate } from '$lib/models/PaymentDate';
import { Settings } from '$lib/models/Settings';
import type { Transport } from '@sveltejs/kit';

export const transport: Transport = {
	Account: {
		encode: (account) =>
			account instanceof Account && [account.id, account.userIds, account.name, account.expenses],
		decode: ([id, userIds, name, expenses]) =>
			new Account({ id: id, userIds: userIds, name: name }, expenses)
	},
	Expense: {
		encode: (expense) =>
			expense instanceof Expense && [
				expense.id,
				expense.name,
				expense.amount,
				expense.tag,
				expense.accountId,
				expense.isEnabled,
				expense.isShared,
				expense.userIds,
				expense.paymentDates
			],
		decode: ([id, name, amount, tag, accountId, isEnabled, isShared, userIds, paymentDates]) =>
			new Expense(
				{
					id: id,
					name: name,
					amount: amount,
					tag: tag,
					accountId: accountId,
					isEnabled: isEnabled,
					isShared: isShared,
					userIds: userIds
				},
				paymentDates
			)
	},
	PaymentDate: {
		encode: (paymentDate) =>
			paymentDate instanceof PaymentDate && [
				paymentDate.id,
				paymentDate.userIds,
				paymentDate.expenseId,
				paymentDate.month
			],
		decode: ([id, userId, expenseId, month]) =>
			new PaymentDate({
				id: id,
				userIds: userId,
				expenseId: expenseId,
				month: month
			})
	},
	Settings: {
		encode: (settings) =>
			settings instanceof Settings && [
				settings.id,
				settings.userId,
				settings.locale,
				settings.income,
				settings.partnerId
			],
		decode: ([id, userId, locale, income, partnerId]) =>
			new Settings({
				id: id,
				userId: userId,
				locale: locale,
				income: income,
				partnerId: partnerId
			})
	}
};
