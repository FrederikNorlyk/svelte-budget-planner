<script lang="ts">
	import { Month } from '$lib/enums/Month.js';
	import { AmountUtil } from '$lib/util/AmountUtil';
	import { AccountBalanceUtil } from '$lib/util/AccountBalanceUtil.js';
	import { DateUtil } from '$lib/util/DateUtil.js';
	import { _ } from 'svelte-i18n';
	import { SvelteDate } from 'svelte/reactivity';

	const { data } = $props();
	const account = data.account;
	const accountBalanceUtil = new AccountBalanceUtil();

	const dates = [new SvelteDate()];
	let year = new SvelteDate().getFullYear();
	while (dates.length < 12) {
		const previousDate = dates[dates.length - 1];

		const newDate = new SvelteDate();
		newDate.setDate(1);

		if (previousDate.getMonth() == Month.DECEMBER) {
			newDate.setMonth(Month.JANUARY);
			year++;
		} else {
			newDate.setMonth(previousDate.getMonth() + 1);
		}
		newDate.setFullYear(year);
		dates.push(newDate);
	}

	const monthAmounts: number[] = [];
	dates.forEach((date) => {
		monthAmounts.push(accountBalanceUtil.getAccountBalanceOn(account, date));
	});
</script>

<div class="space-y-3">
	{#each dates as date, index (index)}
		{@const expenses = accountBalanceUtil.getExpensesIn(account, date.getMonth())}

		<div class="card bg-surface-100-900 space-y-2 p-4">
			<div class="flex">
				<h1 class="grow text-xl capitalize">{DateUtil.getMonthName(date.getMonth())}</h1>
				<h1 class="text-xl">{AmountUtil.localizeDecimal(monthAmounts[index])}</h1>
			</div>

			<div class="space-y-1">
				{#each expenses as expense (expense.id + '_' + index)}
					<div class="flex space-x-1">
						<p>- {AmountUtil.localizeDecimal(expense.amount)}</p>
						<p>{expense.name}</p>
					</div>
				{/each}

				<div class="flex space-x-1 text-slate-400">
					<p>
						+{AmountUtil.localizeDecimal(
							accountBalanceUtil.getMonthlyBudgetTransferAmount(account)
						)}
					</p>
					<p>{$_('budgetTransfer')}</p>
				</div>
			</div>
		</div>
	{/each}
</div>
