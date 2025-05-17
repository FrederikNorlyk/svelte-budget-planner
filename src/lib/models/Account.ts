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

	public get expenses() {
		return this._expenses;
	}

	public set expenses(expenses: Expense[]) {
		this._expenses = expenses;
	}

	public get monthlyAmount(): number {
		let amount = 0;

		this.expenses.forEach((expense) => {
			if (!expense.isEnabled) {
				return;
			}
			amount += expense.monthlyAmount;
		});

		return amount;
	}
}
