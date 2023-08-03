import { Account } from "$lib/models/Account"
import type { QueryResultRow } from "@vercel/postgres"
import { DatabaseClient } from "$lib/clients/DatabaseClient"
import { ExpenseClient } from "./ExpenseClient"
import { DB_TABLE_PREFIX } from "$env/static/private"

interface TotalAmountResult {
    accountId: number,
    totalAmount: number
}

/**
 * Client for querying accounts in the database.
 */
export class AccountClient extends DatabaseClient<Account> {

    public static TABLE_NAME = DB_TABLE_PREFIX + 'accounts'

    protected override getTableName(): string {
        return AccountClient.TABLE_NAME
    }

    protected override parse(row: QueryResultRow) {
        return new Account(row.id, row.name)
    }

    /**
     * Creates an account.
     * 
     * @param name name of the account
     * @returns the newly created account
     */
    public async create(name: string) {
        let result
        try {
            result = await this.getPool().query(`
                INSERT INTO ${this.getTableName()} 
                    (name, user_id) 
                VALUES 
                    ($1, $2) 
                RETURNING *`,
                [
                    name,
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
     * Update an account.
     * 
     * @param id the id of the account to update
     * @param name the new name for the account
     * @returns the updated account
     */
    public async update(id: number, name: string) {
        let result
        try {
            result = await this.getPool().query(`
                UPDATE ${this.getTableName()} 
                SET name = $1
                WHERE 
                    id = $2 AND
                    user_id = $3
                RETURNING *`,
                [name, id, this.getUserId()]
            )
        } catch (e) {
            console.error(e)
            return null
        }

        const row = result.rows[0]
        return this.parse(row)
    }

    /**
     * Get the ids of all accounts and their expenses total amounts.
     * 
     * @returns account id mapped to its expenses total amounts
     */
    public async getTotalAmounts() {
        let result
        try {
            result = await this.getPool().query(`
                SELECT
                    a.id as id,
                    SUM(e.amount) as total_amount
                FROM 
                    ${this.getTableName()} AS a
                    INNER JOIN ${ExpenseClient.TABLE_NAME} AS e ON a.id = e.account_id
                WHERE
                    e.is_enabled = true AND
                    a.user_id = ${this.getUserId()}
                GROUP BY
                    a.id
            `)
        } catch (e) {
            console.error(e)
            return []
        }

        return result.rows.map(row => {
            return {
                accountId: +row.id,
                totalAmount: +row.total_amount
            } as TotalAmountResult
        });
    }
}