<script lang="ts">
	import IconPencilSquare from '$lib/icons/IconPencilSquare.svelte';
	import { Account } from '$lib/models/Account.js';
	import { Expense } from '$lib/models/Expense.js';

	export let form
	export let data
	const account = Account.parse(data.account);
	const expenses = data.expenses.map((e) => Expense.parse(e));

	let isEditing = false;
	let name = form?.name ?? account.getName();
	let formElement: HTMLFormElement
	let nameField: HTMLInputElement

	function toggleEditing() {
		isEditing = !isEditing;
	}

	function focusElement(element: HTMLInputElement) {
		element.focus();
	}
</script>

<div>
	{#if isEditing}
		<form method="post" action="?/save" bind:this={formElement}>
			<input
				name="name"
				bind:this={nameField}
				bind:value={name}
				use:focusElement
				on:blur={() => {
					formElement.requestSubmit()
				}}
				class="text-3xl"
			/>
		</form>
	{:else}
		<button
		class="flex space-x-1 text-3xl"
			on:click={() => {
				toggleEditing();
			}}>

				<span>{name}</span>
				<IconPencilSquare cssClass="h-6 w-6" />

		</button>
	{/if}
</div>

<div class="flex flex-col space-y-2">
	<a class="underline" href="/accounts/{account.getId()}/0">New expense</a>
</div>

<div class="mt-3 flex flex-col space-y-3">
	{#each expenses as expense (expense.getId())}
	<a class="bg-slate-50" href="/accounts/{account.getId()}/{expense.getId()}">
		{expense.getName()} - {expense.getAmount()}
	</a>
	{/each}
</div>

<form class="mt-3 flex flex-col" method="post" action="?/delete">
	{#if form?.error}
		<p>{form.error}</p>
	{/if}
	<button class="btn variant-filled">Delete</button>
</form>