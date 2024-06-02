import { DatabaseClient } from '$lib/clients/DatabaseClient';
import type { Expense } from '$lib/models/Expense';
import { PaymentDate } from '$lib/models/PaymentDate';
import type { InsertablePaymentDateRecord } from '$lib/tables/PaymentDatesTable';

/**
 * Client for querying payment dates in the database.
 */
export class PaymentDateClient extends DatabaseClient {
	/**
	 * Create a new payment date.
	 *
	 * @param paymentDate the payment date to create
	 * @returns the newly created payment date
	 */
	public async create(paymentDate: InsertablePaymentDateRecord): Promise<PaymentDate> {
		const record = await this.getDatabase()
			.insertInto('paymentDates')
			.values(paymentDate)
			.returningAll()
			.executeTakeFirstOrThrow();

		return new PaymentDate(record);
	}

	/**
	 * List all of the current user's payment dates.
	 *
	 * @returns all payment dates for the given user
	 */
	public async listAll(): Promise<PaymentDate[]> {
		const records = await this.getDatabase()
			.selectFrom('paymentDates')
			.selectAll()
			.where((eb) => eb(eb.val(this.getUserId()), '=', eb.fn.any('userId')))
			.execute();

		return records.map((record) => new PaymentDate(record));
	}

	/**
	 * List all payment dates belonging to the given expense.
	 *
	 * @param expense the payment dates' expense
	 * @returns all payment dates for the given expense
	 */
	public async listAllBelongingTo(expense: Expense): Promise<PaymentDate[]> {
		const records = await this.getDatabase()
			.selectFrom('paymentDates')
			.selectAll()
			.where('expenseId', '=', expense.id)
			.execute();

		return records.map((record) => new PaymentDate(record));
	}

	/**
	 * List all payment dates belonging to the given expenses.
	 *
	 * @param expenses the payment dates' expenses
	 * @returns all payment dates for the given expenses
	 */
	public async listAllBelongingToMultiple(expenses: Expense[]): Promise<PaymentDate[]> {
		const records = await this.getDatabase()
			.selectFrom('paymentDates')
			.selectAll()
			.where(
				'expenseId',
				'in',
				expenses.map((expense) => expense.id)
			)
			.execute();

		return records.map((record) => new PaymentDate(record));
	}

	/**
	 * Delete all payment dates belonging to the given expense.
	 *
	 * @param id the id of the expense to remove payment dates from
	 */
	public async deleteAllBelongingTo(id: number) {
		await this.getDatabase().deleteFrom('paymentDates').where('expenseId', '=', id).execute();
	}
}
