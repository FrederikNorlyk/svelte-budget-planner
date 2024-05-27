import { DatabaseRecord } from './DatabaseRecord';

/**
 * A record for storing user settings.
 */
export class Settings extends DatabaseRecord {
	private locale: string;
	private income: number;
	private partnerId: string | null;

	constructor(id: number, locale: string, income: number, partnerId: string | null) {
		super(id);

		this.locale = locale;
		this.income = income;
		this.partnerId = partnerId;
	}

	public getIncome() {
		return this.income;
	}

	public setIncome(income: number) {
		this.income = income;
	}

	public getLocale() {
		return this.locale;
	}

	public getPartnerId() {
		return this.partnerId;
	}

	public serialize() {
		return JSON.stringify({
			id: this.getId(),
			locale: this.getLocale(),
			income: this.getIncome(),
			partherId: this.getPartnerId()
		});
	}

	public static parse(json: string) {
		const parsed = JSON.parse(json);
		return new Settings(parsed.id, parsed.locale, parsed.income, parsed.partnerId);
	}
}
