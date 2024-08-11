<script lang="ts">
	import { Expense } from '$lib/models/Expense';
	import { Account } from '$lib/models/Account';
	import ExpenseCard from '$lib/components/ExpenseCard.svelte';

	export let data;
	const accounts: Account[] = data.accounts.map((a) => Account.parse(a));
	const expenses: Expense[] = data.expenses.map((e) => Expense.parse(e));

	function getAccount(expense: Expense) {
		return accounts.find((a) => a.id == expense.accountId)!;
	}
</script>

<div class="grid grid-cols-1 gap-3 xl:grid-cols-2">
	{#each expenses as expense (expense.id)}
		<ExpenseCard {expense} account={getAccount(expense)} />
	{/each}
</div>
