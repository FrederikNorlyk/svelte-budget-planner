import { expect, test } from '@playwright/test';
import { App } from './src/app';
import { SettingsPage } from './src/settings-page';

test('Sign out', async ({ page }) => {
	await App.signIn(page);

	const settingsPage = await SettingsPage.goto(page);

	const loginPage = await settingsPage.clickSignOutButton();
	expect(loginPage).toBeDefined();
	await expect(loginPage.getSignInWithGitHubButton()).toBeVisible();
	await expect(loginPage.getSignInAsDemoUserButton()).toBeVisible();
	await expect(page.getByRole('button')).toHaveCount(2);
});
