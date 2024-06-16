import type { Locator } from '@playwright/test';

export class AccountCard {
	readonly card: Locator;
	readonly header: Locator;
	readonly arrowIcon: Locator;
	readonly amountParagraph: Locator;
	readonly monthParagraph: Locator;

	constructor(card: Locator) {
		this.card = card;
		this.header = card.locator('h2');
		this.arrowIcon = card.locator('svg');
		this.amountParagraph = card.locator('p.text-4xl');
		this.monthParagraph = card.locator('p', { hasText: '/month' });
	}

	async clickCard() {
		await this.card.click();
	}
}
