import { type Page } from '@playwright/test';

export class LoginPage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async goto() {
		await this.page.goto('auth/signin');
	}

	getSignInWithADemoUserButton() {
		return this.page.getByRole('button', { name: 'Sign in with a demo user' }).waitFor();
	}

	getSignInWithGitHubButton() {
		return this.page.getByRole('button', { name: 'Sign in with GitHub' }).waitFor();
	}
}
