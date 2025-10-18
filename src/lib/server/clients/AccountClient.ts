import { Account } from '$lib/models/Account';
import { QueryResult } from '$lib/models/QueryResult';
import { DatabaseClient } from '$lib/server/clients/DatabaseClient';
import { accounts, expenses } from '$lib/server/db/schema';
import { NeonDbError } from '@neondatabase/serverless';
import { and, eq, inArray, type InferInsertModel, like, sql } from 'drizzle-orm';

type SearchCriteria = { ids?: number[]; expense?: { isEnabled?: boolean } };

/**
 * See https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
const FOREIGN_KEY_VIOLATION = '23503';

/**
 * Client for querying accounts in the database.
 */
export class AccountClient extends DatabaseClient {
	/**
	 * Creates an account.
	 *
	 * @param account the account to insert
	 * @returns the newly created account
	 */
	public async create(account: InferInsertModel<typeof accounts>): Promise<Account> {
		const returned = await this.getDatabase().insert(accounts).values(account).returning();

		return new Account(returned[0]);
	}

	/**
	 * Update an account.
	 *
	 * @param id the id of the account to update
	 * @param account the account values to update
	 * @returns the updated account
	 */
	public async update(id: number, account: InferInsertModel<typeof accounts>): Promise<Account> {
		const returned = await this.getDatabase()
			.update(accounts)
			.set(account)
			.where(and(eq(accounts.id, id), this.isUserIn(accounts.userIds)))
			.returning();

		return new Account(returned[0]);
	}

	/**
	 * Delete the given account.
	 *
	 * @param id id of the account to delete
	 * @returns result of the delete operation
	 */
	public async delete(id: number): Promise<QueryResult<object>> {
		try {
			await this.getDatabase()
				.delete(accounts)
				.where(and(eq(accounts.id, id), this.isUserIn(accounts.userIds)));
		} catch (error) {
			let message = 'Unknown error';
			if (error instanceof NeonDbError) {
				if (error.code === FOREIGN_KEY_VIOLATION) {
					message = 'errorDeleteAccountHasExpenses';
				}
			} else if (error instanceof Error && error.cause instanceof NeonDbError) {
				if (error.cause.code === FOREIGN_KEY_VIOLATION) {
					message = 'errorDeleteAccountHasExpenses';
				}
			}
			return QueryResult.asErrorResult(message);
		}

		return QueryResult.asEmptySuccessResult();
	}

	/**
	 * Get the account with the given id.
	 *
	 * @param id the id of the account
	 * @returns the account with the given id
	 */
	public async getById(id: number): Promise<Account | null> {
		const records = await this.getDatabase()
			.select()
			.from(accounts)
			.where(and(eq(accounts.id, id), this.isUserIn(accounts.userIds)));

		return new Account(records[0]);
	}

	public async search(query: string): Promise<Account[]> {
		const records = await this.getDatabase()
			.select()
			.from(accounts)
			.where(
				and(
					this.isUserIn(accounts.userIds),
					like(sql`LOWER(${accounts.name})`, `%${query.toLowerCase()}%`)
				)
			);

		return records.map((record) => new Account(record));
	}

	/**
	 * Lists all accounts for the current user. The accounts are expanded which means that they contain a list of all
	 * their expenses, including the expenses' payment dates.
	 *
	 * @returns accounts with expenses
	 */
	public async listAllExpanded(criteria: SearchCriteria | null = null): Promise<Account[]> {
		const conditions = [this.isUserIn(accounts.userIds)];

		if (criteria?.ids) {
			conditions.push(inArray(accounts.id, criteria.ids));
		}

		let expenseConditions = undefined;
		if (criteria?.expense?.isEnabled !== undefined) {
			expenseConditions = eq(expenses.isEnabled, criteria.expense.isEnabled);
		}

		const records = await this.getDatabase()
			.query.accounts.findMany({
				where: sql.join(conditions, sql` AND `),
				with: { expenses: { where: expenseConditions, with: { paymentDates: true } } }
			})
			.execute();

		return records.map((record) => new Account(record));
	}
}
