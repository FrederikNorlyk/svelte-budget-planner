import type { settings } from '$lib/server/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

/**
 * A record for storing user settings.
 */
export class Settings {
	private readonly record: InferSelectModel<typeof settings>;

	constructor(record: InferSelectModel<typeof settings>) {
		this.record = record;
	}

	public get id() {
		return this.record.id;
	}

	public get income() {
		return +this.record.income;
	}

	public set income(value: number) {
		this.record.income = value;
	}

	public get locale() {
		return this.record.locale;
	}

	public get partnerId() {
		return this.record.partnerId;
	}

	public get userId() {
		return this.record.userId;
	}
}
