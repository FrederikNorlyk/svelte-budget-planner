import type { Account } from "$lib/models/Account";
import type { Expense } from "$lib/models/Expense";
import { Frequency } from "$lib/models/Frequency";
import { AmountUtil } from "$lib/util/AmountUtil";
import { DateUtil } from "./DateUtil";

/**
 * Utility for calculating the current amount that should be on an account, to avoid overdrawing. This is done using the 
 * account's expenses and their payment dates
 */
export class CurrentAmountUtil {

	/**
	 * Get the current amount that should be on the given account, to avoid overdrawing.
	 * 
	 * @param account the account to calculate the amount for
	 * @returns the amount that should currently be on the account
	 */
    public static getCurrentAmmount(account: Account) {
		let currentAmount = 0;

		account.getExpenses().forEach((expense) => {
			if (!expense.isEnabled) {
				return
			}

			if (expense.getFrequency() === Frequency.MONTHLY) {
				return
			}

			const nextPaymentDate = CurrentAmountUtil.getNextPaymentDateForExpense(expense)
			
			if (nextPaymentDate == null) {
				return
			}

			const today = new Date()
			const remainingNumberOfTransfers = Math.max(1, DateUtil.getMonthsBetween(today, nextPaymentDate))
			const monthlyAmount = expense.getAmount() / expense.getFrequencyNumber()
			const amountNotYetTransfered = monthlyAmount * remainingNumberOfTransfers
			currentAmount += (expense.getAmount() - amountNotYetTransfered)
		})

		return currentAmount;
	}

	/**
	 * Get the next date when a payment will occur on the given account
	 * 
	 * @param account the account to use when calculating the date
	 * @returns the next date from today when a payment will occur, or NULL
	 */
	public static getNextPaymentDate(account: Account) {
		let nextPaymentDate: Date | null = null;

		account.getExpenses().forEach((expense) => {
			if (!expense.isEnabled) {
				return
			}
			
			const expensePaymentDate = CurrentAmountUtil.getNextPaymentDateForExpense(expense);

			if (expensePaymentDate == null) {
				return;
			}

			if (nextPaymentDate == null || nextPaymentDate > expensePaymentDate) {
				nextPaymentDate = expensePaymentDate;
			}
		});

		return nextPaymentDate;
	}

	/**
	 * Get the next date when a payment will occur on the given expense
	 * 
	 * @param expense the expense to use when calculating the date
	 * @returns the next date from today when a payment will occur, or NULL
	 */
	public static getNextPaymentDateForExpense(expense: Expense): Date | null {
		let nextPaymentDate: Date | null = null;
		const today = new Date();
		const year = today.getFullYear();

		if (expense.getFrequency() === Frequency.MONTHLY) {
			return new Date(year, today.getMonth() + 1, 1)
		}

		expense.getPaymentDates().forEach((paymentDate) => {
			const date = new Date(year, paymentDate.getMonth() - 1, paymentDate.getDayOfMonth());
			if (date < today) {
				date.setFullYear(year + 1)
			}

			if (nextPaymentDate == null || nextPaymentDate > date) {
				nextPaymentDate = date;
			}
		});

		return nextPaymentDate;
	}
}