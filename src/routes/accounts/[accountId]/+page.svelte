<script lang="ts">
	import { Account } from '$lib/models/Account.js';
	import { Expense } from '$lib/models/Expense.js';

	export let data;
	const account = Account.parse(data.account);
	const expenses = data.expenses.map((e) => Expense.parse(e));
</script>

<div class="flex flex-col space-y-2">
	<a class="underline" href="/accounts/{account.getId()}/0">New expense</a>
	<a class="underline" href="/accounts/{account.getId()}/edit">Edit account</a>
</div>

<div class="mt-3 flex flex-col space-y-3">
	{#each expenses as expense (expense.getId())}
		<a class="card space-y-2 bg-white p-4" href="/accounts/{account.getId()}/{expense.getId()}">
			{expense.getName()} - {expense.getAmount()}
		</a>
	{/each}
</div>