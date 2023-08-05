import { expect, test } from 'vitest'
import { CurrentAmountUtil } from '$lib/util/CurrentAmountUtil';
import { Account } from '$lib/models/Account';
import { Expense } from '$lib/models/Expense';
import { PaymentDate } from '$lib/models/PaymentDate';

test('Monthly expenses are not included', () => {
    const account = new Account(1, "Test");
    
    account.setExpenses([
        new Expense(1, "Test", 123, 1, "Test", 1, true)
    ]);

    const util = new CurrentAmountUtil();
    const amount = util.getCurrentAmmount(account)
    expect(amount).toBe(0)
})

test('Disabled expenses are not included', () => {
    const account = new Account(1, "Test");
    const expense = new Expense(1, "Test", 100, 12, "Test", account.getId(), false);
    
    expense.setPaymentDates([
        new PaymentDate(1, expense.getId(), 1, 2)
    ])

    account.setExpenses([
        expense
    ]);

    const util = new CurrentAmountUtil();
    util.setToday(new Date(2023, 0, 1))
    const amount = util.getCurrentAmmount(account)
    expect(amount).toBe(0)
})

test('Expenses without payment dates are not included', () => {
    const account = new Account(1, "Test");
    const expense = new Expense(1, "Test", 100, 12, "Test", account.getId(), true);

    account.setExpenses([
        expense
    ]);

    const util = new CurrentAmountUtil();
    const amount = util.getCurrentAmmount(account)
    expect(amount).toBe(0)
})

test('Expense with a single payment date', () => {
    const util = new CurrentAmountUtil();
    util.setToday(new Date(2023, 0, 1));

    let account = createAccountWithSinglePaymentExpense(1200, 2)
    let amount = util.getCurrentAmmount(account)
    expect(amount).toBe(1100)
  
    account = createAccountWithSinglePaymentExpense(1200, 3)
    amount = util.getCurrentAmmount(account)
    expect(amount).toBe(1000)
  
    account = createAccountWithSinglePaymentExpense(1200, 4)
    amount = util.getCurrentAmmount(account)
    expect(amount).toBe(900)
})

test('Payment date is in the following year', () => {
    const util = new CurrentAmountUtil();
    util.setToday(new Date(2023, 9, 22));

    const account = createAccountWithSinglePaymentExpense(1200, 5)
    const amount = util.getCurrentAmmount(account)
    expect(amount).toBe(500)
})

function createAccountWithSinglePaymentExpense(amount: number, month: number) {
    const account = new Account(1, "Test");
    const expense = new Expense(1, "Test", amount, 12, "Test", account.getId(), true);
    
    expense.setPaymentDates([
        new PaymentDate(1, expense.getId(), 1, month)
    ])

    account.setExpenses([
        expense
    ]);

    return account;
}