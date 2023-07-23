import { POSTGRES_URL } from "$env/static/private";
import { createPool } from "@vercel/postgres";

export abstract class DatabaseClient {
    protected pool
    protected userId

    constructor(userId: number) {
        this.pool = createPool({
            connectionString: POSTGRES_URL
        });

        this.userId = userId
    }
}