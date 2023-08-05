import type { Account } from "$lib/models/Account";
import type { Expense } from "$lib/models/Expense";
import { DateUtil } from "./DateUtil";

/**
 * Utility for calculating the current amount that should be on an account, to avoid overdrawing. This is done using the 
 * account's expenses and their payment dates
 */
export class CurrentAmountUtil {

	private today = new Date();

	/**
	 * Function used for testing, to mock the current date.
	 * 
	 * @param date date to represent the current date
	 */
	public setToday(date: Date) {
		this.today = date;
	}

	constructor() {
		this.today.setHours(0);
		this.today.setMinutes(0);
		this.today.setSeconds(0);
		this.today.setMilliseconds(0);
	}

	/**
	 * Get the current amount that should be on the given account, to avoid overdrawing.
	 * 
	 * @param account the account to calculate the amount for
	 * @returns the amount that should currently be on the account
	 */
    public getCurrentAmmount(account: Account) {
		let currentAmount = 0;

		account.getExpenses().forEach((expense) => {
			if (!expense.isEnabled()) {
				return
			}

			if (expense.getPaymentDates().length === 0) {
				return;
			}

			const nextPaymentDate = this.getNextPaymentDateForExpense(expense)
			
			if (nextPaymentDate == null) {
				return
			}

			const remainingNumberOfTransfers = DateUtil.getMonthsBetween(this.today, nextPaymentDate)
			const monthlyAmount = expense.getMonthlyAmount()
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
	public getNextPaymentDate(account: Account) {
		let nextPaymentDate: Date | null = null;

		account.getExpenses().forEach((expense) => {
			if (!expense.isEnabled) {
				return
			}
			
			const expensePaymentDate = this.getNextPaymentDateForExpense(expense);

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
	public getNextPaymentDateForExpense(expense: Expense): Date | null {
		let nextPaymentDate: Date | null = null;
		const thisYear = this.today.getFullYear();

		if (expense.getPaymentDates().length === 0) {
			const nextMonth = this.today.getMonth() + 1;
			return new Date(thisYear, nextMonth, 1)
		}

		expense.getPaymentDates().forEach((paymentDate) => {
			const date = new Date(thisYear, paymentDate.getMonth(), paymentDate.getDayOfMonth());
			
			if (date <= this.today) {
				date.setFullYear(thisYear + 1)
			}

			if (nextPaymentDate == null || nextPaymentDate > date) {
				nextPaymentDate = date;
			}
		});

		return nextPaymentDate;
	}
}