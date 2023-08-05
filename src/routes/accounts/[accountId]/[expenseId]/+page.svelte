<script lang="ts">
	import TextField from '$lib/components/TextField.svelte';
	import { Expense } from '$lib/models/Expense.js';
	import {
		SlideToggle,
		type AutocompleteOption,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import AutoCompletingTextField from '$lib/components/AutoCompletingTextField.svelte';
	import PaymentDatePicker from '$lib/components/PaymentDatePicker.svelte';
	import { PaymentDate } from '$lib/models/PaymentDate.js';
	import { toastStore, modalStore } from '@skeletonlabs/skeleton';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import { i18n } from '$lib/localization/i18n';
	import NumberField from '$lib/components/NumberField.svelte';

	export let form;
	export let data;
	const expense = data.expense != null ? Expense.parse(data.expense) : null;
	const paymentDates = data.paymentDates.map((d) => PaymentDate.parse(d));

	let tagOptions: AutocompleteOption[] = [];
	data.tags.forEach((tag) => {
		tagOptions.push({ label: tag, value: tag });
	});

	if (form?.error) {
		toastStore.trigger({
			message: form.error,
			background: 'variant-filled-error'
		});
	}

	function showDeleteModal(): void {
		const component: ModalComponent = { ref: DeleteModal };
		const modal: ModalSettings = {
			type: 'component',
			component: component,
			title: $i18n('deleteExpense.title'),
			body: $i18n('deleteExpense.body'),
			buttonTextSubmit: $i18n('button.delete'),
			buttonTextCancel: $i18n('button.cancel')
		};
		modalStore.trigger(modal);
	}
</script>

<form class="space-y-4" method="post" action="?/save">
	<div class="card space-y-2 bg-white p-4">
		<TextField
			name="name"
			label={$i18n('expense.name')}
			autofocus={expense == null}
			required={true}
			value={expense?.getName()}
		/>
		
		<NumberField
			name="amount"
			label={$i18n('expense.amount')}
			required={true}
			value={expense?.getAmount()}
		/>

		<AutoCompletingTextField
			name="tag"
			label={$i18n('expense.group')}
			value={expense?.getTag()}
			options={tagOptions}
		/>

		<SlideToggle name="isEnabled" active="bg-primary-500" checked={expense?.isEnabled() ?? true}
			>{$i18n('expense.isEnabled')}</SlideToggle
		>
	</div>

	<div class="card space-y-2 bg-white p-4">
		<PaymentDatePicker {paymentDates} />
	</div>

	<div class="flex space-x-2 p-4">
		<button class="btn variant-filled basis-1/4 bg-primary-500">{$i18n('button.save')}</button>

		{#if expense != null}
			<button
				formnovalidate={true}
				class="btn variant-filled basis-1/4"
				on:click|preventDefault={showDeleteModal}>{$i18n('button.delete')}</button
			>
		{/if}
	</div>
</form>
