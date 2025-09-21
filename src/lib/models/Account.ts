import type { AccountRecord } from '$lib/server/tables/AccountsTable';
import { Expense } from './Expense';

export class Account {
	private readonly record: AccountRecord;
	private _expenses: Expense[];

	constructor(record: AccountRecord, expenses: Expense[]) {
		this.record = record;
		this._expenses = expenses;
	}

	public get id() {
		return this.record.id;
	}

	public get name() {
		return this.record.name;
	}

	public get userIds() {
		return this.record.userId;
	}

	public get isShared() {
		return this.userIds.length > 1;
	}

	public get expenses() {
		return this._expenses;
	}

	public set expenses(expenses: Expense[]) {
		this._expenses = expenses;
	}

	public get monthlyAmount(): number {
		return this.calculateMonthlyAmount(false);
	}

	public get monthlyAmountWithTotalShared(): number {
		return this.calculateMonthlyAmount(true);
	}

	private calculateMonthlyAmount(divideShared: boolean) {
		let amount = 0;

		this.expenses.forEach((expense) => {
			if (!expense.isEnabled) {
				return;
			}

			if (divideShared) {
				amount += expense.monthlyAmount;
			} else {
				amount += expense.monthlyAmountWithTotalShared;
			}
		});

		return amount;
	}
}
