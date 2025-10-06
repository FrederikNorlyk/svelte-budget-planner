import { env } from '$env/dynamic/private';
import * as schema from '$lib/server/db/schema';
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';

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

	/**
	 * Creates a sql WHERE condition used to assert that the current user belongs to the queried row.
	 *
	 * @param column
	 * @protected
	 */
	protected isUserIn(column: AnyPgColumn) {
		return sql`${this.getUserId()} = ANY(${column})`;
	}
}
