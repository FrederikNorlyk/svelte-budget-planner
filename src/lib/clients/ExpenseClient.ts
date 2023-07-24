import type { QueryResultRow } from "@vercel/postgres";
import { DatabaseClient } from "$lib/clients/DatabaseClient";
import { Expense } from "$lib/models/Expense";

/**
 * Client for querying expenses in the database.
 */
export class ExpenseClient extends DatabaseClient<Expense> {

    protected override getTableName(): string {
        return 'budget_expenses'
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
        const result = await this.getPool().query(`
            INSERT INTO ${this.getTableName()} 
                (name, amount, frequency, tag, account_id, is_enabled, user_id) 
            VALUES 
                ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *
        `, [
            expense.getName(), 
            expense.getAmount(), 
            expense.getFrequency(), 
            expense.getTag(), 
            expense.getAccountId(), 
            expense.isEnabled(), 
            this.getUserId()
        ])

        const row = result.rows[0]
        return this.parse(row)
    }
}