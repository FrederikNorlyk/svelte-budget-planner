import { Settings } from '$lib/models/Settings';
import { DatabaseClient } from '$lib/server/clients/DatabaseClient';
import { settings } from '$lib/server/db/schema';
import { and, eq, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

/**
 * Client for querying payment dates in the database.
 */
export class SettingsClient extends DatabaseClient {
	/**
	 * Create a new settings entry.
	 *
	 * @param setting the settings entry to create
	 * @returns the newly created settings entry
	 */
	private async create(setting: InferInsertModel<typeof settings>): Promise<Settings> {
		const returned = await this.getDatabase().insert(settings).values(setting).returning();

		return new Settings(returned[0]);
	}

	public async update(id: number, setting: InferInsertModel<typeof settings>): Promise<Settings> {
		const returned = await this.getDatabase()
			.update(settings)
			.set(setting)
			.where(and(eq(settings.id, id), eq(settings.userId, this.getUserId())))
			.returning();

		return new Settings(returned[0]);
	}

	/**
	 * Gets the settings entry for the given user.
	 *
	 * @returns settings entry for the given user
	 */
	public async getForCurrentUser(): Promise<Settings> {
		let record = await this.get();

		if (!record) {
			//TODO: This should probably be done on in auth.ts.
			await this.create({
				income: 0,
				locale: 'en',
				userId: this.getUserId()
			});

			record = await this.get();
		}

		if (record == null) {
			throw Error('Something went wrong');
		}

		return new Settings(record);
	}

	private async get(): Promise<InferSelectModel<typeof settings> | null> {
		const records = await this.getDatabase()
			.select()
			.from(settings)
			.where(eq(settings.userId, this.getUserId()));

		if (records.length === 0) {
			return null;
		}

		return records[0];
	}
}
