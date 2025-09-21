<script lang="ts">
	import NoEntries from '$lib/components/NoEntries.svelte';
	import AddButton from '$lib/components/AddButton.svelte';
	import ExpenseCard from '$lib/components/ExpenseCard.svelte';
	import { resolve } from '$app/paths';
	import AmountCard from '$lib/components/AmountCard.svelte';

	const { data } = $props();
	const account = data.account;

	const newExpenseUrl = resolve('/accounts/[accountId]/[expenseId]', {
		accountId: String(account.id),
		expenseId: '0'
	});
</script>

{#if account.expenses.length === 0}
	<AddButton href={newExpenseUrl} ariaLabel="Add new expense" />
	<NoEntries question="chat.noExpenses" />
{:else}
	<div class="grid grid-cols-1 gap-3 xl:grid-cols-2">
		{#each account.expenses as expense (expense.id)}
			<ExpenseCard {expense} {account} />
		{/each}
		<AddButton href={newExpenseUrl} ariaLabel="Add new expense" />
	</div>

	<div
		class="card bg-surface-100-900 mt-9 grid grid-cols-1 gap-3 p-10 md:grid-cols-2 md:p-0 xl:grid-cols-3"
	>
		<AmountCard text="total" amount={account.monthlyAmountWithTotalShared} />
		<div class="hidden xl:block"></div>
		{#if account.isShared}
			<AmountCard text="yourBudgetTransfer" amount={account.monthlyAmount} />
		{:else}
			<div id="not-shared-div" class="hidden xl:block"></div>
		{/if}
	</div>
{/if}
