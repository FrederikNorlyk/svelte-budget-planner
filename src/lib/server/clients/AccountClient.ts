import { Account } from '$lib/models/Account';
import { QueryResult } from '$lib/models/QueryResult';
import { DatabaseClient } from '$lib/server/clients/DatabaseClient';
import { accounts } from '$lib/server/db/schema';
import { NeonDbError } from '@neondatabase/serverless';
import { and, eq, inArray, type InferInsertModel, like, sql } from 'drizzle-orm';
import { ExpenseClient } from './ExpenseClient';
import { PaymentDateClient } from './PaymentDateClient';

type SearchCriteria = { ids?: number[] };

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

	/**
	 * Get the account with the given id. The account will be expanded, which
	 * means that it will contain a list of all its expenses, including the
	 * expenses' payment dates.
	 *
	 * @param id the id of the account
	 * @returns account with expenses and payment dates
	 */
	public async getByIdExpanded(id: number): Promise<Account | null> {
		const account = await this.getById(id);

		if (!account) {
			return null;
		}

		const expenseClient = new ExpenseClient(this.getUserId());
		let expenses = await expenseClient.listAll({ accountId: id });

		if (expenses.length > 0) {
			expenses = await expenseClient.addPaymentDatesTo(expenses);
		}

		account.expenses = expenses;

		return account;
	}

	/**
	 * List all accounts belonging to the current user.
	 * @returns the user's accounts
	 */
	public async listAll(criteria: SearchCriteria | null = null): Promise<Account[]> {
		const conditions = [this.isUserIn(accounts.userIds)];

		if (criteria?.ids) {
			conditions.push(inArray(accounts.id, criteria.ids));
		}

		const records = await this.getDatabase()
			.select()
			.from(accounts)
			.where(sql.join(conditions, sql` AND `))
			.orderBy(accounts.name);

		return records.map((record) => new Account(record));
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
	public async listAllExpanded(): Promise<Account[]> {
		const expenseClient = new ExpenseClient(this.getUserId());
		const paymentDateClient = new PaymentDateClient(this.getUserId());

		const [accounts, expenses, paymentDates] = await Promise.all([
			this.listAll(),
			expenseClient.listAll(),
			paymentDateClient.listAll()
		]);

		accounts.forEach((account) => {
			expenses.forEach((expense) => {
				if (expense.accountId !== account.id) {
					return;
				}

				paymentDates.forEach((paymentDate) => {
					if (paymentDate.expenseId !== expense.id) {
						return;
					}

					expense.paymentDates = [...expense.paymentDates, paymentDate];
				});

				account.expenses = [...account.expenses, expense];
			});
		});

		return accounts;
	}
}
