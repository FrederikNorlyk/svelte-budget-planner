import { AccountCard } from './account-card';
import { AppPage } from './app-page';
import { EditAccountPage } from './edit-account-page';

export class AccountsPage extends AppPage {
	protected getHeaderText(): string {
		return 'Accounts';
	}

	protected getSubTitleText(): string {
		return 'Create and maintain your accounts. Accounts should contain expenses of a similar kind.';
	}

	async getAccountCardWithTitle(title: string) {
		const header = this.page.locator('a.card > div > h2', { hasText: title });
		const aTag = header.locator('..').locator('..');

		return new AccountCard(aTag);
	}

	async clickNewAccountButton() {
		await this.page.locator('a[aria-label="New account"]').click();
		return new EditAccountPage(this.page);
	}

	async goto() {
		await this.page.goto('accounts');
	}
}
