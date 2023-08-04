import { expect, test } from 'vitest'
import { CurrentAmountUtil } from '$lib/util/CurrentAmountUtil';
import { Account } from '$lib/models/Account';
import { Expense } from '$lib/models/Expense';

test('Monthly expenses are not included', () => {
    const account = new Account(1, "Test");
    
    account.setExpenses([
        new Expense(1, "Test", 123, 1, "Test", 1, true)
    ]);

    const amount = CurrentAmountUtil.getCurrentAmmount(account)
    expect(amount).toBe(0)
})