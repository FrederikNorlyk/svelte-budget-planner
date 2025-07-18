import type { SettingsRecord } from '$lib/server/tables/SettingsTable';

/**
 * A record for storing user settings.
 */
export class Settings {
	private readonly record: SettingsRecord;

	constructor(record: SettingsRecord) {
		this.record = record;
		if (this.record.income != null) {
			this.record.income = +this.record.income;
		}
	}

	public get id() {
		return this.record.id;
	}

	public get income() {
		return this.record.income;
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
