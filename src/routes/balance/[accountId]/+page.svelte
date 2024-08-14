<script lang="ts">
	import { Month } from '$lib/enums/Month.js';
	import { Account } from '$lib/models/Account.js';
	import { AmountUtil } from '$lib/util/AmountUtil';
	import { CurrentAmountUtil } from '$lib/util/CurrentAmountUtil.js';
	import { DateUtil } from '$lib/util/DateUtil.js';
	import { _ } from 'svelte-i18n';

	export let data;
	const account = Account.parse(data.account);
	const currentAmountUtil = new CurrentAmountUtil();

	const dates = [new Date()];
	let year = new Date().getFullYear();
	while (dates.length < 12) {
		const previousDate = dates[dates.length - 1];

		let newDate = new Date();
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
		monthAmounts.push(currentAmountUtil.getAccountBalanceOn(account, date));
	});
</script>

<div class="space-y-3">
	{#each dates as date, index}
		{@const expenses = currentAmountUtil.getExpensesIn(account, date.getMonth())}

		<div class="card space-y-2 bg-white p-4">
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
						+{AmountUtil.localizeDecimal(currentAmountUtil.getMonthlyBudgetTransferAmount(account))}
					</p>
					<p>{$_('budgetTransfer')}</p>
				</div>
			</div>
		</div>
	{/each}
</div>
