<script lang="ts">
	import CircleArrowRight from 'lucide-svelte/icons/circle-arrow-right';
	import type { Account } from '$lib/models/Account';
	import { AmountUtil } from '$lib/util/AmountUtil';
	import { AccountBalanceUtil } from '$lib/util/AccountBalanceUtil';
	import { DateUtil } from '$lib/util/DateUtil';
	import { _ } from 'svelte-i18n';

	interface Props {
		account: Account;
	}

	const { account }: Props = $props();
	const accountBalanceUtil = new AccountBalanceUtil();
	const nextPaymentDate = accountBalanceUtil.getNextPaymentDate(account);
</script>

<a
	class="group card-primary clickable p-10"
	href="/balance/{account.id}"
	aria-label="Open the balance overview of the account {account.name}"
>
	<div class="flex">
		<h2 class="grow text-2xl">{account.name}</h2>

		<CircleArrowRight
			class="text-primary-400-600 group-hover:text-primary-600-400 ml-2 h-8 w-8 flex-none"
		/>
	</div>
	<div class="flex">
		<p class="grow text-4xl font-bold">
			{AmountUtil.localizeInteger(accountBalanceUtil.getCurrentAmount(account))}
		</p>
		{#if nextPaymentDate != null}
			<p class="text-neutral text-end">
				{$_('nextPayment')}: {DateUtil.localizeLongerFormat(nextPaymentDate)}
			</p>
		{/if}
	</div>
</a>
