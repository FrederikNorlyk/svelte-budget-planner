import { accounts, expenses } from '$lib/server/db/schema';
import { DatabaseClient } from './DatabaseClient';

/**
 * Client used by e2e tests to reset the demo user.
 */
export class ResetClient extends DatabaseClient {
	async reset() {
		const db = this.getDatabase();
		await db.delete(expenses).where(this.isUserIn(expenses.userIds)).execute();
		await db.delete(accounts).where(this.isUserIn(accounts.userIds)).execute();
	}
}
