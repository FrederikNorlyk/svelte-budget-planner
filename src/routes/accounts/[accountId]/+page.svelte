<script lang="ts">
	import { Account } from '$lib/models/Account.js';
	import { Expense } from '$lib/models/Expense.js';
	import { Frequency } from '$lib/models/Frequency.js';
	import { AmountUtil } from '$lib/util/AmountUtil.js';
	import { CurrentAmountUtil } from '$lib/util/CurrentAmountUtil.js';
	import { DateUtil } from '$lib/util/DateUtil.js';
	import { i18n } from '$lib/localization/i18n.js';
	import NoEntries from '$lib/components/NoEntries.svelte';

	export let data;
	const account = Account.parse(data.account);
	const expenses: Expense[] = data.expenses.map((e) => Expense.parse(e));

	function localizePaymentFrequency(expense: Expense) {
		let key: String;
		switch (expense.getFrequency()) {
			case Frequency.YEARLY:
				key = 'paid.yearly';
				break;
			case Frequency.HALF_YEARLY:
				key = 'paid.halfYearly';
				break;
			case Frequency.QUARTERLY:
				key = 'paid.quarterly';
				break;
			case Frequency.MONTHLY:
			default:
				key = 'paid.monthly';
				break;
		}

		return $i18n(key);
	}
</script>

<div class="flex flex-col space-y-2">
	<a class="underline" href="/accounts/{account.getId()}/0">New expense</a>
	<a class="underline" href="/accounts/{account.getId()}/edit">Edit account</a>
</div>

<div class="mt-3 flex flex-col space-y-3">
	{#if expenses.length == 0}
		<NoEntries question="chat.noExpenses" />
	{:else}
		{#each expenses as expense (expense.getId())}
			{@const nextPaymentDate = CurrentAmountUtil.getNextPaymentDateForExpense(expense)}
			{@const monthlyAmount = expense.getAmount() / expense.getFrequencyNumber()}

			<a
				class="card grid grid-cols-2 space-y-2 bg-white p-4 {expense.isEnabled()
					? ''
					: 'opacity-60'}"
				href="/accounts/{account.getId()}/{expense.getId()}"
			>
				<div>
					<h2 class="text-xl">{expense.getName()}</h2>
					<small class="text-slate-500">{expense.getTag()}</small>
				</div>	
				<div class="text-right text-slate-500">
					{#if !expense.isEnabled()}
						{$i18n('expense.inactive')}
					{:else if nextPaymentDate != null}
						{$i18n('nextPayment')}: {DateUtil.localizeLongerFormat(nextPaymentDate)}
					{/if}
				</div>
				<div>
					<h1 class="inline-block text-2xl">{AmountUtil.localize(expense.getAmount())}</h1>
					{#if expense.getFrequency() != Frequency.MONTHLY}
						<small class="text-slate-500"
							>{AmountUtil.localize(monthlyAmount)}/{$i18n('month')}</small
						>
					{/if}
				</div>
				<div class="text-right text-slate-500">{localizePaymentFrequency(expense)}</div>
			</a>
		{/each}
	{/if}
</div>
