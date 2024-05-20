import { POSTGRES_URL } from "$env/static/private"
import type { DatabaseRecord } from "$lib/models/DatabaseRecord"
import { QueryResult } from "$lib/models/QueryResult"
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
        let result
        try {
            result = await this.pool.query(
                `SELECT * 
                FROM ${this.getTableName()} 
                WHERE 
                    id = ${id} AND 
                    ${this.userId} = ANY (user_id)`
            )
        } catch (e) {
            console.error(e)
            return null
        }

        if (result.rows.length == 0) {
            return null
        }

        const row = result.rows[0]
        return this.parse(row)
    }

    /**
     * List all records for the current user.
     * 
     * @param orderBy the column to sort the columns by
     * @returns all records for the current user
     */
    public async listAll(orderBy: string): Promise<T[]> {
        let result
        try {
            result = await this.pool.query(`
                SELECT * 
                FROM ${this.getTableName()} 
                WHERE ${this.userId} = ANY (user_id)
                ORDER BY ${orderBy} ASC
            `)
        } catch (e) {
            console.error(e)
            return []
        }

        return result.rows.map((row) => this.parse(row))
    }

    /**
     * Delete a record.
     * 
     * @param id id of the record to delete
     */
    public async delete(id: number) {
        try {
            await this.pool.query(
                `DELETE 
                FROM ${this.getTableName()} 
                WHERE 
                    id = ${id} AND 
                    ${this.userId} = ANY (user_id)`
            )
        } catch (e) {
            let error = 'Unknown error'
            if (e instanceof Error) {
                if (e.code == 23503) {
                    error = "This record can not be deleted, as it is used by other records"
                } else {
                    error = e.message
                }
            }
            return QueryResult.asErrorResult(error)
        }

        return QueryResult.asEmptySuccessResult()
    }
}