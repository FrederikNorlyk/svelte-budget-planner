<script lang="ts">
	import Checkbox from '$lib/components/Checkbox.svelte';
	import SelectField from '$lib/components/SelectField.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import { Expense } from '$lib/models/Expense.js';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';

	export let form;
	export let data;
	const expense = data.expense != null ? Expense.parse(data.expense) : null;

	let tagOptions: AutocompleteOption[] = []
	data.tags.forEach(tag => {
		tagOptions.push({ label: tag, value: tag })
	})
</script>

{#if form?.error}
	<p class="bg-red-200">Error: {form.error}</p>
{/if}

<div class="card space-y-2 bg-white p-4">
	<form class="space-y-2" method="post" action="?/save">
		<TextField name="name" label="Name" value={expense?.getName()} />
		<TextField name="amount" label="Amount" value={expense?.getAmount()} />
		<TextField name="frequency" label="Frequency" value={expense?.getFrequency()} />
		<SelectField name="tag" label="Tag" value={expense?.getTag()} options={tagOptions} />
		<Checkbox name="isEnabled" label="Is enabled" checked={expense?.isEnabled() ?? true} />

		<button class="btn variant-filled bg-primary-500">Save</button>
		<a href="." class="btn variant-filled">Back</a>

		{#if expense != null}
			<button class="btn variant-filled" formaction="?/delete">Delete</button>
		{/if}
	</form>
</div>
