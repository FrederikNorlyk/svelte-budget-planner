<script lang="ts">
	import { Account } from '$lib/models/Account.js';
	import { i18n } from '$lib/localization/i18n';
	import NoEntries from '$lib/components/NoEntries.svelte';
	import AddButton from '$lib/components/AddButton.svelte';
	import { AmountUtil } from '$lib/util/AmountUtil.js';
	import IconArrowCircleRight from '$lib/icons/IconArrowCircleRight.svelte';

	export let data;
	const accounts = data.accounts.map((a) => Account.parse(a));
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
			<a
				class="group card flex rounded-md bg-white p-10"
				href="/accounts/{account.getId()}"
				aria-label="Open the account {account.getName()}"
			>
				<div class="grow">
					<h2 class="text-2xl">{account.getName()}</h2>
					<div class="flex">
						<h1 class="text-4xl">{AmountUtil.localize(account.getMonthlyAmount())}</h1>
						<p class="mt-auto text-slate-500">/{$i18n('month')}</p>
					</div>
				</div>

				<IconArrowCircleRight cssClass="flex-none h-8 w-8 text-slate-300 group-hover:text-slate-400" />
			</a>
		{/each}

		<AddButton href="/accounts/0/edit" ariaLabel="New account" />
	</div>
{/if}
