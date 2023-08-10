import { Account } from "$lib/models/Account"
import type { QueryResultRow } from "@vercel/postgres"
import { DatabaseClient } from "$lib/clients/DatabaseClient"
import { ExpenseClient } from "./ExpenseClient"
import { DB_TABLE_PREFIX } from "$env/static/private"
import { PaymentDateClient } from "./PaymentDateClient"

/**
 * Client for querying accounts in the database.
 */
export class AccountClient extends DatabaseClient<Account> {

    public static TABLE_NAME = DB_TABLE_PREFIX + 'accounts'

    protected override getTableName(): string {
        return AccountClient.TABLE_NAME
    }

    protected override parse(row: QueryResultRow) {
        return new Account(row.id, row.name)
    }

    /**
     * Creates an account.
     * 
     * @param name name of the account
     * @returns the newly created account
     */
    public async create(name: string) {
        let result
        try {
            result = await this.getPool().query(`
                INSERT INTO ${this.getTableName()} 
                    (name, user_id) 
                VALUES 
                    ($1, $2) 
                RETURNING *`,
                [
                    name,
                    this.getUserId()
                ]
            )
        } catch (e) {
            console.error(e)
            return null
        }

        const row = result.rows[0]
        return this.parse(row)
    }

    /**
     * Update an account.
     * 
     * @param id the id of the account to update
     * @param name the new name for the account
     * @returns the updated account
     */
    public async update(id: number, name: string) {
        let result
        try {
            result = await this.getPool().query(`
                UPDATE ${this.getTableName()} 
                SET name = $1
                WHERE 
                    id = $2 AND
                    user_id = $3
                RETURNING *`,
                [name, id, this.getUserId()]
            )
        } catch (e) {
            console.error(e)
            return null
        }

        const row = result.rows[0]
        return this.parse(row)
    }

    /**
     * Lists all accounts for the current user. The accounts are expanded which means that they contain a list of all 
     * their expenses, including the expenses payment dates.
     * 
     * @param sortBy account field to sort by
     * @returns accounts with expenses
     */
    public async listAllExpanded(sortBy: string): Promise<Account[]> {
        const expenseClient = new ExpenseClient(this.getUserId())
        const paymentDateClient = new PaymentDateClient(this.getUserId())

        const [accounts, expenses, paymentDates] = await Promise.all([
            this.listAll(sortBy),
            expenseClient.listAll('id'),
            paymentDateClient.listAll('id')
        ])

        accounts.forEach(account => {
            expenses.forEach(expense => {
                if (expense.getAccountId() !== account.getId()) {
                    return
                }

                paymentDates.forEach(paymentDate => {
                    if (paymentDate.getExpenseId() !== expense.getId()) {
                        return
                    }

                    expense.setPaymentDates([...expense.getPaymentDates(), paymentDate])
                })

                account.setExpenses([...account.getExpenses(), expense])
            })
        })

        return accounts
    }
}