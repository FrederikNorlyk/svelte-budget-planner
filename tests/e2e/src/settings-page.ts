import type { Page } from '@playwright/test';
import { AppPage } from './app-page';
import { LoginPage } from './login-page';

export class SettingsPage extends AppPage {
	protected getHeaderText(): string {
		return 'Settings';
	}

	protected getSubTitleText(): string {
		return 'Here you can change the behaviour of the application';
	}

	static async goto(page: Page) {
		await page.goto('settings');
		return new SettingsPage(page);
	}

	async clickSignOutButton() {
		await this.page.getByRole('button', { name: 'Sign out' }).click();
		return new LoginPage(this.page);
	}
}
