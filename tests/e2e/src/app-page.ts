import type { Page } from '@playwright/test';

export abstract class AppPage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}
}
