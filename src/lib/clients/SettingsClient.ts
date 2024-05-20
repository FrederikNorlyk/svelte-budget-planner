import type { QueryResultRow } from "@vercel/postgres";
import { DatabaseClient } from "$lib/clients/DatabaseClient";
import { Settings } from "$lib/models/Settings";
import { DB_TABLE_PREFIX } from "$env/static/private"

/**
 * Client for querying payment dates in the database.
 */
export class SettingsClient extends DatabaseClient<Settings> {

    public static TABLE_NAME = DB_TABLE_PREFIX + 'settings'

    protected override getTableName(): string {
        return SettingsClient.TABLE_NAME
    }

    protected override parse(row: QueryResultRow) {
        return new Settings(+row.id, row.locale, +row.income)
    }

    /**
     * Create a new settings entry.
     * 
     * @param settings the settings entry to create
     * @returns the newly created settings entry
     */
    private async create(settings: Settings) {
        let result

        try {
            result = await this.getPool().query(`
                INSERT INTO ${this.getTableName()} 
                    (user_id, locale, income) 
                VALUES 
                    ($1, $2, $3) 
                RETURNING *`,
                [
                    [this.getUserId()],
                    settings.getLocale(),
                    settings.getIncome()
                ]
            )
        } catch (e) {
            console.error(e)
            return null
        }

        const row = result.rows[0]
        return this.parse(row)
    }

    /**
     * Update a settings entry.
     * 
     * @param settings the settings entry to update
     * @returns the updated settings entry
     */
    public async update(settings: Settings) {
        let result
        try {
            result = await this.getPool().query(`
                UPDATE ${this.getTableName()} 
                SET 
                    locale = $1,
                    income = $2
                WHERE 
                    id = $3 AND
                    $4 = ANY (user_id)
                RETURNING *`,
                [
                    settings.getLocale(),
                    settings.getIncome(),
                    settings.getId(),
                    this.getUserId()
                ]
            )
        } catch (e) {
            console.error(e)
            return null
        }

        const row = result.rows[0]
        return this.parse(row)
    }

    /**
     * Gets the settings entry for the given user.
     * 
     * @returns settings entry for the given user
     */
    public async getForCurrentUser() {
        let settings = await this.get()
        
        if (settings == null) {
            await this.create(new Settings(0, "en", 0))
            settings = await this.get()
        }

        if (settings == null) {
            throw Error("Something went wrong")
        }

        return settings
    }

    private async get() {
        let result
        try {
            result = await this.getPool().query(
                `SELECT * 
                FROM ${this.getTableName()} 
                WHERE ${this.getUserId()} = ANY (user_id)`
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
}