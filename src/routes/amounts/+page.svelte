<script lang="ts">
	import { Account } from '$lib/models/Account.js';
	import { DateUtil } from '$lib/util/DateUtil';
	import {CurrentAmountUtil} from '$lib/util/CurrentAmountUtil';
	import { i18n } from '$lib/localization/i18n';

	export let data;

	const accounts = data.accounts.map((account) => Account.parse(account))
</script>

<h1 class="text-3xl">{$i18n('balance.title')}</h1>
<p>{$i18n('balance.details')}</p>

<div class="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
	{#each accounts as account (account.getId())}
		{@const nextPaymentDate = CurrentAmountUtil.getNextPaymentDate(account)}
		<div class="card flex rounded-md bg-white p-10">
			<div class="grow">
				<div class="flex">
					<h2 class="text-2xl">{account.getName()}</h2>
					<span class="grow" />
					{#if nextPaymentDate != null}
						<p class="text-slate-500">
							Next payment: {DateUtil.localizeLongerFormat(nextPaymentDate)}
						</p>
					{/if}
				</div>
				<h1 class="text-4xl">{CurrentAmountUtil.getCurrentAmmount(account)}</h1>
			</div>
		</div>
	{/each}
</div>
