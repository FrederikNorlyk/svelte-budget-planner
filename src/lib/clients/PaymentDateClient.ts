import type { QueryResultRow } from '@vercel/postgres';
import { DatabaseClient } from '$lib/clients/DatabaseClient';
import { PaymentDate } from '$lib/models/PaymentDate';
import type { Expense } from '$lib/models/Expense';
import { DB_TABLE_PREFIX } from '$env/static/private';

/**
 * Client for querying payment dates in the database.
 */
export class PaymentDateClient extends DatabaseClient<PaymentDate> {
	public static TABLE_NAME = DB_TABLE_PREFIX + 'payment_dates';

	protected override getTableName(): string {
		return PaymentDateClient.TABLE_NAME;
	}

	protected override parse(row: QueryResultRow) {
		return new PaymentDate(+row.id, +row.expense_id, +row.month, +row.day_of_month, row.user_id);
	}

	/**
	 * Create a new payment date.
	 *
	 * @param paymentDate the payment date to create
	 * @returns the newly created payment date
	 */
	public async create(paymentDate: PaymentDate) {
		let result;

		try {
			result = await this.getPool().query(
				`
                INSERT INTO ${this.getTableName()} 
                    (user_id, expense_id, day_of_month, month) 
                VALUES 
                    ($1, $2, $3, $4) 
                RETURNING *`,
				[
					paymentDate.getUserIds(),
					paymentDate.getExpenseId(),
					paymentDate.getDayOfMonth(),
					paymentDate.getMonth()
				]
			);
		} catch (e) {
			console.error(e);
			return null;
		}

		const row = result.rows[0];
		return this.parse(row);
	}

	/**
	 * List all payment dates belonging to the given expense.
	 *
	 * @returns all payment dates for the given expense
	 */
	public async listAllBelongingTo(expense: Expense) {
		let result;
		try {
			result = await this.getPool().query(`
                SELECT * 
                FROM ${this.getTableName()} 
                WHERE 
                    expense_id = ${expense.getId()} AND
                    '${this.getUserId()}' = ANY (user_id)
                ORDER BY month
            `);
		} catch (e) {
			console.error(e);
			return [];
		}

		return result.rows.map((row) => this.parse(row));
	}

	/**
	 * Delete all payment dates belonging to the given expense
	 *
	 * @param expense the expense to remove payment dates for
	 */
	public async deleteAllBelongingTo(expense: Expense) {
		try {
			await this.getPool().query(`
                DELETE 
                FROM ${this.getTableName()} 
                WHERE 
                    expense_id = ${expense.getId()} AND
                    '${this.getUserId()}' = ANY (user_id)
            `);
		} catch (e) {
			console.log(e);
		}
	}
}
