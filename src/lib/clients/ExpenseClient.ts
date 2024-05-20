import type { QueryResultRow } from "@vercel/postgres";
import { DatabaseClient } from "$lib/clients/DatabaseClient";
import { Expense } from "$lib/models/Expense";
import type { Account } from "$lib/models/Account";
import { DB_TABLE_PREFIX } from "$env/static/private"
import { PaymentDateClient } from "./PaymentDateClient";

/**
 * Client for querying expenses in the database.
 */
export class ExpenseClient extends DatabaseClient<Expense> {

    public static TABLE_NAME = DB_TABLE_PREFIX + 'expenses'

    protected override getTableName(): string {
        return ExpenseClient.TABLE_NAME
    }

    protected override parse(row: QueryResultRow) {
        return new Expense(+row.id, row.name, +row.amount, row.tag, +row.account_id, row.is_enabled, row.is_shared)
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
                    (name, amount, tag, account_id, is_enabled, is_shared, user_id) 
                VALUES 
                    ($1, $2, $3, $4, $5, $6, $7) 
                RETURNING *`,
                [
                    expense.getName(),
                    expense.getAmount(),
                    expense.getTag(),
                    expense.getAccountId(),
                    expense.isEnabled(),
                    expense.isShared(),
                    [this.getUserId()]
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
                    tag = $3,
                    account_id = $4,
                    is_enabled = $5,
                    is_shared = $6
                WHERE 
                    id = $7 AND
                    $8 = ANY (user_id)
                RETURNING *`,
                [
                    expense.getName(),
                    expense.getAmount(),
                    expense.getTag(),
                    expense.getAccountId(),
                    expense.isEnabled(),
                    expense.isShared(),
                    expense.getId(),
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
                WHERE 
                    account_id = ${account.getId()} AND
                    ${this.getUserId()} = ANY (user_id)
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
                WHERE ${this.getUserId()} = ANY (user_id)
                GROUP BY tag
                ORDER BY tag
            `)
        } catch (e) {
            console.error(e)
            return []
        }

        return result.rows.map((row) => row.tag as string)
    }

    /**
     * Get all expenses for the current user. The returned expenses are enriched with payment date information.
     * 
     * @returns enriched expense
     */
    public async addPaymentDatesTo(expenses: Expense[]) {
        const paymentDateClient = new PaymentDateClient(this.getUserId())
        const paymentDates = await paymentDateClient.listAll('id')

        return expenses.map(expense => {
            const dates = paymentDates.filter((paymentDate) => paymentDate.getExpenseId() === expense.getId())
            expense.setPaymentDates(dates)
            return expense
        })
    }
}