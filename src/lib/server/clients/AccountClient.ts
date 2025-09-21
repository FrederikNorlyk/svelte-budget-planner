import type { DatabaseError } from '$lib/errors/DatabaseError';
import { Account } from '$lib/models/Account';
import { QueryResult } from '$lib/models/QueryResult';
import { DatabaseClient } from '$lib/server/clients/DatabaseClient';
import type {
	InsertableAccountRecord,
	UpdateableAccountRecord
} from '$lib/server/tables/AccountsTable';
import { sql } from 'kysely';
import { ExpenseClient } from './ExpenseClient';
import { PaymentDateClient } from './PaymentDateClient';

type SearchCriteria = { ids?: number[] };

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
	public async create(account: InsertableAccountRecord): Promise<Account> {
		const record = await this.getDatabase()
			.insertInto('accounts')
			.values(account)
			.returningAll()
			.executeTakeFirstOrThrow();

		return new Account(record, []);
	}

	/**
	 * Update an account.
	 *
	 * @param id the id of the account to update
	 * @param account the account values to update
	 * @returns the updated account
	 */
	public async update(id: number, account: UpdateableAccountRecord): Promise<Account> {
		const record = await this.getDatabase()
			.updateTable('accounts')
			.set(account)
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirstOrThrow();

		return new Account(record, []);
	}

	/**
	 * Delete the given account.
	 *
	 * @param id id of the account to delete
	 * @returns result of the delete operation
	 */
	public async delete(id: number) {
		try {
			await this.getDatabase().deleteFrom('accounts').where('id', '=', id).execute();
		} catch (error) {
			const dbError = error as DatabaseError;
			let message = 'Unknown error';
			if (dbError.code == '23503') {
				message = 'errorDeleteAccountHasExpenses';
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
		const record = await this.getDatabase()
			.selectFrom('accounts')
			.selectAll()
			.where('id', '=', id)
			.executeTakeFirst();

		if (!record) {
			return null;
		}

		return new Account(record, []);
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
	public async listAll(criteria: SearchCriteria | null = null) {
		let query = this.getDatabase()
			.selectFrom('accounts')
			.selectAll()
			.where((eb) => eb(eb.val(this.getUserId()), '=', eb.fn.any('userId')))
			.orderBy('name');

		if (criteria?.ids) {
			query = query.where('id', 'in', criteria.ids);
		}

		const records = await query.execute();
		return records.map((record) => new Account(record, []));
	}

	public async search(query: string) {
		const records = await this.getDatabase()
			.selectFrom('accounts')
			.selectAll()
			.where((eb) => eb(eb.val(this.getUserId()), '=', eb.fn.any('userId')))
			.where(sql`LOWER(name)`, 'like', `%${query.toLowerCase()}%`)
			.execute();

		return records.map((record) => new Account(record, []));
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
