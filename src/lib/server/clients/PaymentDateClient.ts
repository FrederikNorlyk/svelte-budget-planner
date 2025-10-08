import { PaymentDate } from '$lib/models/PaymentDate';
import { DatabaseClient } from '$lib/server/clients/DatabaseClient';
import { paymentDates } from '$lib/server/db/schema';
import { and, eq, type InferInsertModel } from 'drizzle-orm';

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
