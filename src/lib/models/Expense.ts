import type { ExpenseRecord } from '$lib/server/tables/ExpensesTable';
import { PaymentDate } from './PaymentDate';

export class Expense {
	private readonly record: ExpenseRecord;
	private _paymentDates: PaymentDate[];

	constructor(record: ExpenseRecord, paymentDates: PaymentDate[]) {
		this.record = record;
		this.record.amount = +this.record.amount;
		this._paymentDates = paymentDates;
	}

	public get id() {
		return this.record.id;
	}

	public get name() {
		return this.record.name;
	}

	public get amount() {
		return this.record.amount;
	}

	public get monthlyAmount() {
		return this.calculateMonthlyAmount(true);
	}

	public get monthlyAmountWithTotalShared() {
		return this.calculateMonthlyAmount(false);
	}

	private calculateMonthlyAmount(divideShared: boolean) {
		const amount = divideShared && this.isShared ? this.amount / 2 : this.amount;
		if (this.isMonthlyExpense) {
			return amount;
		}

		const numberOfTransfers = 12 / this.paymentDates.length;
		return amount / numberOfTransfers;
	}

	public get isMonthlyExpense() {
		const numberOfDates = this.paymentDates.length;
		return numberOfDates === 0 || numberOfDates === 12;
	}

	public get tag() {
		return this.record.tag;
	}

	public get accountId() {
		return this.record.accountId;
	}

	public get isEnabled() {
		return this.record.isEnabled;
	}

	public get isShared() {
		return this.record.isShared;
	}

	public set isShared(value: boolean) {
		this.record.isShared = value;
	}

	public get paymentDates() {
		return this._paymentDates;
	}

	public set paymentDates(paymentDates: PaymentDate[]) {
		this._paymentDates = paymentDates;
	}

	public addPaymentDate(paymentDate: PaymentDate) {
		this._paymentDates.push(paymentDate);
	}

	public get userIds() {
		return this.record.userId;
	}
}
