<script lang="ts">
	import NoEntries from '$lib/components/NoEntries.svelte';
	import AddButton from '$lib/components/AddButton.svelte';
	import AmountCard from '$lib/components/AmountCard.svelte';
	import AccountCard from '$lib/components/AccountCard.svelte';
	import { resolve } from '$app/paths';

	const { data } = $props();
	const accounts = data.accounts;
	const settings = data.settings;

	let totalMonthlyAmount = $state(0);
	accounts.map((account) => (totalMonthlyAmount += account.monthlyAmount));
	const remainder = $derived(settings.income - totalMonthlyAmount);

	const newAccountUrl = resolve('/accounts/[accountId]/edit', { accountId: '0' });
</script>

{#if accounts.length === 0}
	<AddButton href={newAccountUrl} ariaLabel="New account" />
	<NoEntries question="chat.noAccounts" />
{:else}
	<div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
		{#each accounts as account (account.id)}
			<AccountCard {account} />
		{/each}

		<AddButton href={newAccountUrl} ariaLabel="New account" />
	</div>

	<div class="card-primary mt-9 grid grid-cols-1 gap-3 p-10 md:grid-cols-2 md:p-0 xl:grid-cols-3">
		<AmountCard text="total" amount={totalMonthlyAmount} />
		<div class="hidden xl:block"></div>
		<AmountCard text="remainderAfterExpenses" amount={remainder} />
	</div>
{/if}
