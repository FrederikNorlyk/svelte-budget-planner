import { DatabaseClient } from '$lib/clients/DatabaseClient';
import { Settings } from '$lib/models/Settings';
import type { InsertableSettingsRecord } from '$lib/tables/SettingsTable';

/**
 * Client for querying payment dates in the database.
 */
export class SettingsClient extends DatabaseClient {
	/**
	 * Create a new settings entry.
	 *
	 * @param settings the settings entry to create
	 * @returns the newly created settings entry
	 */
	private async create(settings: InsertableSettingsRecord): Promise<Settings> {
		const record = await this.getDatabase()
			.insertInto('settings')
			.values(settings)
			.returningAll()
			.executeTakeFirstOrThrow();

		return new Settings(record);
	}

	public async updateIncome(id: number, income: number): Promise<Settings> {
		const record = await this.getDatabase()
			.updateTable('settings')
			.set({ income: income })
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirstOrThrow();

		return new Settings(record);
	}

	/**
	 * Gets the settings entry for the given user.
	 *
	 * @returns settings entry for the given user
	 */
	public async getForCurrentUser(): Promise<Settings> {
		let settings = await this.get();

		if (!settings) {
			//TODO: This should probably be done on in auth.ts.
			settings = await this.create({
				income: 0,
				locale: 'en',
				userId: this.getUserId()
			});

			settings = await this.get();
		}

		if (settings == null) {
			throw Error('Something went wrong');
		}

		return new Settings(settings);
	}

	private async get(): Promise<Settings | null> {
		const record = await this.getDatabase()
			.selectFrom('settings')
			.selectAll()
			.where('userId', '=', this.getUserId())
			.executeTakeFirst();

		if (!record) {
			return null;
		}

		return new Settings(record);
	}
}
