import { POSTGRES_URL } from "$env/static/private"
import type { DatabaseRecord } from "$lib/models/DatabaseRecord"
import { createPool, type QueryResultRow } from "@vercel/postgres"

/**
 * Abstract class for clients used to query the database.
 */
export abstract class DatabaseClient<T extends DatabaseRecord> {

    private pool
    private userId

    /**
     * Constructor.
     * 
     * @param userId id of the current user
     */
    constructor(userId: number) {
        this.pool = createPool({
            connectionString: POSTGRES_URL
        })

        this.userId = userId
    }

    /**
     * Get the database pool.
     * 
     * @returns database pool
     */
    protected getPool() {
        return this.pool;
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
     * Returns the name of the table to query.
     */
    protected abstract getTableName(): string

    /**
     * Parses a query result row into a database record.
     * 
     * @param row a row returned by a query
     */
    protected abstract parse(row: QueryResultRow): T

    /**
     * Gets a database record with the given id.
     * 
     * @param id id of the database record
     * @returns record with the given id
     */
    public async getById(id: number) {
        const result = await this.pool.query(`SELECT * FROM ${this.getTableName()} WHERE id = ${id}`)

        if (result.rows.length == 0) {
            return null
        }

        const row = result.rows[0]
        return this.parse(row)
    }

    /**
     * List all records for the current user.
     * 
     * @returns all records for the current user
     */
    public async listAll() {
        const result = await this.pool.query(`SELECT * FROM ${this.getTableName()} WHERE user_id = ${this.userId}`)

        return result.rows.map((row) => this.parse(row))
    }
}