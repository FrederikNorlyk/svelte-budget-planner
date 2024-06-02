import { Month } from '$lib/enums/Month';
import { Account } from '$lib/models/Account';
import { Expense } from '$lib/models/Expense';
import { PaymentDate } from '$lib/models/PaymentDate';
import { CurrentAmountUtil } from '$lib/util/CurrentAmountUtil';
import { describe, expect, test } from 'vitest';

const userIds: string[] = [];

describe('Tests for getCurrentAmount', () => {
	test('Disabled expenses are not included', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);
		const expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Test',
				accountId: account.id,
				isEnabled: false,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense.id,
				month: Month.FEBRUARY,
				dayOfMonth: 1,
				userId: userIds
			})
		];

		account.expenses = [expense];

		const util = new CurrentAmountUtil();
		util.setToday(new Date(2023, Month.JANUARY, 1));
		const amount = util.getCurrentAmmount(account);
		expect(amount).toBe(0);
	});

	test('Expenses without payment dates are not included', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);

		account.expenses = [
			new Expense(
				{
					id: 1,
					name: 'Test',
					amount: 100,
					tag: 'Test',
					accountId: account.id,
					isEnabled: true,
					isShared: false,
					userId: userIds
				},
				[]
			)
		];

		const util = new CurrentAmountUtil();
		const amount = util.getCurrentAmmount(account);
		expect(amount).toBe(0);
	});

	test('Expense with a single payment date', () => {
		const util = new CurrentAmountUtil();
		util.setToday(new Date(2023, Month.JANUARY, 1));

		let account = createAccountWithSinglePaymentExpense(Month.FEBRUARY, 1);
		let amount = util.getCurrentAmmount(account);
		expect(amount).toBe(1100);

		account = createAccountWithSinglePaymentExpense(Month.MARCH, 1);
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(1000);

		account = createAccountWithSinglePaymentExpense(Month.APRIL, 1);
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(900);
	});

	test('Payment date is in the following year', () => {
		const util = new CurrentAmountUtil();
		util.setToday(new Date(2023, Month.OCTOBER, 22));

		const account = createAccountWithSinglePaymentExpense(Month.MAY, 1);
		const amount = util.getCurrentAmmount(account);
		expect(amount).toBe(500);
	});

	test('Payment date is tomorrow', () => {
		const util = new CurrentAmountUtil();
		util.setToday(new Date(2023, Month.OCTOBER, 31));

		const account = createAccountWithSinglePaymentExpense(Month.NOVEMBER, 1);
		const amount = util.getCurrentAmmount(account);
		expect(amount).toBe(1100);
	});

	test('Payment date is in exactly one year', () => {
		const util = new CurrentAmountUtil();
		util.setToday(new Date(2023, Month.OCTOBER, 10));

		const account = createAccountWithSinglePaymentExpense(Month.OCTOBER, 10);
		const amount = util.getCurrentAmmount(account);
		expect(amount).toBe(0);
	});

	test('Half-yearly expense', () => {
		const paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: 1,
				month: Month.JANUARY,
				dayOfMonth: 1,
				userId: userIds
			}),
			new PaymentDate({ id: 2, expenseId: 1, month: Month.JULY, dayOfMonth: 1, userId: userIds })
		];

		const account = createAccountWithPaymentDates(600, paymentDates);
		const util = new CurrentAmountUtil();

		util.setToday(new Date(2023, Month.JANUARY, 1));
		let amount = util.getCurrentAmmount(account);
		expect(amount).toBe(0);

		util.setToday(new Date(2023, Month.FEBRUARY, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(100);

		util.setToday(new Date(2023, Month.JUNE, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(500);

		util.setToday(new Date(2023, Month.JULY, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(0);

		util.setToday(new Date(2023, Month.AUGUST, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(100);
	});

	test('Quarterly expense', () => {
		const paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: 1,
				month: Month.JANUARY,
				dayOfMonth: 1,
				userId: userIds
			}),
			new PaymentDate({ id: 1, expenseId: 1, month: Month.APRIL, dayOfMonth: 1, userId: userIds }),
			new PaymentDate({ id: 2, expenseId: 1, month: Month.JULY, dayOfMonth: 1, userId: userIds }),
			new PaymentDate({ id: 2, expenseId: 1, month: Month.OCTOBER, dayOfMonth: 1, userId: userIds })
		];

		const account = createAccountWithPaymentDates(500, paymentDates);
		const util = new CurrentAmountUtil();

		util.setToday(new Date(2023, Month.JANUARY, 1));
		let amount = util.getCurrentAmmount(account);
		expect(amount).toBe(0);

		util.setToday(new Date(2023, Month.FEBRUARY, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(167);

		util.setToday(new Date(2023, Month.JUNE, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(334);
	});

	test('Multiple expenses', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);
		const expense1 = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 1200,
				tag: 'Test',
				accountId: account.id,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);
		const expense2 = new Expense(
			{
				id: 2,
				name: 'Test',
				amount: 600,
				tag: 'Test',
				accountId: account.id,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense1.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense1.id,
				month: Month.OCTOBER,
				dayOfMonth: 1,
				userId: userIds
			})
		];

		expense2.paymentDates = [
			new PaymentDate({
				id: 2,
				expenseId: expense2.id,
				month: Month.MARCH,
				dayOfMonth: 1,
				userId: userIds
			}),
			new PaymentDate({
				id: 3,
				expenseId: expense2.id,
				month: Month.SEPTEMBER,
				dayOfMonth: 1,
				userId: userIds
			})
		];

		account.expenses = [expense1, expense2];

		const util = new CurrentAmountUtil();

		util.setToday(new Date(2023, Month.JANUARY, 1));
		let amount = util.getCurrentAmmount(account);
		expect(amount).toBe(700);

		util.setToday(new Date(2023, Month.FEBRUARY, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(900);

		util.setToday(new Date(2023, Month.MARCH, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(500);

		util.setToday(new Date(2023, Month.APRIL, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(700);

		util.setToday(new Date(2023, Month.MAY, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(900);

		util.setToday(new Date(2023, Month.JUNE, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(1100);

		util.setToday(new Date(2023, Month.JULY, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(1300);

		util.setToday(new Date(2023, Month.AUGUST, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(1500);

		util.setToday(new Date(2023, Month.SEPTEMBER, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(1100);

		util.setToday(new Date(2023, Month.OCTOBER, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(100);

		util.setToday(new Date(2023, Month.NOVEMBER, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(300);

		util.setToday(new Date(2023, Month.DECEMBER, 1));
		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(500);
	});

	test('Payment date is last day of month', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);

		const expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 1200,
				tag: 'Tag',
				accountId: account.id,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense.id,
				month: Month.JUNE,
				dayOfMonth: 30,
				userId: userIds
			})
		];

		account.expenses = [expense];

		const util = new CurrentAmountUtil();
		util.setToday(new Date(2023, Month.JUNE, 1));
		const amount = util.getCurrentAmmount(account);
		expect(amount).toBe(1200);
	});

	test('Shared expenses and own expenses are handled the same way', () => {
		const util = new CurrentAmountUtil();
		util.setToday(new Date(2023, Month.JANUARY, 1));
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);

		/*
         Own expense
         */
		let expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 1200,
				tag: 'Tag',
				accountId: account.id,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense.id,
				month: Month.APRIL,
				dayOfMonth: 1,
				userId: userIds
			})
		];

		account.expenses = [expense];

		let amount = util.getCurrentAmmount(account);
		expect(amount).toBe(900);

		/*
         Shared expense
         */
		expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 1200,
				tag: 'Tag',
				accountId: account.id,
				isEnabled: true,
				isShared: true,
				userId: userIds
			},
			[]
		);

		expense.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense.id,
				month: Month.APRIL,
				dayOfMonth: 1,
				userId: userIds
			})
		];

		account.expenses = [expense];

		amount = util.getCurrentAmmount(account);
		expect(amount).toBe(900);
	});
});

describe('Tests for getNextPaymentDate', () => {
	test('An account with no expenses', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);

		const util = new CurrentAmountUtil();
		const paymentDate = util.getNextPaymentDate(account);
		expect(paymentDate).toBe(null);
	});

	test('Disabled expenses are not included', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);
		const expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: account.id,
				isEnabled: false,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense.id,
				month: Month.FEBRUARY,
				dayOfMonth: 1,
				userId: userIds
			})
		];

		account.expenses = [expense];

		const util = new CurrentAmountUtil();
		util.setToday(new Date(2023, Month.JUNE, 1));
		const paymentDate = util.getNextPaymentDate(account);
		expect(paymentDate).toBe(null);
	});

	test('Monthly expense', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);

		account.expenses = [
			new Expense(
				{
					id: 1,
					name: 'Test',
					amount: 100,
					tag: 'Tag',
					accountId: account.id,
					isEnabled: true,
					isShared: false,
					userId: userIds
				},
				[]
			)
		];

		const util = new CurrentAmountUtil();
		util.setToday(new Date(2023, Month.JUNE, 1));
		const paymentDate = util.getNextPaymentDate(account);
		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2023);
		expect(paymentDate.getMonth()).toBe(Month.JULY);
		expect(paymentDate.getDate()).toBe(1);
	});

	test('Two expenses, only one is enabled', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);
		const expense1 = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: account.id,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);
		const expense2 = new Expense(
			{
				id: 2,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: account.id,
				isEnabled: false,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense1.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense1.id,
				month: Month.MARCH,
				dayOfMonth: 1,
				userId: userIds
			})
		];

		expense2.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense2.id,
				month: Month.FEBRUARY,
				dayOfMonth: 1,
				userId: userIds
			})
		];

		account.expenses = [expense1, expense2];

		const util = new CurrentAmountUtil();
		util.setToday(new Date(2023, Month.JANUARY, 1));
		const paymentDate = util.getNextPaymentDate(account);
		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2023);
		expect(paymentDate.getMonth()).toBe(Month.MARCH);
		expect(paymentDate.getDate()).toBe(1);
	});

	test('Two expenses', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);
		const expense1 = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: account.id,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);
		const expense2 = new Expense(
			{
				id: 2,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: account.id,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense1.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense1.id,
				month: Month.MARCH,
				dayOfMonth: 1,
				userId: userIds
			})
		];

		expense2.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense2.id,
				month: Month.FEBRUARY,
				dayOfMonth: 1,
				userId: userIds
			})
		];

		account.expenses = [expense1, expense2];

		const util = new CurrentAmountUtil();
		util.setToday(new Date(2023, Month.JANUARY, 1));
		const paymentDate = util.getNextPaymentDate(account);
		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2023);
		expect(paymentDate.getMonth()).toBe(Month.FEBRUARY);
		expect(paymentDate.getDate()).toBe(1);
	});

	test('Two expenses, one is next year', () => {
		const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);
		const expense1 = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: account.id,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);
		const expense2 = new Expense(
			{
				id: 2,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: account.id,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense1.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense1.id,
				month: Month.APRIL,
				dayOfMonth: 1,
				userId: userIds
			})
		];

		expense2.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense2.id,
				month: Month.JANUARY,
				dayOfMonth: 1,
				userId: userIds
			})
		];

		account.expenses = [expense1, expense2];

		const util = new CurrentAmountUtil();
		util.setToday(new Date(2023, Month.JANUARY, 1));
		const paymentDate = util.getNextPaymentDate(account);
		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2023);
		expect(paymentDate.getMonth()).toBe(Month.APRIL);
		expect(paymentDate.getDate()).toBe(1);
	});
});

describe('Tests for getNextPaymentDateForExpense', () => {
	test('Monthly expense', () => {
		const expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: 1,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		const util = new CurrentAmountUtil();
		util.setToday(new Date(2023, Month.JUNE, 1));
		const paymentDate = util.getNextPaymentDateForExpense(expense);
		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2023);
		expect(paymentDate.getMonth()).toBe(Month.JULY);
		expect(paymentDate.getDate()).toBe(1);
	});

	test('Monthly expense in december', () => {
		const expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: 1,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		const util = new CurrentAmountUtil();
		util.setToday(new Date(2023, Month.DECEMBER, 1));
		const paymentDate = util.getNextPaymentDateForExpense(expense);
		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2024);
		expect(paymentDate.getMonth()).toBe(Month.JANUARY);
		expect(paymentDate.getDate()).toBe(1);
	});

	test('Yearly expense', () => {
		const expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: 1,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense.id,
				month: Month.MAY,
				dayOfMonth: 1,
				userId: userIds
			})
		];

		const util = new CurrentAmountUtil();
		util.setToday(new Date(2023, Month.MARCH, 1));
		const paymentDate = util.getNextPaymentDateForExpense(expense);
		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2023);
		expect(paymentDate.getMonth()).toBe(Month.MAY);
		expect(paymentDate.getDate()).toBe(1);
	});

	test('Yearly expense, next year', () => {
		const expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: 1,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense.id,
				month: Month.MAY,
				dayOfMonth: 1,
				userId: userIds
			})
		];

		const util = new CurrentAmountUtil();
		util.setToday(new Date(2023, Month.MAY, 1));
		const paymentDate = util.getNextPaymentDateForExpense(expense);
		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2024);
		expect(paymentDate.getMonth()).toBe(Month.MAY);
		expect(paymentDate.getDate()).toBe(1);
	});

	test('Half-yearly expense', () => {
		const expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: 1,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense.id,
				month: Month.MAY,
				dayOfMonth: 1,
				userId: userIds
			}),
			new PaymentDate({
				id: 2,
				expenseId: expense.id,
				month: Month.JULY,
				dayOfMonth: 1,
				userId: userIds
			})
		];

		const util = new CurrentAmountUtil();
		util.setToday(new Date(2023, Month.MAY, 1));
		const paymentDate = util.getNextPaymentDateForExpense(expense);
		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2023);
		expect(paymentDate.getMonth()).toBe(Month.JULY);
		expect(paymentDate.getDate()).toBe(1);
	});

	test('Yearly expense, last day of month', () => {
		const expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: 1,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		expense.paymentDates = [
			new PaymentDate({
				id: 1,
				expenseId: expense.id,
				month: Month.AUGUST,
				dayOfMonth: 31,
				userId: userIds
			})
		];

		const util = new CurrentAmountUtil();
		util.setToday(new Date(2023, Month.AUGUST, 1));
		const paymentDate = util.getNextPaymentDateForExpense(expense);
		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2023);
		expect(paymentDate.getMonth()).toBe(Month.AUGUST);
		expect(paymentDate.getDate()).toBe(31);
	});
});

describe('Test for getNextPaymentDateForExpenseAfter', () => {
	test('Monthly expense', () => {
		const expense = new Expense(
			{
				id: 1,
				name: 'Test',
				amount: 100,
				tag: 'Tag',
				accountId: 1,
				isEnabled: true,
				isShared: false,
				userId: userIds
			},
			[]
		);

		const util = new CurrentAmountUtil();
		const date = new Date(2023, Month.JUNE, 1);
		const paymentDate = util.getNextPaymentDateForExpenseAfter(expense, date);

		if (paymentDate == null) {
			throw Error('Should have found a payment date');
		}

		expect(paymentDate.getFullYear()).toBe(2023);
		expect(paymentDate.getMonth()).toBe(Month.JULY);
		expect(paymentDate.getDate()).toBe(1);
	});
});

describe('Test for getAccountBalanceOn', () => {
	test('Monthly expense', () => {
		const account = new Account({ id: 0, name: 'name', userId: userIds }, []);

		account.expenses = [
			createExpenseOn(100, []),
			createExpenseOn(1200, [Month.JANUARY]), //1100
			createExpenseOn(600, [Month.JANUARY, Month.JULY]), //500
			createExpenseOn(300, [Month.FEBRUARY, Month.MAY, Month.AUGUST, Month.NOVEMBER]) //100
		];

		const util = new CurrentAmountUtil();
		let amount = util.getAccountBalanceOn(account, new Date(2023, Month.JANUARY, 1));
		expect(amount).toBe(200);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.FEBRUARY, 1));
		expect(amount).toBe(200);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.MARCH, 1));
		expect(amount).toBe(500);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.APRIL, 1));
		expect(amount).toBe(800);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.MAY, 1));
		expect(amount).toBe(800);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.JUNE, 1));
		expect(amount).toBe(1100);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.JULY, 1));
		expect(amount).toBe(800);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.AUGUST, 1));
		expect(amount).toBe(800);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.SEPTEMBER, 1));
		expect(amount).toBe(1100);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.OCTOBER, 1));
		expect(amount).toBe(1400);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.NOVEMBER, 1));
		expect(amount).toBe(1400);

		amount = util.getAccountBalanceOn(account, new Date(2023, Month.DECEMBER, 1));
		expect(amount).toBe(1700);
	});
});

function createExpenseOn(amount: number, months: Month[]) {
	const expense = new Expense(
		{
			id: 0,
			name: 'Test',
			amount: amount,
			tag: 'tag',
			accountId: 0,
			isEnabled: true,
			isShared: false,
			userId: userIds
		},
		[]
	);

	for (let i = 0; i < months.length; i++) {
		expense.addPaymentDate(
			new PaymentDate({
				id: 0,
				expenseId: expense.id,
				month: months[i],
				dayOfMonth: 1,
				userId: userIds
			})
		);
	}

	return expense;
}

function createAccountWithSinglePaymentExpense(month: Month, dayOfMonth: number) {
	const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);
	const expense = new Expense(
		{
			id: 1,
			name: 'Test',
			amount: 1200,
			tag: 'Test',
			accountId: account.id,
			isEnabled: true,
			isShared: false,
			userId: userIds
		},
		[]
	);

	expense.paymentDates = [
		new PaymentDate({
			id: 1,
			expenseId: expense.id,
			month: month,
			dayOfMonth: dayOfMonth,
			userId: userIds
		})
	];

	account.expenses = [expense];

	return account;
}

function createAccountWithPaymentDates(amount: number, paymentDates: PaymentDate[]) {
	const account = new Account({ id: 1, name: 'Test', userId: userIds }, []);

	const expense = new Expense(
		{
			id: 1,
			name: 'Test',
			amount: amount,
			tag: 'Test',
			accountId: account.id,
			isEnabled: true,
			isShared: false,
			userId: userIds
		},
		[]
	);

	expense.paymentDates = paymentDates;
	account.expenses = [expense];

	return account;
}
