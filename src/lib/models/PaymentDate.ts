import type { PaymentDateRecord } from '$lib/server/tables/PaymentDatesTable';

export class PaymentDate {
	private readonly record: PaymentDateRecord;

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

	public get userIds() {
		return this.record.userId;
	}
}
