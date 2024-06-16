import type { Page } from '@playwright/test';
import { AppPage } from './app-page';

export class LoginPage extends AppPage {
	constructor(page: Page) {
		super(page);
	}

	async goto() {
		await this.page.goto('auth/signin');
	}

	async clickSignInWithADemoUser() {
		await this.page.getByRole('button', { name: 'Sign in with a demo user' }).click();
	}
}
