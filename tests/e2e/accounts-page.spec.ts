import { test } from '@playwright/test';
import { AccountsPage } from './src/accounts-page';
import { LoginPage } from './src/login-page';

test('has title', async ({ page }) => {
	const loginPage = new LoginPage(page);
	await loginPage.goto();
	await loginPage.clickSignInWithADemoUser();

	const accountsPage = new AccountsPage(page);
	await accountsPage.goto();

	console.log(accountsPage);
});
