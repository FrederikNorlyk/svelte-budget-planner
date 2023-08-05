<script lang="ts">
	import { Account } from '$lib/models/Account.js';
	import { Expense } from '$lib/models/Expense.js';
	import { AmountUtil } from '$lib/util/AmountUtil.js';
	import { CurrentAmountUtil } from '$lib/util/CurrentAmountUtil.js';
	import { DateUtil } from '$lib/util/DateUtil.js';
	import { i18n } from '$lib/localization/i18n.js';
	import NoEntries from '$lib/components/NoEntries.svelte';
	import AddButton from '$lib/components/AddButton.svelte';

	export let data;
	const account = Account.parse(data.account);
	const expenses: Expense[] = data.expenses.map((e) => Expense.parse(e));
	const currentAmountUtil = new CurrentAmountUtil();

	function localizePaymentFrequency(expense: Expense) {
		let key: String;
		let parameters: any = {}
		const numberOfPaymentDates = expense.getPaymentDates().length;

		switch (numberOfPaymentDates) {
			case 1:
				key = 'paid.yearly';
				break;
			case 2:
				key = 'paid.halfYearly';
				break;
			case 4:
				key = 'paid.quarterly';
				break;
			case 12:
			case 0:
				key = 'paid.monthly';
				break;
			default:
				key = 'paid.custom';
				parameters = { times: numberOfPaymentDates};
				break;
		}

		return $i18n(key, parameters);
	}
</script>

{#if expenses.length == 0}
	<AddButton href="/accounts/{account.getId()}/0" ariaLabel="Add new expense" />
	<NoEntries question="chat.noExpenses" />
{:else}
	<div class="flex flex-col space-y-3">
		{#each expenses as expense (expense.getId())}
			{@const nextPaymentDate = currentAmountUtil.getNextPaymentDateForExpense(expense)}
			{@const monthlyAmount = expense.getMonthlyAmount()}

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
					{#if !expense.isMonthlyExpense()}
						<small class="text-slate-500"
							>{AmountUtil.localize(monthlyAmount)}/{$i18n('month')}</small
						>
					{/if}
				</div>
				<div class="text-right text-slate-500">{localizePaymentFrequency(expense)}</div>
			</a>
		{/each}
		<AddButton href="/accounts/{account.getId()}/0" ariaLabel="Add new expense" />
	</div>
{/if}
