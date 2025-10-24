<script lang="ts">
	import ExpenseCard from '$lib/components/ExpenseCard.svelte';
	import AmountCard from '$lib/components/AmountCard.svelte';

	const { data } = $props();
	const expenses = data.expenses;

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
		<ExpenseCard {expense} />
	{/each}

	<div class="card-primary mt-9 p-5 xl:col-span-2">
		<AmountCard text="total" amount={totalMonthlyAmount} />
	</div>
</div>
