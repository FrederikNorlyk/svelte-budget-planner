<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { Account } from '$lib/models/Account.js';
	import { i18n } from '$lib/localization/i18n';
	import NoEntries from '$lib/components/NoEntries.svelte';

	export let data;
	const accounts = data.accounts.map((a) => Account.parse(a));

	function getTotalAmount(account: Account) {
		return data.totalAmounts.find((row) => row.accountId === account.getId())?.totalAmount ?? 0;
	}
</script>

<h1 class="text-3xl">{$i18n('accounts.title')}</h1>
<p>{$i18n('accounts.details')}</p>

<div class="flex flex-col space-y-2">
	<a class="underline" href="/accounts/0/edit">{$i18n('newAccount')}</a>
</div>

<div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
	{#if accounts.length === 0}
		<NoEntries question="chat.noAccounts" />
	{:else}
		{#each accounts as account (account.getId())}
			<Card {account} totalAmount={getTotalAmount(account)} />
		{/each}
	{/if}
</div>
