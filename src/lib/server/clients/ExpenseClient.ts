import { Expense } from '$lib/models/Expense';
import { QueryResult } from '$lib/models/QueryResult';
import { DatabaseClient } from '$lib/server/clients/DatabaseClient';
import { expenses } from '$lib/server/db/schema';
import { and, eq, inArray, type InferInsertModel, isNotNull, like, ne, sql } from 'drizzle-orm';

type SearchCriteria = { accountId?: number; ids?: number[]; isEnabled?: boolean; tag?: string };

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

	public async listAllExpanded(criteria: SearchCriteria | null = null): Promise<Expense[]> {
		const conditions = [this.isUserIn(expenses.userIds)];

		if (criteria?.accountId) {
			conditions.push(eq(expenses.accountId, criteria.accountId));
		}

		if (criteria?.ids) {
			conditions.push(inArray(expenses.id, criteria.ids));
		}

		if (criteria?.isEnabled !== undefined) {
			conditions.push(eq(expenses.isEnabled, criteria.isEnabled));
		}

		if (criteria?.tag) {
			conditions.push(eq(expenses.tag, criteria.tag));
		}

		const records = await this.getDatabase()
			.query.expenses.findMany({
				where: sql.join(conditions, sql` AND `),
				with: { paymentDates: true }
			})
			.execute();

		return records.map((record) => new Expense(record));
	}

	public async search(query: string): Promise<Expense[]> {
		const records = await this.getDatabase()
			.select()
			.from(expenses)
			.where(
				and(
					this.isUserIn(expenses.userIds),
					like(
						sql`LOWER(
          ${expenses.name}
          )`,
						`%${query.toLowerCase()}%`
					)
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
					like(
						sql`LOWER(
          ${expenses.tag}
          )`,
						`%${query.toLowerCase()}%`
					)
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
			.where(and(this.isUserIn(expenses.userIds), isNotNull(expenses.tag), ne(expenses.tag, '')))
			.groupBy(expenses.tag)
			.orderBy(expenses.tag)
			.execute();

		const tags = records.map((record) => record.tag);
		return tags.filter((tag) => tag != null);
	}
}
