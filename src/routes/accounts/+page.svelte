<script lang="ts">
	import { Account } from '$lib/models/Account.js';
	import { i18n } from '$lib/localization/i18n';
	import NoEntries from '$lib/components/NoEntries.svelte';
	import AddButton from '$lib/components/AddButton.svelte';
	import { AmountUtil } from '$lib/util/AmountUtil.js';
	import IconArrowCircleRight from '$lib/icons/IconArrowCircleRight.svelte';
	import { Settings } from '$lib/models/Settings.js';

	export let data;
	const accounts = data.accounts.map((account) => Account.parse(account));
	const settings = Settings.parse(data.settings);

	let totalMonthlyAmount = 0;
	accounts.map((account) => (totalMonthlyAmount += account.monthlyAmount));
	let remainder = settings.income - totalMonthlyAmount;
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
		{#each accounts as account (account.id)}
			<a
				class="group card rounded-md bg-white p-10"
				href="/accounts/{account.id}"
				aria-label="Open the account {account.name}"
			>
				<div class="flex">
					<h2 class="grow text-2xl">{account.name}</h2>

					<IconArrowCircleRight
						cssClass="ml-2 flex-none h-8 w-8 text-slate-300 group-hover:text-slate-400"
					/>
				</div>

				<div class="flex flex-wrap">
					<p class="text-4xl font-bold">{AmountUtil.localize(account.monthlyAmount)}</p>
					<p class="mt-auto text-slate-500">/{$i18n('month')}</p>
				</div>
			</a>
		{/each}

		<AddButton href="/accounts/0/edit" ariaLabel="New account" />

		<div
			class="card mt-6 space-y-6 bg-white p-10 md:col-span-2 md:flex md:space-x-3 md:space-y-0 xl:col-span-3"
		>
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
				{#if settings.income > 0}
					<div class="flex flex-wrap">
						<h1 class="text-2xl">{AmountUtil.localize(remainder)}</h1>
						<p class="mt-auto text-slate-500">/{$i18n('month')}</p>
					</div>
				{:else}
					<a href="/settings" class="variant-filled btn basis-1/4 bg-orange-500"
						>{$i18n('enterIncome')}</a
					>
				{/if}
			</div>
		</div>
	</div>
{/if}
