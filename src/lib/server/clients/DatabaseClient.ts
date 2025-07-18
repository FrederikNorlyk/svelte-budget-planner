import { DB_TABLE_PREFIX, POSTGRES_URL } from '$env/static/private';
import { type Database } from '$lib/server/tables/Database';
import { CamelCasePlugin, Kysely } from 'kysely';
import { NeonDialect } from 'kysely-neon';
import { TablePrefixPlugin } from 'kysely-plugin-prefix';

/**
 * Abstract class for clients used to query the database.
 */
export abstract class DatabaseClient {
	private readonly userId: string;
	private readonly database;

	/**
	 * Constructor.
	 *
	 * @param userId id of the current user
	 */
	constructor(userId: string) {
		this.database = new Kysely<Database>({
			dialect: new NeonDialect({
				connectionString: POSTGRES_URL
			})
		})
			.withPlugin(new CamelCasePlugin())
			.withPlugin(new TablePrefixPlugin({ prefix: DB_TABLE_PREFIX }));

		this.userId = userId;
	}

	/**
	 * Get the database.
	 *
	 * @returns database
	 */
	protected getDatabase() {
		return this.database;
	}

	/**
	 * Get the id of the current user.
	 *
	 * @returns id of the current user
	 */
	protected getUserId() {
		return this.userId;
	}
}
