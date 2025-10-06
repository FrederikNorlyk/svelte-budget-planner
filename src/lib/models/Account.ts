import type { accounts, expenses } from '$lib/server/db/schema';
import type { InferSelectModel } from 'drizzle-orm';
import { Expense } from './Expense';

export class Account {
	private readonly record: InferSelectModel<typeof accounts>;
	private _expenses: Expense[];

	constructor(
		record: InferSelectModel<typeof accounts> & { expenses?: InferSelectModel<typeof expenses>[] }
	) {
		this.record = record;
		this._expenses = record.expenses?.map((expense) => new Expense(expense)) ?? [];
	}

	public get id() {
		return this.record.id;
	}

	public get name() {
		return this.record.name;
	}

	public get userIds() {
		return this.record.userIds;
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
		return this.calculateMonthlyAmount(true);
	}

	public get monthlyAmountWithTotalShared(): number {
		return this.calculateMonthlyAmount(false);
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
