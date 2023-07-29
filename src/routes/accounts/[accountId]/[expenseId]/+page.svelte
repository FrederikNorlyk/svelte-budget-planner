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
			title: 'Delete expense',
			body: `You are about to delete an expense.`,
			buttonTextSubmit: 'Delete expense'
		};
		modalStore.trigger(modal);
	}
</script>

<form class="space-y-4" method="post" action="?/save">
	<div class="card space-y-2 bg-white p-4">
		<TextField name="name" label="Name" required={true} value={expense?.getName()} />
		<TextField name="amount" label="Amount" required={true} value={expense?.getAmount()} />
		<TextField name="frequency" label="Frequency" required={true} value={expense?.getFrequency()} />

		<AutoCompletingTextField
			name="tag"
			label="Tag"
			required={true}
			value={expense?.getTag()}
			options={tagOptions}
		/>

		<SlideToggle name="isEnabled" active="bg-primary-500" checked={expense?.isEnabled() ?? true}
			>Is enabled</SlideToggle
		>
	</div>

	<div class="card space-y-2 bg-white p-4">
		<PaymentDatePicker {paymentDates} />
	</div>
	<div class="flex space-x-2 p-4">
		<button class="btn variant-filled basis-1/4 bg-primary-500">Save</button>

		{#if expense != null}
			<button
				formnovalidate={true}
				class="btn variant-filled basis-1/4"
				on:click|preventDefault={showDeleteModal}>Delete</button
			>
		{/if}
	</div>
</form>
