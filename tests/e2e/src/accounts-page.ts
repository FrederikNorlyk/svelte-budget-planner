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

	async getCards() {
		const cards: AccountCard[] = [];
		const links = await this.page.locator('a.card').all();

		for (let i = 0; i < links.length; i++) {
			const link = links[i];
			cards.push(new AccountCard(link));
		}

		return cards;
	}

	async getAccountCardWithTitle(title: string) {
		const links = this.page.locator('a.card');
		const header = links.getByRole('heading', { name: title });
		const link = links.filter({ has: header });
		return new AccountCard(link);
	}

	async clickNewAccountButton() {
		await this.page.locator('a[aria-label="New account"]').click();
		return new EditAccountPage(this.page);
	}

	async goto() {
		await this.page.goto('/accounts');
	}
}
