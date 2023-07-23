import { Account } from "$lib/models/Account";
import type { QueryResultRow } from "@vercel/postgres";
import { DatabaseClient } from "$lib/clients/DatabaseClient";

export class AccountClient extends DatabaseClient {

    private tableName = "budget_accounts"

    private parse(row: QueryResultRow) {
        return new Account(row.id, row.name)
    }

    protected serialize(row: QueryResultRow) {
        return this.parse(row).serialize()
    }

    public async listAll() {
        console.dir(`SELECT * FROM ${this.tableName} WHERE user_id == ${this.userId}`)
        const result = await this.pool.query(`SELECT * FROM ${this.tableName} WHERE user_id = '${this.userId}'`);

        return result.rows.map((row) => this.serialize(row));
    }

    public async create(name: string) {
        const result = await this.pool.query(`
            INSERT INTO ${this.tableName}(name,user_id) VALUES($1,$2) RETURNING *`,
            [name, this.userId]
        )

        const row = result.rows[0]
        return this.parse(row)
    }

    public async getById(id: number) {
        const result = await this.pool.sql `SELECT * FROM ${this.tableName} WHERE id == ${id}`;

        if (result.rows.length == 0) {
            return null
        }

        return result.rows.map((row) => this.parse(row))[0];
    }
}