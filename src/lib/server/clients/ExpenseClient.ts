import { Expense } from '$lib/models/Expense';
import { QueryResult } from '$lib/models/QueryResult';
import { DatabaseClient } from '$lib/server/clients/DatabaseClient';
import { expenses } from '$lib/server/db/schema';
import { and, eq, type InferInsertModel, like, sql } from 'drizzle-orm';
import { PaymentDateClient } from './PaymentDateClient';

type SearchCriteria = { accountId?: number; isEnabled?: boolean; tag?: string };

/**
 * Client for querying expenses in the database.
 */
export class ExpenseClient extends DatabaseClient {
	/**
	 * Create a new expense.
	 *
	 * @param expense the expense to create
	 * @returns the newly created expense
	 */
	public async create(expense: InferInsertModel<typeof expenses>): Promise<Expense> {
		const returned = await this.getDatabase().insert(expenses).values(expense).returning();

		return new Expense(returned[0]);
	}

	/**
	 * Update an expense.
	 *
	 * @param id of the expense
	 * @param expense the expense values to update
	 * @returns the updated expense
	 */
	public async update(id: number, expense: InferInsertModel<typeof expenses>): Promise<Expense> {
		const returned = await this.getDatabase()
			.update(expenses)
			.set(expense)
			.where(and(eq(expenses.id, id), this.isUserIn(expenses.userIds)))
			.returning();

		return new Expense(returned[0]);
	}

	/**
	 * Delete the given expense.
	 *
	 * @param id id of the expense to delete
	 * @returns result of the delete operation
	 */
	public async delete(id: number) {
		await this.getDatabase()
			.delete(expenses)
			.where(and(eq(expenses.id, id), this.isUserIn(expenses.userIds)));

		return QueryResult.asEmptySuccessResult();
	}

	/**
	 * Get the expense with the given id.
	 *
	 * @param id id of the expense
	 * @returns the expense or null
	 */
	public async getById(id: number): Promise<Expense | null> {
		const records = await this.getDatabase()
			.select()
			.from(expenses)
			.where(and(eq(expenses.id, id), this.isUserIn(expenses.userIds)));

		if (records.length === 0) {
			return null;
		}

		return new Expense(records[0]);
	}

	/**
	 * List all of the current user's expenses.
	 *
	 * @param [criteria=null] search criteria
	 * @returns the current user's expenses
	 */
	public async listAll(criteria: SearchCriteria | null = null): Promise<Expense[]> {
		const conditions = [this.isUserIn(expenses.userIds)];

		if (criteria?.accountId) {
			conditions.push(eq(expenses.accountId, criteria.accountId));
		}

		if (criteria?.isEnabled !== undefined) {
			conditions.push(eq(expenses.isEnabled, criteria.isEnabled));
		}

		if (criteria?.tag) {
			conditions.push(eq(expenses.tag, criteria.tag));
		}

		const records = await this.getDatabase()
			.select()
			.from(expenses)
			.where(sql.join(conditions, sql` AND `))
			.orderBy(expenses.tag, expenses.name);

		return records.map((record) => new Expense(record));
	}

	public async search(query: string): Promise<Expense[]> {
		const records = await this.getDatabase()
			.select()
			.from(expenses)
			.where(
				and(
					this.isUserIn(expenses.userIds),
					like(sql`LOWER(${expenses.name})`, `%${query.toLowerCase()}%`)
				)
			);

		return records.map((record) => new Expense(record));
	}

	public async searchTags(query: string) {
		const records = await this.getDatabase()
			.select({ tag: expenses.tag })
			.from(expenses)
			.where(
				and(
					this.isUserIn(expenses.userIds),
					like(sql`LOWER(${expenses.tag})`, `%${query.toLowerCase()}%`)
				)
			)
			.groupBy(expenses.tag);

		const tags = records.map((record) => record.tag);
		return tags.filter((tag) => tag != null);
	}

	/**
	 * List all used tags.
	 *
	 * @returns a unique list of used tags
	 */
	public async listAllTags(): Promise<string[]> {
		const records = await this.getDatabase()
			.select({ tag: expenses.tag })
			.from(expenses)
			.where(this.isUserIn(expenses.userIds))
			.groupBy(expenses.tag)
			.orderBy(expenses.tag)
			.execute();

		const tags = records.map((record) => record.tag);
		return tags.filter((tag) => tag != null);
	}

	/**
	 * Add payment dates to the given expenses.
	 *
	 * @param expenses the expenses to add the payment dates to
	 * @returns the expenses with their payment dates
	 */
	public async addPaymentDatesTo(expenses: Expense[]) {
		const paymentDateClient = new PaymentDateClient(this.getUserId());

		const paymentDates = await paymentDateClient.listAll({
			expenseIds: expenses.map((expense) => expense.id)
		});

		return expenses.map((expense) => {
			expense.paymentDates = paymentDates.filter(
				(paymentDate) => paymentDate.expenseId === expense.id
			);
			return expense;
		});
	}
}
