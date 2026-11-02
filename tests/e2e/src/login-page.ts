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
		const actionUrl = new URL('?/demo', this.page.url()).toString();
		const response = await this.page.request.post(actionUrl, { form: {} });

		if (!response.ok()) {
			throw new Error(`Demo sign-in failed with status ${response.status()}`);
		}
	}

	getSignInWithGitHubButton() {
		return this.page.getByRole('button', { name: 'Sign in with GitHub' });
	}
}
