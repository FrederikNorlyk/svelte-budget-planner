<script lang="ts">
	import { Month } from '$lib/enums/Month.js';
	import { Account } from '$lib/models/Account.js';
	import { AmountUtil } from '$lib/util/AmountUtil';
	import { CurrentAmountUtil } from '$lib/util/CurrentAmountUtil.js';
	import { DateUtil } from '$lib/util/DateUtil.js';
	import { i18n } from '$lib/localization/i18n.js';

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

<div class="mb-3">
	<h1 class="text-3xl">{$i18n('accountBalance.title', { account: account.getName() })}</h1>
	<p>{$i18n('accountBalance.details')}</p>
</div>

<div class="space-y-3">
	{#each dates as date, index}
		<div class="card space-y-2 bg-white p-4">
			<div class="flex">
				<h1 class="grow text-xl capitalize">{DateUtil.getMonthName(date.getMonth())}</h1>

				<h1 class="justify-end text-xl">{AmountUtil.localize(monthAmounts[index])}</h1>
			</div>

			<div class="space-y-1">
				<div class="flex space-x-1 text-slate-400">
					<p class="">
						+{AmountUtil.localize(currentAmountUtil.getMonthlyBudgetTransferAmount(account))}
					</p>
					<p>{$i18n('budgetTransfer')}</p>
				</div>

				{#each currentAmountUtil.getExpensesIn(account, date.getMonth()) as expense (expense.getId() + '_' + index)}
					<div class="flex space-x-1">
						<p>- {AmountUtil.localize(expense.getAmount())}</p>
						<p>{expense.getName()}</p>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
