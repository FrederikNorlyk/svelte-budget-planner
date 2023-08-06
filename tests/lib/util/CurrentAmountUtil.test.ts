import { describe, expect, test } from 'vitest'
import { CurrentAmountUtil } from '$lib/util/CurrentAmountUtil';
import { Account } from '$lib/models/Account';
import { Expense } from '$lib/models/Expense';
import { PaymentDate } from '$lib/models/PaymentDate';
import { Month } from '$lib/enums/Month';

describe('Tests for getCurrentAmount', () => {
    test('Disabled expenses are not included', () => {
        const account = new Account(1, "Test");
        const expense = new Expense(1, "Test", 100, "Test", account.getId(), false);
    
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
    
        account.setExpenses([
            new Expense(1, "Test", 100, "Test", account.getId(), true)
        ]);
    
        const util = new CurrentAmountUtil();
        const amount = util.getCurrentAmmount(account);
        expect(amount).toBe(0);
    })
    
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
    })
    
    test('Payment date is in the following year', () => {
        const util = new CurrentAmountUtil();
        util.setToday(new Date(2023, Month.OCTOBER, 22));
    
        const account = createAccountWithSinglePaymentExpense(Month.MAY, 1);
        const amount = util.getCurrentAmmount(account);
        expect(amount).toBe(500);
    })
    
    test('Payment date is tomorrow', () => {
        const util = new CurrentAmountUtil();
        util.setToday(new Date(2023, Month.OCTOBER, 31));
    
        const account = createAccountWithSinglePaymentExpense(Month.NOVEMBER, 1);
        const amount = util.getCurrentAmmount(account);
        expect(amount).toBe(1100);
    })
    
    test('Payment date is in exactly one year', () => {
        const util = new CurrentAmountUtil();
        util.setToday(new Date(2023, Month.OCTOBER, 10));
    
        const account = createAccountWithSinglePaymentExpense(Month.OCTOBER, 10);
        const amount = util.getCurrentAmmount(account);
        expect(amount).toBe(0);
    })
    
    test('Half-yearly expense', () => {
        const paymentDates = [
            new PaymentDate(1, 1, Month.JANUARY, 1),
            new PaymentDate(2, 1, Month.JULY, 1),
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
    })
    
    test('Quarterly expense', () => {
        const paymentDates = [
            new PaymentDate(1, 1, Month.JANUARY, 1),
            new PaymentDate(1, 1, Month.APRIL, 1),
            new PaymentDate(2, 1, Month.JULY, 1),
            new PaymentDate(2, 1, Month.OCTOBER, 1),
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
    })
    
    test('Multiple expenses', () => {
        const account = new Account(1, "Test");
        const expense1 = new Expense(1, "Test", 1200, "Test", account.getId(), true);
        const expense2 = new Expense(2, "Test", 600, "Test", account.getId(), true);
    
        expense1.setPaymentDates([
            new PaymentDate(1, expense1.getId(), Month.OCTOBER, 1)
        ])
    
        expense2.setPaymentDates([
            new PaymentDate(2, expense2.getId(), Month.MARCH, 1),
            new PaymentDate(3, expense2.getId(), Month.SEPTEMBER, 1)
        ])
    
        account.setExpenses([expense1, expense2]);
    
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
    })
})

describe('Tests for getNextPaymentDate', () => {

    test('No account with no expenses', () => {
        const account = new Account(1, "Test");

        const util = new CurrentAmountUtil();
        const paymentDate = util.getNextPaymentDate(account);
        expect(paymentDate).toBe(null);
    })

    test('Disabled expenses are not included', () => {
        const account = new Account(1, "Test");
        const expense = new Expense(1, "Test", 100, "Tag", account.getId(), false);

        expense.setPaymentDates([
            new PaymentDate(1, expense.getId(), Month.FEBRUARY, 1), 
        ]);

        account.setExpenses([expense])

        const util = new CurrentAmountUtil();
        const paymentDate = util.getNextPaymentDate(account);
        expect(paymentDate).toBe(null);
    })

    test('Monthly expense', () => {
        const account = new Account(1, "Test");

        account.setExpenses([
            new Expense(1, "Test", 100, "Tag", account.getId(), true)
        ])

        const util = new CurrentAmountUtil();
        util.setToday(new Date(2023, Month.JUNE, 1));
        const paymentDate = util.getNextPaymentDate(account);
        if (paymentDate == null) {
            throw Error("Should have found a payment date")
        }

        expect(paymentDate.getFullYear()).toBe(2023);
        expect(paymentDate.getMonth()).toBe(Month.JULY);
        expect(paymentDate.getDate()).toBe(1);
    })

    test('Two expenses, only one is enabled', () => {
        const account = new Account(1, "Test");
        const expense1 = new Expense(1, "Test", 100, "Tag", account.getId(), true);
        const expense2 = new Expense(2, "Test", 100, "Tag", account.getId(), false);

        expense1.setPaymentDates([
            new PaymentDate(1, expense1.getId(), Month.MARCH, 1), 
        ]);
 
        expense2.setPaymentDates([
            new PaymentDate(1, expense2.getId(), Month.FEBRUARY, 1), 
        ]);

        account.setExpenses([expense1, expense2]);

        const util = new CurrentAmountUtil();
        util.setToday(new Date(2023, Month.JANUARY, 1));
        const paymentDate = util.getNextPaymentDate(account);
        if (paymentDate == null) {
            throw Error("Should have found a payment date")
        }

        expect(paymentDate.getFullYear()).toBe(2023);
        expect(paymentDate.getMonth()).toBe(Month.MARCH);
        expect(paymentDate.getDate()).toBe(1);
    })

    test('Two expenses', () => {
        const account = new Account(1, "Test");
        const expense1 = new Expense(1, "Test", 100, "Tag", account.getId(), true);
        const expense2 = new Expense(2, "Test", 100, "Tag", account.getId(), true);

        expense1.setPaymentDates([
            new PaymentDate(1, expense1.getId(), Month.MARCH, 1), 
        ]);
 
        expense2.setPaymentDates([
            new PaymentDate(1, expense2.getId(), Month.FEBRUARY, 1), 
        ]);

        account.setExpenses([expense1, expense2]);

        const util = new CurrentAmountUtil();
        util.setToday(new Date(2023, Month.JANUARY, 1));
        const paymentDate = util.getNextPaymentDate(account);
        if (paymentDate == null) {
            throw Error("Should have found a payment date")
        }

        expect(paymentDate.getFullYear()).toBe(2023);
        expect(paymentDate.getMonth()).toBe(Month.FEBRUARY);
        expect(paymentDate.getDate()).toBe(1);
    })

    test('Two expenses, one is next year', () => {
        const account = new Account(1, "Test");
        const expense1 = new Expense(1, "Test", 100, "Tag", account.getId(), true);
        const expense2 = new Expense(2, "Test", 100, "Tag", account.getId(), true);

        expense1.setPaymentDates([
            new PaymentDate(1, expense1.getId(), Month.APRIL, 1), 
        ]);
 
        expense2.setPaymentDates([
            new PaymentDate(1, expense2.getId(), Month.JANUARY, 1), 
        ]);

        account.setExpenses([expense1, expense2]);

        const util = new CurrentAmountUtil();
        util.setToday(new Date(2023, Month.JANUARY, 1));
        const paymentDate = util.getNextPaymentDate(account);
        if (paymentDate == null) {
            throw Error("Should have found a payment date")
        }

        expect(paymentDate.getFullYear()).toBe(2023);
        expect(paymentDate.getMonth()).toBe(Month.APRIL);
        expect(paymentDate.getDate()).toBe(1);
    })
})

function createAccountWithSinglePaymentExpense(month: Month, dayOfMonth: number) {
    const account = new Account(1, "Test");
    const expense = new Expense(1, "Test", 1200, "Test", account.getId(), true);

    expense.setPaymentDates([
        new PaymentDate(1, expense.getId(), month, dayOfMonth)
    ])

    account.setExpenses([expense]);

    return account;
}

function createAccountWithPaymentDates(amount: number, paymentDates: PaymentDate[]) {
    const account = new Account(1, "Test");
    const expense = new Expense(1, "Test", amount, "Test", account.getId(), true);

    expense.setPaymentDates(paymentDates);
    account.setExpenses([expense]);

    return account;
}