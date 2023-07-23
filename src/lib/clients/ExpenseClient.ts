import type { QueryResultRow } from "@vercel/postgres";
import { DatabaseClient } from "$lib/clients/DatabaseClient";
import { Expense } from "$lib/models/Expense";

export class ExpenseClient extends DatabaseClient {

    private parse(row: QueryResultRow) {
        return new Expense(row.id, row.name, row.amount, row.frequency, row.tag, row.account_id, row.is_enabled)
    }

    protected serialize(row: QueryResultRow) {
        return this.parse(row).serialize()
    }

    public async create(name: string) {
        const result = await this.pool.query(`
            INSERT INTO budget_expenses(name, amount, frequency, tag, account_id, is_enabled) 
            VALUES($1, $2, $3, $4, $5, $6) 
            RETURNING *
        `, [name])

        const row = result.rows[0]
        return this.parse(row)
    }
}