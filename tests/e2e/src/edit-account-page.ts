import { AppPage } from './app-page';

export class EditAccountPage extends AppPage {
	protected getHeaderText(): string {
		return 'Edit account';
	}

	protected getSubTitleText(): string {
		return "Use the below fields to change the account's details";
	}

	getNameTextbox() {
		const span = this.page.locator('span', { hasText: 'Name' });
		const label = this.page.locator('label').filter({ has: span });
		return label.getByRole('textbox', { name: 'name' });
	}

	getSharedAccountCheckbox() {
		const paragraph = this.page.locator('p', { hasText: 'Shared account' });
		const label = this.page.locator('label').filter({ has: paragraph });
		return label.getByRole('checkbox', { name: 'shared' });
	}

	getSaveButton() {
		return this.page.getByRole('button', { name: 'Save' });
	}
}
