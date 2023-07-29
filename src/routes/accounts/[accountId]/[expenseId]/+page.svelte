<script lang="ts">
	import TextField from '$lib/components/TextField.svelte';
	import { Expense } from '$lib/models/Expense.js';
	import { SlideToggle, type AutocompleteOption } from '@skeletonlabs/skeleton';
	import AutoCompletingTextField from '$lib/components/AutoCompletingTextField.svelte';
	import PaymentDatePicker from '$lib/components/PaymentDatePicker.svelte';
	import { PaymentDate } from '$lib/models/PaymentDate.js';
	import { toastStore } from '@skeletonlabs/skeleton';

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
			background: 'variant-filled-error',
		});
	}
</script>

<form class="card space-y-2 bg-white p-4" method="post" action="?/save">
	<TextField name="name" label="Name" required={true} value={expense?.getName()} />
	<TextField name="amount" label="Amount" required={true} value={expense?.getAmount()} />
	<TextField name="frequency" label="Frequency" required={true} value={expense?.getFrequency()} />

	<PaymentDatePicker {paymentDates} />

	<AutoCompletingTextField name="tag" label="Tag" required={true} value={expense?.getTag()} options={tagOptions} />

	<SlideToggle name="isEnabled" active="bg-primary-500" checked={expense?.isEnabled() ?? true}
		>Is enabled</SlideToggle
	>

	<div class="flex space-x-2">
		<button class="btn variant-filled basis-1/4 bg-primary-500">Save</button>

		{#if expense != null}
			<button formnovalidate={true} class="btn variant-filled basis-1/4" formaction="?/delete">Delete expense</button>
		{/if}
	</div>
</form>
