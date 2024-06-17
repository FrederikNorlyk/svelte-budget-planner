import { expect, test } from '@playwright/test';
import { AccountsPage } from './src/accounts-page';
import { LoginPage } from './src/login-page';

test.beforeEach(async ({ page }) => {
	const loginPage = new LoginPage(page);
	await loginPage.goto();
	await loginPage.clickSignInWithADemoUser();

	await page.goto('e2e/reset');
	await page.waitForLoadState();
});

test('add new account', async ({ page }) => {
	let accountsPage = new AccountsPage(page);
	await accountsPage.goto();

	const editAccountsPage = await accountsPage.clickNewAccountButton();

	const accountName = 'Playwright test account';
	const nameTextbox = editAccountsPage.getNameTextbox();
	await nameTextbox.fill(accountName);

	const checkbox = editAccountsPage.getSharedAccountCheckbox();
	await expect(checkbox).not.toBeChecked();
	await checkbox.check();
	await expect(checkbox).toBeChecked();
	await checkbox.uncheck();
	await expect(checkbox).not.toBeChecked();

	const saveButton = editAccountsPage.getSaveButton();
	await saveButton.click();

	accountsPage = new AccountsPage(page);
	await accountsPage.goto();
	const card = await accountsPage.getAccountCardWithTitle(accountName);
	await expect(card.header).toHaveText(accountName);
	await expect(card.amountParagraph).toHaveText('0,00\u00A0kr.');
});
