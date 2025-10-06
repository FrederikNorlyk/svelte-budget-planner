import type { paymentDates } from '$lib/server/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

export class PaymentDate {
	private readonly record: InferSelectModel<typeof paymentDates>;

	constructor(record: InferSelectModel<typeof paymentDates>) {
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
		return this.record.userIds;
	}
}
