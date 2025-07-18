import type { Page } from '@playwright/test';
import { LoginPage } from './login-page';

export class App {
	static async signInAndReset(page: Page) {
		await this.signIn(page);

		await page.goto('e2e/reset');
	}

	static async signIn(page: Page) {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await loginPage.getSignInWithADemoUserButton().click();

		await page.goto('');
	}
}
