import { Month } from '$lib/enums/Month';
import { Account } from '$lib/models/Account';
import { Expense } from '$lib/models/Expense';
import { PaymentDate } from '$lib/models/PaymentDate';
import { describe, expect, test } from 'vitest';

describe('Tests for the Account model', () => {
	describe('Test for monthlyAmount', () => {
		test('Various expenses', () => {
			const account = new Account({
				id: 1,
				name: 'Test',
				userIds: ['user1'],
				expenses: [
					createExpense(100, []),
					createExpense(1200, [Month.MARCH]),
					createExpense(600, [Month.JANUARY, Month.JULY])
				]
			});

			expect(account.monthlyAmount).toBe(300);
		});

		test('Disabled expenses are not included', () => {
			const account = new Account({
				id: 1,
				name: 'Test',
				userIds: ['user1'],
				expenses: [createExpense(100, [], false)]
			});

			expect(account.monthlyAmount).toBe(0);
		});
	});
});

function createExpense(amount: number, months: Month[], isEnabled: boolean = true) {
	const expense = new Expense({
		id: 0,
		name: 'Test',
		amount: amount,
		tag: 'tag',
		accountId: 0,
		isEnabled: isEnabled,
		isShared: false,
		userIds: ['user1']
	});

	for (let i = 0; i < months.length; i++) {
		expense.addPaymentDate(
			new PaymentDate({
				id: 0,
				expenseId: expense.id,
				month: months[i],
				userIds: ['user1']
			})
		);
	}

	return expense;
}
