<script lang="ts">
	import Checkbox from '$lib/components/Checkbox.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import { Expense } from '$lib/models/Expense.js';

	export let form;
	export let data;
	const expense = data.expense != null ? Expense.parse(data.expense) : null;
</script>

{#if form?.error}
	<p class="bg-red-200">Error: {form.error}</p>
{/if}

<form class="flex flex-col space-y-3" method="post" action="?/save">
	<TextField name="name" label="Name" value={expense?.getName()} />
	<TextField name="amount" label="Amount" value={expense?.getAmount()} />
	<TextField name="frequency" label="Frequency" value={expense?.getFrequency()} />
	<TextField name="tag" label="Tag" value={expense?.getTag()} />
	<Checkbox name="isEnabled" label="Is enabled" checked={expense?.isEnabled() ?? true} />

	<FormButton type="primary" text={expense == null ? 'Create expense' : 'Update expense'} />
</form>

{#if expense != null}
	<form class="mt-3 flex flex-col" method="post" action="?/delete">
		<FormButton type="danger" text="Delete" />
	</form>
{/if}
