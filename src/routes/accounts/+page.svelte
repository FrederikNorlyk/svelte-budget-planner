<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { Account } from '$lib/models/Account.js';

	export let data;
	const accounts = data.accounts.map((a) => Account.parse(a));

	function getTotalAmount(account: Account) {
		return data.totalAmounts.find((row) => row.accountId === account.getId())?.totalAmount ?? 0;
	}
</script>

<h1 class="text-3xl">Accounts</h1>
<p>Detailed text explaining what accounts are</p>

<div class="flex flex-col space-y-2">
	<a class="underline" href="/accounts/0/edit">New account</a>
</div>

<div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
	{#each accounts as account (account.getId())}
		<Card {account} totalAmount={getTotalAmount(account)} />
	{/each}
</div>
