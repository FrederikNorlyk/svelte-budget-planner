import { AppPage } from './app-page';

export class EditExpensePage extends AppPage {
	protected getHeaderText(): string {
		return 'Edit expense';
	}

	protected getSubTitleText(): string {
		return "Use the below fields to change the expense's details";
	}

	get nameTextbox() {
		return this.page.getByLabel('Name');
	}

	get amountTextbox() {
		return this.page.getByLabel('Amount');
	}

	get isSharedSelect() {
		return this.page.getByLabel('The expense is');
	}

	get groupTextbox() {
		return this.page.getByRole('combobox', { name: 'Group' });
	}

	get isActiveCheckbox() {
		return this.page.getByLabel('Is active');
	}

	get addPaymentDateButton() {
		return this.page.getByRole('button', { name: 'Add date' });
	}

	get saveButton() {
		return this.page.locator('button', { hasText: 'Save' });
	}
}
