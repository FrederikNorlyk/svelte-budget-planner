<script lang="ts">
	import { Account } from '$lib/models/Account.js';
	import { i18n } from '$lib/localization/i18n';
	import NoEntries from '$lib/components/NoEntries.svelte';
	import AddButton from '$lib/components/AddButton.svelte';
	import { AmountUtil } from '$lib/util/AmountUtil.js';
	import IconArrowCircleRight from '$lib/icons/IconArrowCircleRight.svelte';
	import { Settings } from '$lib/models/Settings.js';

	export let data;
	const accounts = data.accounts.map((a) => Account.parse(a));
	const settings = Settings.parse(data.settings);

	let totalMonthlyAmount = 0;
	accounts.map((a) => (totalMonthlyAmount += a.getMonthlyAmount()));
	let remainder = settings.getIncome() - totalMonthlyAmount;
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
				class="group card rounded-md bg-white p-10"
				href="/accounts/{account.getId()}"
				aria-label="Open the account {account.getName()}"
			>
				<div class="flex">
					<h2 class="grow text-2xl">{account.getName()}</h2>

					<IconArrowCircleRight
						cssClass="ml-2 flex-none h-8 w-8 text-slate-300 group-hover:text-slate-400"
					/>
				</div>

				<div class="flex flex-wrap">
					<p class="text-4xl font-bold">{AmountUtil.localize(account.getMonthlyAmount())}</p>
					<p class="mt-auto text-slate-500">/{$i18n('month')}</p>
				</div>
			</a>
		{/each}

		<AddButton href="/accounts/0/edit" ariaLabel="New account" />

		<div class="card bg-white xl:col-span-3 md:col-span-2 md:flex md:space-x-3 md:space-y-0 space-y-6 mt-6 p-10">
			<div class="md:basis-1/2 xl:basis-1/3">
				<h2 class="text-xl">{$i18n('total')}</h2>
				<div class="flex flex-wrap">
					<h1 class="text-2xl">{AmountUtil.localize(totalMonthlyAmount)}</h1>
					<p class="mt-auto text-slate-500">/{$i18n('month')}</p>
				</div>
			</div>

			<!-- spacing -->
			<div class="hidden xl:block xl:basis-1/3"></div>

			<div class="md:basis-1/2 xl:basis-1/3">
				<h2 class="text-xl">{$i18n('remainderAfterExpenses')}</h2>
				{#if settings.getIncome() > 0}
					<div class="flex flex-wrap">
						<h1 class="text-2xl">{AmountUtil.localize(remainder)}</h1>
						<p class="mt-auto text-slate-500">/{$i18n('month')}</p>
					</div>
				{:else}
					<a href="/settings" class="btn variant-filled basis-1/4 bg-orange-500"
						>{$i18n('enterIncome')}</a
					>
				{/if}
			</div>
		</div>
	</div>
{/if}
