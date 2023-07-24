import { Account } from "$lib/models/Account"
import type { QueryResultRow } from "@vercel/postgres"
import { DatabaseClient } from "$lib/clients/DatabaseClient"

/**
 * Client for querying accounts in the database.
 */
export class AccountClient extends DatabaseClient<Account> {

    protected override getTableName(): string {
        return 'budget_accounts'
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
        const result = await this.getPool().query(`
            INSERT INTO ${this.getTableName()} 
                (name, user_id) 
            VALUES 
                ($1, $2) 
            RETURNING *`,
            [name, this.getUserId()]
        )

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
        const result = await this.getPool().query(`
            UPDATE ${this.getTableName()} 
            SET name = $1
            WHERE id = $2
            RETURNING *`,
            [name, id]
        )

        const row = result.rows[0]
        return this.parse(row)
    }
}