<script lang="ts">
	import { Expense } from '$lib/models/Expense';
	import ExpenseCard from '$lib/components/ExpenseCard.svelte';
	import AmountCard from '$lib/components/AmountCard.svelte';

	const { data } = $props();
	const accounts = data.accounts;
	const expenses = data.expenses;

	function getAccount(expense: Expense) {
		return accounts.find((a) => a.id == expense.accountId)!;
	}

	let totalMonthlyAmount = $state(0);
	for (const expense of expenses) {
		if (!expense.isEnabled) {
			continue;
		}
		totalMonthlyAmount += expense.monthlyAmount;
	}
</script>

<div class="grid grid-cols-1 gap-3 xl:grid-cols-2">
	{#each expenses as expense (expense.id)}
		<ExpenseCard {expense} account={getAccount(expense)} />
	{/each}

	<div class="card bg-surface-100-900 mt-2 p-4 xl:col-span-2">
		<AmountCard text="total" amount={totalMonthlyAmount} />
	</div>
</div>
