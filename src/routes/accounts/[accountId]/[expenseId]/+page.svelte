<script lang="ts">
	import TextField from '$lib/components/TextField.svelte';
	import { Expense } from '$lib/models/Expense.js';
	import { SlideToggle, type AutocompleteOption } from '@skeletonlabs/skeleton';
	import AutoCompletingTextField from '$lib/components/AutoCompletingTextField.svelte';
	import PaymentDatePicker from '$lib/components/PaymentDatePicker.svelte';
	import { PaymentDate } from '$lib/models/PaymentDate.js';

	export let form;
	export let data;
	const expense = data.expense != null ? Expense.parse(data.expense) : null;
	const paymentDates = data.paymentDates.map((d) => PaymentDate.parse(d))

	let tagOptions: AutocompleteOption[] = [];
	data.tags.forEach((tag) => {
		tagOptions.push({ label: tag, value: tag });
	});
</script>

{#if form?.error}
	<p class="bg-red-200">Error: {form.error}</p>
{/if}

<div class="card space-y-2 bg-white p-4">
	<form class="space-y-2" method="post" action="?/save">
		<TextField name="name" label="Name" value={expense?.getName()} />
		<TextField name="amount" label="Amount" value={expense?.getAmount()} />
		<TextField name="frequency" label="Frequency" value={expense?.getFrequency()} />

		<PaymentDatePicker {paymentDates} />

		<AutoCompletingTextField
			name="tag"
			label="Tag"
			value={expense?.getTag()}
			options={tagOptions}
		/>

		<SlideToggle name="isEnabled" active="bg-primary-500" checked={expense?.isEnabled() ?? true}>Is enabled</SlideToggle>

		<div class="flex">
			<button class="btn variant-filled basis-1/4 bg-primary-500">Save</button>

			{#if expense != null}
				<button class="btn variant-filled basis-1/4" formaction="?/delete">Delete expense</button>
			{/if}
		</div>
	</form>
</div>
