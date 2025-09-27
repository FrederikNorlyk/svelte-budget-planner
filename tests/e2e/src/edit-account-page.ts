import { AppPage } from './app-page';

export class EditAccountPage extends AppPage {
	protected getHeaderText(): string {
		return 'Edit account';
	}

	protected getSubTitleText(): string {
		return "Use the below fields to change the account's details";
	}

	get nameTextbox() {
		return this.page.getByLabel('Name');
	}

	get sharedAccountCheckbox() {
		return this.page.getByLabel('Shared account');
	}

	get saveButton() {
		return this.page.locator('button', { hasText: 'Save' });
	}
}
