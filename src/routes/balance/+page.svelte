<script lang="ts">
	import { Account } from '$lib/models/Account.js';
	import { DateUtil } from '$lib/util/DateUtil';
	import { CurrentAmountUtil } from '$lib/util/CurrentAmountUtil';
	import { i18n } from '$lib/localization/i18n';
	import { AmountUtil } from '$lib/util/AmountUtil.js';

	export let data;

	const accounts = data.accounts.map((account) => Account.parse(account));
	const currentAmountUtil = new CurrentAmountUtil();
</script>

<div class="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
	{#each accounts as account (account.id)}
		{@const nextPaymentDate = currentAmountUtil.getNextPaymentDate(account)}

		<a
			class="card grid grid-cols-2 rounded-md bg-white p-6 sm:p-10"
			href="/balance/{account.id}"
			aria-label="Open the balance overview of the account {account.name}"
		>
			<h2 class="text-2xl">{account.name}</h2>
			{#if nextPaymentDate != null}
				<p class="text-end text-slate-500">
					{$i18n('nextPayment')}: {DateUtil.localizeLongerFormat(nextPaymentDate)}
				</p>
			{/if}
			<h1 class="col-span-2 text-4xl">
				{AmountUtil.localize(currentAmountUtil.getCurrentAmmount(account))}
			</h1>
		</a>
	{/each}
</div>
