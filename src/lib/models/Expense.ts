import { DatabaseRecord } from '$lib/models/DatabaseRecord';
import { PaymentDate } from './PaymentDate';

export class Expense extends DatabaseRecord {
	private name: string;
	private amount: number;
	private shared: boolean;
	private tag: string | null;
	private accountId: number;
	private enabled: boolean;
	private paymentDates: PaymentDate[] = [];
	private userIds: string[];

	constructor(
		id: number,
		name: string,
		amount: number,
		tag: string | null | undefined,
		accountId: number,
		enabled: boolean,
		shared: boolean,
		userIds: string[]
	) {
		super(id);

		this.name = name;
		this.amount = amount;
		this.tag = tag === undefined ? null : tag;
		this.accountId = accountId;
		this.enabled = enabled;
		this.shared = shared;
		this.userIds = userIds;
	}

	public getName() {
		return this.name;
	}

	public getAmount() {
		return this.amount;
	}

	public getMonthlyAmount() {
		return this.calculateMontlyAmount(true);
	}

	public getMonthlyAmountWithTotalShared() {
		return this.calculateMontlyAmount(false);
	}

	private calculateMontlyAmount(divideShared: boolean) {
		const amount = divideShared && this.isShared() ? this.amount / 2 : this.amount;
		if (this.isMonthlyExpense()) {
			return amount;
		}

		const numberOfTransfers = 12 / this.getPaymentDates().length;
		return amount / numberOfTransfers;
	}

	public isMonthlyExpense() {
		const numberOfDates = this.getPaymentDates().length;
		return numberOfDates === 0 || numberOfDates === 12;
	}

	public getTag() {
		return this.tag;
	}

	public getAccountId() {
		return this.accountId;
	}

	public isEnabled() {
		return this.enabled;
	}

	public isShared() {
		return this.shared;
	}

	public getPaymentDates() {
		return this.paymentDates;
	}

	public setPaymentDates(paymentDates: PaymentDate[]) {
		this.paymentDates = paymentDates;
	}

	public addPaymentDate(paymentDate: PaymentDate) {
		this.paymentDates.push(paymentDate);
	}

	public getUserIds() {
		return this.userIds;
	}

	public serialize() {
		return JSON.stringify({
			id: this.getId(),
			name: this.getName(),
			amount: this.getAmount(),
			tag: this.getTag(),
			accountId: this.getAccountId(),
			enabled: this.isEnabled(),
			shared: this.isShared(),
			paymentDates: this.getPaymentDates().map((paymentDate) => paymentDate.serialize()),
			userIds: this.getUserIds()
		});
	}

	public static parse(json: string) {
		const parsed = JSON.parse(json);

		const expense = new Expense(
			parsed.id,
			parsed.name,
			parsed.amount,
			parsed.tag,
			parsed.accountId,
			parsed.enabled,
			parsed.shared,
			parsed.userIds
		);

		if (parsed.paymentDates) {
			expense.setPaymentDates(
				parsed.paymentDates.map((paymentDate: string) => PaymentDate.parse(paymentDate))
			);
		}

		return expense;
	}
}
