import { PaymentDate } from '$lib/models/PaymentDate';
import { DatabaseClient } from '$lib/server/clients/DatabaseClient';
import { paymentDates } from '$lib/server/db/schema';
import { and, eq, inArray, type InferInsertModel, sql } from 'drizzle-orm';

type SearchCriteria = { expenseIds?: number[]; expenseId?: number };

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
	public async create(paymentDate: InferInsertModel<typeof paymentDates>): Promise<PaymentDate> {
		const returned = await this.getDatabase().insert(paymentDates).values(paymentDate).returning();

		return new PaymentDate(returned[0]);
	}

	/**
	 * List all of the current user's payment dates.
	 *
	 * @param [criteria=null] search criteria
	 * @returns all payment dates for the given user
	 */
	public async listAll(criteria: SearchCriteria | null = null): Promise<PaymentDate[]> {
		const conditions = [this.isUserIn(paymentDates.userIds)];

		if (criteria?.expenseId) {
			conditions.push(eq(paymentDates.expenseId, criteria.expenseId));
		}

		if (criteria?.expenseIds) {
			conditions.push(inArray(paymentDates.expenseId, criteria.expenseIds));
		}

		const records = await this.getDatabase()
			.select()
			.from(paymentDates)
			.where(sql.join(conditions, sql` AND `));

		return records.map((record) => new PaymentDate(record));
	}

	/**
	 * Delete all payment dates belonging to the given expense.
	 *
	 * @param id the id of the expense to remove payment dates from
	 */
	public async deleteAllBelongingTo(id: number) {
		await this.getDatabase()
			.delete(paymentDates)
			.where(and(eq(paymentDates.expenseId, id), this.isUserIn(paymentDates.userIds)));
	}
}
