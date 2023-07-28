import type { QueryResultRow } from "@vercel/postgres";
import { DatabaseClient } from "$lib/clients/DatabaseClient";
import { Expense } from "$lib/models/Expense";
import type { Account } from "$lib/models/Account";

/**
 * Client for querying expenses in the database.
 */
export class ExpenseClient extends DatabaseClient<Expense> {

    public static TABLE_NAME = 'budget_expenses'

    protected override getTableName(): string {
        return ExpenseClient.TABLE_NAME
    }

    protected override parse(row: QueryResultRow) {
        return new Expense(row.id, row.name, row.amount, row.frequency, row.tag, row.account_id, row.is_enabled)
    }

    /**
     * Create a new expense.
     * 
     * @param expense the expense to create
     * @returns the newly created expense
     */
    public async create(expense: Expense) {
        let result

        try {
            result = await this.getPool().query(`
                INSERT INTO ${this.getTableName()} 
                    (name, amount, frequency, tag, account_id, is_enabled, user_id) 
                VALUES 
                    ($1, $2, $3, $4, $5, $6, $7) 
                RETURNING *`,
                [
                    expense.getName(),
                    expense.getAmount(),
                    expense.getFrequency(),
                    expense.getTag(),
                    expense.getAccountId(),
                    expense.isEnabled(),
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
     * Update an expense.
     * 
     * @param expense the expense to update
     * @returns the updated expense
     */
    public async update(expense: Expense) {
        let result
        try {
            result = await this.getPool().query(`
                UPDATE ${this.getTableName()} 
                SET 
                    name = $1,
                    amount = $2,
                    frequency = $3,
                    tag = $4,
                    account_id = $5,
                    is_enabled = $6
                WHERE id = $7
                RETURNING *`,
                [
                    expense.getName(),
                    expense.getAmount(),
                    expense.getFrequency(),
                    expense.getTag(),
                    expense.getAccountId(),
                    expense.isEnabled(),
                    expense.getId()
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
    * List all records belonging to the given account.
    * 
    * @returns all records for the given account
    */
    public async listBelongingTo(account: Account) {
        let result
        try {
            result = await this.getPool().query(`
                SELECT * 
                FROM ${this.getTableName()} 
                WHERE account_id = ${account.getId()}
                ORDER BY tag, name
            `)
        } catch (e) {
            console.error(e)
            return []
        }

        return result.rows.map((row) => this.parse(row))
    }

    /**
     * List all used tags.
     * 
     * @returns a unique list of used tags
     */
    public async listAllTags() {
        let result
        try {
            result = await this.getPool().query(`
                SELECT tag 
                FROM ${this.getTableName()} 
                WHERE user_id = ${this.getUserId()}
                GROUP BY tag
                ORDER BY tag
            `)
        } catch (e) {
            console.error(e)
            return []
        }

        return result.rows.map((row) => row.tag as string)
    }
}