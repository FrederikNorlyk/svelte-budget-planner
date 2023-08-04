<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { Account } from '$lib/models/Account.js';
	import { i18n } from '$lib/localization/i18n';
	import NoEntries from '$lib/components/NoEntries.svelte';
	import IconPlus from '$lib/icons/IconPlus.svelte';
	import AddButton from '$lib/components/AddButton.svelte';

	export let data;
	const accounts = data.accounts.map((a) => Account.parse(a));

	function getTotalAmount(account: Account) {
		return data.totalAmounts.find((row) => row.accountId === account.getId())?.totalAmount ?? 0;
	}
</script>

<div class="mb-3">
	<h1 class="text-3xl">{$i18n('accounts.title')}</h1>
	<p>{$i18n('accounts.details')}</p>
</div>

{#if accounts.length === 0}
	<AddButton href="/accounts/0/edit" ariaLabel="New account" />
	<NoEntries question="chat.noAccounts" />
{:else}
	<div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
		{#each accounts as account (account.getId())}
			<Card {account} totalAmount={getTotalAmount(account)} />
		{/each}

		<AddButton href="/accounts/0/edit" ariaLabel="New account" />
	</div>
{/if}
