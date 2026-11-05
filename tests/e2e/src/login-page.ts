import { type Page } from '@playwright/test';

export class LoginPage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async goto() {
		await this.page.goto('auth/signin');
	}

	async signInAsDemoUser() {
		await this.getSignInAsDemoUserButton().click();
	}

	getSignInWithGitHubButton() {
		return this.page.getByRole('button', { name: 'Sign in with GitHub' });
	}

	getSignInAsDemoUserButton() {
		return this.page.getByRole('button', { name: 'Sign in as a demo user' });
	}
}
