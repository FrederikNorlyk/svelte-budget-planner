import { describe, expect, test } from 'vitest'
import { CurrentAmountUtil } from '$lib/util/CurrentAmountUtil'
import { Account } from '$lib/models/Account'
import { Expense } from '$lib/models/Expense'
import { PaymentDate } from '$lib/models/PaymentDate'
import { Month } from '$lib/enums/Month'

describe('Tests for getCurrentAmount', () => {
    test('Disabled expenses are not included', () => {
        const account = new Account(1, "Test")
        const expense = new Expense(1, "Test", 100, "Test", account.getId(), false, false)
    
        expense.setPaymentDates([
            new PaymentDate(1, expense.getId(), Month.FEBRUARY, 1)
        ])
    
        account.setExpenses([
            expense
        ])
    
        const util = new CurrentAmountUtil()
        util.setToday(new Date(2023, Month.JANUARY, 1))
        const amount = util.getCurrentAmmount(account)
        expect(amount).toBe(0)
    })
    
    test('Expenses without payment dates are not included', () => {
        const account = new Account(1, "Test")
    
        account.setExpenses([
            new Expense(1, "Test", 100, "Test", account.getId(), true, false)
        ])
    
        const util = new CurrentAmountUtil()
        const amount = util.getCurrentAmmount(account)
        expect(amount).toBe(0)
    })
    
    test('Expense with a single payment date', () => {
        const util = new CurrentAmountUtil()
        util.setToday(new Date(2023, Month.JANUARY, 1))
    
        let account = createAccountWithSinglePaymentExpense(Month.FEBRUARY, 1)
        let amount = util.getCurrentAmmount(account)
        expect(amount).toBe(1100)
    
        account = createAccountWithSinglePaymentExpense(Month.MARCH, 1)
        amount = util.getCurrentAmmount(account)
        expect(amount).toBe(1000)
    
        account = createAccountWithSinglePaymentExpense(Month.APRIL, 1)
        amount = util.getCurrentAmmount(account)
        expect(amount).toBe(900)
    })
    
    test('Payment date is in the following year', () => {
        const util = new CurrentAmountUtil()
        util.setToday(new Date(2023, Month.OCTOBER, 22))
    
        const account = createAccountWithSinglePaymentExpense(Month.MAY, 1)
        const amount = util.getCurrentAmmount(account)
        expect(amount).toBe(500)
    })
    
    test('Payment date is tomorrow', () => {
        const util = new CurrentAmountUtil()
        util.setToday(new Date(2023, Month.OCTOBER, 31))
    
        const account = createAccountWithSinglePaymentExpense(Month.NOVEMBER, 1)
        const amount = util.getCurrentAmmount(account)
        expect(amount).toBe(1100)
    })
    
    test('Payment date is in exactly one year', () => {
        const util = new CurrentAmountUtil()
        util.setToday(new Date(2023, Month.OCTOBER, 10))
    
        const account = createAccountWithSinglePaymentExpense(Month.OCTOBER, 10)
        const amount = util.getCurrentAmmount(account)
        expect(amount).toBe(0)
    })
    
    test('Half-yearly expense', () => {
        const paymentDates = [
            new PaymentDate(1, 1, Month.JANUARY, 1),
            new PaymentDate(2, 1, Month.JULY, 1),
        ]
    
        const account = createAccountWithPaymentDates(600, paymentDates)
        const util = new CurrentAmountUtil()
    
        util.setToday(new Date(2023, Month.JANUARY, 1))
        let amount = util.getCurrentAmmount(account)
        expect(amount).toBe(0)
    
        util.setToday(new Date(2023, Month.FEBRUARY, 1))
        amount = util.getCurrentAmmount(account)
        expect(amount).toBe(100)
    
        util.setToday(new Date(2023, Month.JUNE, 1))
        amount = util.getCurrentAmmount(account)
        expect(amount).toBe(500)
    
        util.setToday(new Date(2023, Month.JULY, 1))
        amount = util.getCurrentAmmount(account)
        expect(amount).toBe(0)
    
        util.setToday(new Date(2023, Month.AUGUST, 1))
        amount = util.getCurrentAmmount(account)
        expect(amount).toBe(100)
    })
    
    test('Quarterly expense', () => {
        const paymentDates = [
            new PaymentDate(1, 1, Month.JANUARY, 1),
            new PaymentDate(1, 1, Month.APRIL, 1),
            new PaymentDate(2, 1, Month.JULY, 1),
            new PaymentDate(2, 1, Month.OCTOBER, 1),
        ]
    
        const account = createAccountWithPaymentDates(500, paymentDates)
        const util = new CurrentAmountUtil()
    
        util.setToday(new Date(2023, Month.JANUARY, 1))
        let amount = util.getCurrentAmmount(account)
        expect(amount).toBe(0)
    
        util.setToday(new Date(2023, Month.FEBRUARY, 1))
        amount = util.getCurrentAmmount(account)
        expect(amount).toBe(167)
    
        util.setToday(new Date(2023, Month.JUNE, 1))
        amount = util.getCurrentAmmount(account)
        expect(amount).toBe(334)
    })
    
    test('Multiple expenses', () => {
        const account = new Account(1, "Test")
        const expense1 = new Expense(1, "Test", 1200, "Test", account.getId(), true, false)
        const expense2 = new Expense(2, "Test", 600, "Test", account.getId(), true, false)
    
        expense1.setPaymentDates([
            new PaymentDate(1, expense1.getId(), Month.OCTOBER, 1)
        ])
    
        expense2.setPaymentDates([
            new PaymentDate(2, expense2.getId(), Month.MARCH, 1),
            new PaymentDate(3, expense2.getId(), Month.SEPTEMBER, 1)
        ])
    
        account.setExpenses([expense1, expense2])
    
        const util = new CurrentAmountUtil()
    
        util.setToday(new Date(2023, Month.JANUARY, 1))
        let amount = util.getCurrentAmmount(account)
        expect(amount).toBe(700)
    
        util.setToday(new Date(2023, Month.FEBRUARY, 1))
        amount = util.getCurrentAmmount(account)
        expect(amount).toBe(900)
      
        util.setToday(new Date(2023, Month.MARCH, 1))
        amount = util.getCurrentAmmount(account)
        expect(amount).toBe(500)
      
        util.setToday(new Date(2023, Month.APRIL, 1))
        amount = util.getCurrentAmmount(account)
        expect(amount).toBe(700)
      
        util.setToday(new Date(2023, Month.MAY, 1))
        amount = util.getCurrentAmmount(account)
        expect(amount).toBe(900)
      
        util.setToday(new Date(2023, Month.JUNE, 1))
        amount = util.getCurrentAmmount(account)
        expect(amount).toBe(1100)
      
        util.setToday(new Date(2023, Month.JULY, 1))
        amount = util.getCurrentAmmount(account)
        expect(amount).toBe(1300)
      
        util.setToday(new Date(2023, Month.AUGUST, 1))
        amount = util.getCurrentAmmount(account)
        expect(amount).toBe(1500)
      
        util.setToday(new Date(2023, Month.SEPTEMBER, 1))
        amount = util.getCurrentAmmount(account)
        expect(amount).toBe(1100)
      
        util.setToday(new Date(2023, Month.OCTOBER, 1))
        amount = util.getCurrentAmmount(account)
        expect(amount).toBe(100)
      
        util.setToday(new Date(2023, Month.NOVEMBER, 1))
        amount = util.getCurrentAmmount(account)
        expect(amount).toBe(300)
      
        util.setToday(new Date(2023, Month.DECEMBER, 1))
        amount = util.getCurrentAmmount(account)
        expect(amount).toBe(500)
    })

    test('Payment date is last day of month', () => {
        const account = new Account(1, "Test")

        const expense = new Expense(1, "Test", 1200, "Tag", account.getId(), true, false)

        expense.setPaymentDates([
            new PaymentDate(1, expense.getId(), Month.JUNE, 30)
        ])

        account.setExpenses([expense])

        const util = new CurrentAmountUtil()
        util.setToday(new Date(2023, Month.JUNE, 1))
        const amount = util.getCurrentAmmount(account)
        expect(amount).toBe(1200)
    })

    test('Shared expenses and own expenses are handled the same way', () => {
        const util = new CurrentAmountUtil()
        util.setToday(new Date(2023, Month.JANUARY, 1))
        const account = new Account(1, "Test")

        /*
         Own expense
         */
        let expense = new Expense(1, "Test", 1200, "Tag", account.getId(), true, false)

        expense.setPaymentDates([
            new PaymentDate(1, expense.getId(), Month.APRIL, 1)
        ])

        account.setExpenses([expense])
        
        let amount = util.getCurrentAmmount(account)
        expect(amount).toBe(900)

        /*
         Shared expense
         */
        expense = new Expense(1, "Test", 1200, "Tag", account.getId(), true, true)

        expense.setPaymentDates([
            new PaymentDate(1, expense.getId(), Month.APRIL, 1)
        ])

        account.setExpenses([expense])

        amount = util.getCurrentAmmount(account)
        expect(amount).toBe(900)
    })
})

describe('Tests for getNextPaymentDate', () => {

    test('An account with no expenses', () => {
        const account = new Account(1, "Test")

        const util = new CurrentAmountUtil()
        const paymentDate = util.getNextPaymentDate(account)
        expect(paymentDate).toBe(null)
    })

    test('Disabled expenses are not included', () => {
        const account = new Account(1, "Test")
        const expense = new Expense(1, "Test", 100, "Tag", account.getId(), false, false)

        expense.setPaymentDates([
            new PaymentDate(1, expense.getId(), Month.FEBRUARY, 1), 
        ])

        account.setExpenses([expense])

        const util = new CurrentAmountUtil()
        util.setToday(new Date(2023, Month.JUNE, 1))
        const paymentDate = util.getNextPaymentDate(account)
        expect(paymentDate).toBe(null)
    })

    test('Monthly expense', () => {
        const account = new Account(1, "Test")

        account.setExpenses([
            new Expense(1, "Test", 100, "Tag", account.getId(), true, false)
        ])

        const util = new CurrentAmountUtil()
        util.setToday(new Date(2023, Month.JUNE, 1))
        const paymentDate = util.getNextPaymentDate(account)
        if (paymentDate == null) {
            throw Error("Should have found a payment date")
        }

        expect(paymentDate.getFullYear()).toBe(2023)
        expect(paymentDate.getMonth()).toBe(Month.JULY)
        expect(paymentDate.getDate()).toBe(1)
    })

    test('Two expenses, only one is enabled', () => {
        const account = new Account(1, "Test")
        const expense1 = new Expense(1, "Test", 100, "Tag", account.getId(), true, false)
        const expense2 = new Expense(2, "Test", 100, "Tag", account.getId(), false, false)

        expense1.setPaymentDates([
            new PaymentDate(1, expense1.getId(), Month.MARCH, 1), 
        ])
 
        expense2.setPaymentDates([
            new PaymentDate(1, expense2.getId(), Month.FEBRUARY, 1), 
        ])

        account.setExpenses([expense1, expense2])

        const util = new CurrentAmountUtil()
        util.setToday(new Date(2023, Month.JANUARY, 1))
        const paymentDate = util.getNextPaymentDate(account)
        if (paymentDate == null) {
            throw Error("Should have found a payment date")
        }

        expect(paymentDate.getFullYear()).toBe(2023)
        expect(paymentDate.getMonth()).toBe(Month.MARCH)
        expect(paymentDate.getDate()).toBe(1)
    })

    test('Two expenses', () => {
        const account = new Account(1, "Test")
        const expense1 = new Expense(1, "Test", 100, "Tag", account.getId(), true, false)
        const expense2 = new Expense(2, "Test", 100, "Tag", account.getId(), true, false)

        expense1.setPaymentDates([
            new PaymentDate(1, expense1.getId(), Month.MARCH, 1), 
        ])
 
        expense2.setPaymentDates([
            new PaymentDate(1, expense2.getId(), Month.FEBRUARY, 1), 
        ])

        account.setExpenses([expense1, expense2])

        const util = new CurrentAmountUtil()
        util.setToday(new Date(2023, Month.JANUARY, 1))
        const paymentDate = util.getNextPaymentDate(account)
        if (paymentDate == null) {
            throw Error("Should have found a payment date")
        }

        expect(paymentDate.getFullYear()).toBe(2023)
        expect(paymentDate.getMonth()).toBe(Month.FEBRUARY)
        expect(paymentDate.getDate()).toBe(1)
    })

    test('Two expenses, one is next year', () => {
        const account = new Account(1, "Test")
        const expense1 = new Expense(1, "Test", 100, "Tag", account.getId(), true, false)
        const expense2 = new Expense(2, "Test", 100, "Tag", account.getId(), true, false)

        expense1.setPaymentDates([
            new PaymentDate(1, expense1.getId(), Month.APRIL, 1), 
        ])
 
        expense2.setPaymentDates([
            new PaymentDate(1, expense2.getId(), Month.JANUARY, 1), 
        ])

        account.setExpenses([expense1, expense2])

        const util = new CurrentAmountUtil()
        util.setToday(new Date(2023, Month.JANUARY, 1))
        const paymentDate = util.getNextPaymentDate(account)
        if (paymentDate == null) {
            throw Error("Should have found a payment date")
        }

        expect(paymentDate.getFullYear()).toBe(2023)
        expect(paymentDate.getMonth()).toBe(Month.APRIL)
        expect(paymentDate.getDate()).toBe(1)
    })
})

describe('Tests for getNextPaymentDateForExpense', () => {

    test('Monthly expense', () => {
        const expense = new Expense(1, "Test", 100, "Tag", 1, true, false)

        const util = new CurrentAmountUtil()
        util.setToday(new Date(2023, Month.JUNE, 1))
        const paymentDate = util.getNextPaymentDateForExpense(expense)
        if (paymentDate == null) {
            throw Error("Should have found a payment date")
        }

        expect(paymentDate.getFullYear()).toBe(2023)
        expect(paymentDate.getMonth()).toBe(Month.JULY)
        expect(paymentDate.getDate()).toBe(1)
    })

    test('Monthly expense in december', () => {
        const expense = new Expense(1, "Test", 100, "Tag", 1, true, false)

        const util = new CurrentAmountUtil()
        util.setToday(new Date(2023, Month.DECEMBER, 1))
        const paymentDate = util.getNextPaymentDateForExpense(expense)
        if (paymentDate == null) {
            throw Error("Should have found a payment date")
        }

        expect(paymentDate.getFullYear()).toBe(2024)
        expect(paymentDate.getMonth()).toBe(Month.JANUARY)
        expect(paymentDate.getDate()).toBe(1)
    })

    test('Yearly expense', () => {
        const expense = new Expense(1, "Test", 100, "Tag", 1, true, false)

        expense.setPaymentDates([
            new PaymentDate(1, expense.getId(), Month.MAY, 1)
        ])

        const util = new CurrentAmountUtil()
        util.setToday(new Date(2023, Month.MARCH, 1))
        const paymentDate = util.getNextPaymentDateForExpense(expense)
        if (paymentDate == null) {
            throw Error("Should have found a payment date")
        }

        expect(paymentDate.getFullYear()).toBe(2023)
        expect(paymentDate.getMonth()).toBe(Month.MAY)
        expect(paymentDate.getDate()).toBe(1)
    })

    test('Yearly expense, next year', () => {
        const expense = new Expense(1, "Test", 100, "Tag", 1, true, false)

        expense.setPaymentDates([
            new PaymentDate(1, expense.getId(), Month.MAY, 1)
        ])

        const util = new CurrentAmountUtil()
        util.setToday(new Date(2023, Month.MAY, 1))
        const paymentDate = util.getNextPaymentDateForExpense(expense)
        if (paymentDate == null) {
            throw Error("Should have found a payment date")
        }

        expect(paymentDate.getFullYear()).toBe(2024)
        expect(paymentDate.getMonth()).toBe(Month.MAY)
        expect(paymentDate.getDate()).toBe(1)
    })

    test('Half-yearly expense', () => {
        const expense = new Expense(1, "Test", 100, "Tag", 1, true, false)

        expense.setPaymentDates([
            new PaymentDate(1, expense.getId(), Month.MAY, 1),
            new PaymentDate(2, expense.getId(), Month.JULY, 1),
        ])

        const util = new CurrentAmountUtil()
        util.setToday(new Date(2023, Month.MAY, 1))
        const paymentDate = util.getNextPaymentDateForExpense(expense)
        if (paymentDate == null) {
            throw Error("Should have found a payment date")
        }

        expect(paymentDate.getFullYear()).toBe(2023)
        expect(paymentDate.getMonth()).toBe(Month.JULY)
        expect(paymentDate.getDate()).toBe(1)
    })

    test('Yearly expense, last day of month', () => {
        const expense = new Expense(1, "Test", 100, "Tag", 1, true, false)

        expense.setPaymentDates([
            new PaymentDate(1, expense.getId(), Month.AUGUST, 31)
        ])

        const util = new CurrentAmountUtil()
        util.setToday(new Date(2023, Month.AUGUST, 1))
        const paymentDate = util.getNextPaymentDateForExpense(expense)
        if (paymentDate == null) {
            throw Error("Should have found a payment date")
        }

        expect(paymentDate.getFullYear()).toBe(2023)
        expect(paymentDate.getMonth()).toBe(Month.AUGUST)
        expect(paymentDate.getDate()).toBe(31)
    })
})

describe('Test for getNextPaymentDateForExpenseAfter', () => {
    test('Monthly expense', () => {
        const expense = new Expense(1, "Test", 100, "Tag", 1, true, false)

        const util = new CurrentAmountUtil()
        const date = new Date(2023, Month.JUNE, 1)
        const paymentDate = util.getNextPaymentDateForExpenseAfter(expense, date)

        if (paymentDate == null) {
            throw Error("Should have found a payment date")
        }

        expect(paymentDate.getFullYear()).toBe(2023)
        expect(paymentDate.getMonth()).toBe(Month.JULY)
        expect(paymentDate.getDate()).toBe(1)
    })
})

describe('Test for getAccountBalanceOn', () => {
    test('Monthly expense', () => {
        const account = new Account(0, "name")

        account.setExpenses([
            createExpenseOn(100, []),
            createExpenseOn(1200, [Month.JANUARY]), //1100
            createExpenseOn(600, [Month.JANUARY, Month.JULY]), //500
            createExpenseOn(300, [Month.FEBRUARY, Month.MAY, Month.AUGUST, Month.NOVEMBER]), //100
        ])

        const util = new CurrentAmountUtil()
        let amount = util.getAccountBalanceOn(account, new Date(2023, Month.JANUARY, 1))
        expect(amount).toBe(200)

        amount = util.getAccountBalanceOn(account, new Date(2023, Month.FEBRUARY, 1))
        expect(amount).toBe(200)

        amount = util.getAccountBalanceOn(account, new Date(2023, Month.MARCH, 1))
        expect(amount).toBe(500)

        amount = util.getAccountBalanceOn(account, new Date(2023, Month.APRIL, 1))
        expect(amount).toBe(800)

        amount = util.getAccountBalanceOn(account, new Date(2023, Month.MAY, 1))
        expect(amount).toBe(800)

        amount = util.getAccountBalanceOn(account, new Date(2023, Month.JUNE, 1))
        expect(amount).toBe(1100)

        amount = util.getAccountBalanceOn(account, new Date(2023, Month.JULY, 1))
        expect(amount).toBe(800)

        amount = util.getAccountBalanceOn(account, new Date(2023, Month.AUGUST, 1))
        expect(amount).toBe(800)

        amount = util.getAccountBalanceOn(account, new Date(2023, Month.SEPTEMBER, 1))
        expect(amount).toBe(1100)

        amount = util.getAccountBalanceOn(account, new Date(2023, Month.OCTOBER, 1))
        expect(amount).toBe(1400)

        amount = util.getAccountBalanceOn(account, new Date(2023, Month.NOVEMBER, 1))
        expect(amount).toBe(1400)

        amount = util.getAccountBalanceOn(account, new Date(2023, Month.DECEMBER, 1))
        expect(amount).toBe(1700)
    })
})

function createExpenseOn(amount: number, months: Month[]) {
    const expense = new Expense(0, "Test", amount, "tag", 0, true, false)

    for (let i = 0; i < months.length; i++) {
         expense.addPaymentDate(new PaymentDate(0, 0, months[i], 1))
    }

    return expense
}

function createAccountWithSinglePaymentExpense(month: Month, dayOfMonth: number) {
    const account = new Account(1, "Test")
    const expense = new Expense(1, "Test", 1200, "Test", account.getId(), true, false)

    expense.setPaymentDates([
        new PaymentDate(1, expense.getId(), month, dayOfMonth)
    ])

    account.setExpenses([expense])

    return account
}

function createAccountWithPaymentDates(amount: number, paymentDates: PaymentDate[]) {
    const account = new Account(1, "Test")
    const expense = new Expense(1, "Test", amount, "Test", account.getId(), true, false)

    expense.setPaymentDates(paymentDates)
    account.setExpenses([expense])

    return account
}