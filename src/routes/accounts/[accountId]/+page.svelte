<script lang="ts">
	import { Expense } from '$lib/models/Expense';
	import { AmountUtil } from '$lib/util/AmountUtil';
	import { CurrentAmountUtil } from '$lib/util/CurrentAmountUtil';
	import { DateUtil } from '$lib/util/DateUtil';
	import NoEntries from '$lib/components/NoEntries.svelte';
	import AddButton from '$lib/components/AddButton.svelte';
	import { Account } from '$lib/models/Account';
	import { type ReplacementVariables, i18n } from '$lib/localization/i18n';

	export let data;
	const account = Account.parse(data.account);
	const expenses: Expense[] = data.expenses.map((e) => Expense.parse(e));
	const currentAmountUtil = new CurrentAmountUtil();

	function getAmount(expense: Expense) {
		const amount = expense.isShared ? expense.amount / 2 : expense.amount;
		return AmountUtil.localize(amount);
	}

	function localizePaymentFrequency(expense: Expense) {
		let key: string;
		let parameters: ReplacementVariables = {};
		const numberOfPaymentDates = expense.paymentDates.length;

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
				parameters = { times: numberOfPaymentDates.toString() };
				break;
		}

		return $i18n(key, parameters);
	}
</script>

{#if expenses.length == 0}
	<AddButton href="/accounts/{account.id}/0" ariaLabel="Add new expense" />
	<NoEntries question="chat.noExpenses" />
{:else}
	<div class="grid grid-cols-1 gap-3 xl:grid-cols-2">
		{#each expenses as expense (expense.id)}
			{@const nextPaymentDate = currentAmountUtil.getNextPaymentDateForExpense(expense)}
			{@const monthlyAmount = expense.monthlyAmount}

			<a
				class="card grid grid-cols-2 space-y-2 bg-white p-4 {expense.isEnabled ? '' : 'opacity-60'}"
				href="/accounts/{account.id}/{expense.id}"
			>
				<div>
					<h2 class="text-xl">{expense.name}</h2>
					<small class="text-slate-500">{expense.tag}</small>
				</div>
				<div class="text-right text-slate-500">
					{#if !expense.isEnabled}
						{$i18n('expense.inactive')}
					{:else if nextPaymentDate != null}
						{$i18n('nextPayment')}: {DateUtil.localizeLongerFormat(nextPaymentDate)}
					{/if}
				</div>
				<div>
					<h1 class="inline-block text-2xl">{getAmount(expense)}</h1>
					{#if expense.isMonthlyExpense}
						<small class="text-slate-500">/{$i18n('month')}</small>
					{:else}
						<small class="text-slate-500"
							>{AmountUtil.localize(monthlyAmount)}/{$i18n('month')}
						</small>
					{/if}
				</div>
				<div class="text-right text-slate-500">{localizePaymentFrequency(expense)}</div>
			</a>
		{/each}
		<AddButton href="/accounts/{account.id}/0" ariaLabel="Add new expense" />
	</div>
{/if}
