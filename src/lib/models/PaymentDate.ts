import type { PaymentDateRecord } from '$lib/tables/PaymentDatesTable';

export class PaymentDate {
	private record: PaymentDateRecord;

	constructor(record: PaymentDateRecord) {
		this.record = record;
	}

	public get id() {
		return this.record.id;
	}

	public get expenseId() {
		return this.record.expenseId;
	}

	public get month() {
		return this.record.month;
	}

	public get dayOfMonth() {
		return this.record.dayOfMonth;
	}

	public get userIds() {
		return this.record.userId;
	}

	public serialize() {
		return JSON.stringify({
			id: this.id,
			expenseId: this.expenseId,
			month: this.month,
			dayOfMonth: this.dayOfMonth,
			userIds: this.userIds
		});
	}

	public static parse(json: string) {
		const parsed = JSON.parse(json);

		return new PaymentDate({
			id: parsed.id,
			expenseId: parsed.expenseId,
			month: parsed.month,
			dayOfMonth: parsed.dayOfMonth,
			userId: parsed.userIds
		});
	}
}
