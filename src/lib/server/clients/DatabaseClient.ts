import { env } from '$env/dynamic/private';
import * as schema from '$lib/server/db/schema';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

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
		const client = neon(env.NEON_DATABASE_URL);

		this.database = drizzle(client, { schema });
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
