<script lang="ts">
	import NoEntries from '$lib/components/NoEntries.svelte';
	import AddButton from '$lib/components/AddButton.svelte';
	import ExpenseCard from '$lib/components/ExpenseCard.svelte';
	import { resolve } from '$app/paths';
	import AmountCard from '$lib/components/AmountCard.svelte';
	import { Collapsible } from '@skeletonlabs/skeleton-svelte';
	import ArrowUpDownIcon from 'lucide-svelte/icons/arrow-up-down';
	import { _ } from 'svelte-i18n';
	import type { Expense } from '$lib/models/Expense';

	const { data } = $props();
	const account = $derived(data.account!);

	const newExpenseUrl = $derived(
		resolve('/accounts/[accountId]/[expenseId]', {
			accountId: String(account.id),
			expenseId: '0'
		})
	);

	const expensesByTag = $derived(
		Map.groupBy(
			[...account.expenses].sort((a, b) => (a.tag ?? '').localeCompare(b.tag ?? '')),
			(expense) => expense.tag ?? ''
		)
	);
</script>

{#if account.expenses.length === 0}
	<AddButton href={newExpenseUrl} ariaLabel="Add new expense" />
	<NoEntries question="chat.noExpenses" />
{:else}
	<section class="grid gap-6">
		<AddButton href={newExpenseUrl} ariaLabel="Add new expense" />

		{#if expensesByTag.size === 1}
			{@const expenses = expensesByTag.values().next().value ?? []}
			{@render expenseList(expenses)}
		{:else}
			{#each expensesByTag as [tag, expenses] (tag)}
				<Collapsible defaultOpen={true} class="items-start">
					<Collapsible.Trigger
						class="hover:preset-tonal btn-secondary"
						aria-label={`Expand the group called "${tag}"`}
					>
						{#if tag}
							{tag}
						{:else}
							{$_('group.otherExpenses')}
						{/if}
						<span class="btn-icon">
							<ArrowUpDownIcon class="size-4" />
						</span>
					</Collapsible.Trigger>
					<Collapsible.Content class="w-full">
						{@render expenseList(expenses)}
					</Collapsible.Content>
				</Collapsible>
			{/each}
		{/if}
	</section>

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

{#snippet expenseList(expenses: Expense[])}
	<div class="grid w-full grid-cols-1 gap-3 xl:grid-cols-2 2xl:grid-cols-3">
		{#each expenses as expense (expense.id)}
			<ExpenseCard {expense} />
		{/each}
	</div>
{/snippet}
