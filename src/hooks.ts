import { Account } from '#lib/models/Account.ts';
import { Expense } from '#lib/models/Expense.ts';
import { PaymentDate } from '#lib/models/PaymentDate.ts';
import { Settings } from '#lib/models/Settings.ts';
import type { Transport } from '@sveltejs/kit/hooks';

export const transport: Transport = {
	Account: {
		encode: (account) =>
			account instanceof Account && [account.id, account.userIds, account.name, account.expenses],
		decode: ([id, userIds, name, expenses]) => new Account({ id, userIds, name, expenses })
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
			new Expense({
				id,
				name,
				amount,
				tag,
				accountId,
				isEnabled,
				isShared,
				userIds,
				paymentDates
			})
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
			new PaymentDate({ id, userIds: userId, expenseId, month })
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
			new Settings({ id, userId, locale, income, partnerId })
	}
};
