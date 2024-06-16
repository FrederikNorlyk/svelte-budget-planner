import type { Locator, Page } from '@playwright/test';
import { AccountCard } from './account-card';
import { AppPage } from './app-page';

export class AccountsPage extends AppPage {
	readonly header: Locator;
	readonly subTitle: Locator;

	constructor(page: Page) {
		super(page);
		this.header = page.locator('h1', { hasText: 'Accounts' });

		this.subTitle = page.locator('p', {
			hasText:
				'Create and maintain your accounts. Accounts should contain expenses of a similar kind.'
		});
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

	async goto() {
		await this.page.goto('/accounts');
	}
}
