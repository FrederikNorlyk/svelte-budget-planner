import { expect, test } from 'vitest'
import { CurrentAmountUtil } from '$lib/util/CurrentAmountUtil';
import { Account } from '$lib/models/Account';
import { Expense } from '$lib/models/Expense';
import { PaymentDate } from '$lib/models/PaymentDate';
import { Month } from '$lib/enums/Month';

test('Monthly expenses are not included', () => {
    const account = new Account(1, "Test");

    account.setExpenses([
        new Expense(1, "Test", 123, 1, "Test", 1, true)
    ]);

    const util = new CurrentAmountUtil();
    const amount = util.getCurrentAmmount(account);
    expect(amount).toBe(0);
})

test('Disabled expenses are not included', () => {
    const account = new Account(1, "Test");
    const expense = new Expense(1, "Test", 100, 12, "Test", account.getId(), false);

    expense.setPaymentDates([
        new PaymentDate(1, expense.getId(), Month.FEBRUARY, 1)
    ]);

    account.setExpenses([
        expense
    ]);

    const util = new CurrentAmountUtil();
    util.setToday(new Date(2023, Month.JANUARY, 1));
    const amount = util.getCurrentAmmount(account);
    expect(amount).toBe(0);
})

test('Expenses without payment dates are not included', () => {
    const account = new Account(1, "Test");
    const expense = new Expense(1, "Test", 100, 12, "Test", account.getId(), true);

    account.setExpenses([
        expense
    ]);

    const util = new CurrentAmountUtil();
    const amount = util.getCurrentAmmount(account);
    expect(amount).toBe(0);
})

test('Expense with a single payment date', () => {
    const util = new CurrentAmountUtil();
    util.setToday(new Date(2023, Month.JANUARY, 1));

    let account = createAccountWithSinglePaymentExpense(1200, Month.FEBRUARY);
    let amount = util.getCurrentAmmount(account);
    expect(amount).toBe(1100);

    account = createAccountWithSinglePaymentExpense(1200, Month.MARCH);
    amount = util.getCurrentAmmount(account);
    expect(amount).toBe(1000);

    account = createAccountWithSinglePaymentExpense(1200, Month.APRIL);
    amount = util.getCurrentAmmount(account);
    expect(amount).toBe(900);
})

test('Payment date is in the following year', () => {
    const util = new CurrentAmountUtil();
    util.setToday(new Date(2023, Month.OCTOBER, 22));

    const account = createAccountWithSinglePaymentExpense(1200, Month.MAY);
    const amount = util.getCurrentAmmount(account);
    expect(amount).toBe(500);
})

test('Payment date is tomorrow', () => {
    const util = new CurrentAmountUtil();
    util.setToday(new Date(2023, Month.OCTOBER, 31));

    const account = createAccountWithSinglePaymentExpense(1200, Month.NOVEMBER);
    const amount = util.getCurrentAmmount(account);
    expect(amount).toBe(1100);
})

function createAccountWithSinglePaymentExpense(amount: number, month: Month) {
    const account = new Account(1, "Test");
    const expense = new Expense(1, "Test", amount, 12, "Test", account.getId(), true);

    expense.setPaymentDates([
        new PaymentDate(1, expense.getId(), month, 1)
    ])

    account.setExpenses([
        expense
    ]);

    return account;
}