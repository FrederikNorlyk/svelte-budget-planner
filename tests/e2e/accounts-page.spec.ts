import { expect, test } from '@playwright/test';
import { AccountsPage } from './src/accounts-page';
import { App } from './src/app';

test.beforeEach(async ({ page }) => {
	await App.signInAndReset(page);
});

test('add new account', async ({ page }) => {
	const accountsPage = await AccountsPage.goto(page);

	const editAccountsPage = await accountsPage.clickNewAccountButton();

	const accountName = 'Playwright test account';
	const nameTextbox = editAccountsPage.getNameTextbox();
	await nameTextbox.fill(accountName);

	await editAccountsPage.clickSaveButton();

	const card = await accountsPage.getAccountCardWithTitle(accountName);
	await expect(card.header).toHaveText(accountName);
	await expect(card.amountParagraph).toHaveText('0,00\u00A0kr.');
});
