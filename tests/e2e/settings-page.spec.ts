import { expect, test } from '@playwright/test';
import { App } from './src/app';
import { SettingsPage } from './src/settings-page';

test('Sign out', async ({ page }) => {
	await App.signIn(page);

	const settingsPage = await SettingsPage.goto(page);

	const loginPage = await settingsPage.clickSignOutButton();
	expect(loginPage).toBeDefined();
	expect(loginPage.getSignInWithAGitHubButton()).toBeDefined();
	expect(loginPage.getSignInWithADemoUserButton()).toBeDefined();
});
