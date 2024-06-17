import type { Page } from '@playwright/test';
import { AccountsPage } from './accounts-page';
import { LoginPage } from './login-page';

export class App {
	static async signInAndReset(page: Page) {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await loginPage.clickSignInWithADemoUser();

		await page.goto('e2e/reset');
	}

	static async gotoAccountsPage(page: Page) {
		const accountsPage = new AccountsPage(page);
		await accountsPage.goto();
		return accountsPage;
	}
}
