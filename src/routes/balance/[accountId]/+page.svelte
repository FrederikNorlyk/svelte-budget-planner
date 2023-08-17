<script lang="ts">
	import { Month } from '$lib/enums/Month.js';
	import { Account } from '$lib/models/Account.js';
	import { AmountUtil } from '$lib/util/AmountUtil';
	import { CurrentAmountUtil } from '$lib/util/CurrentAmountUtil.js';
	import { DateUtil } from '$lib/util/DateUtil.js';
    
    export let data
    const account = Account.parse(data.account)
    const currentAmountUtil = new CurrentAmountUtil()
    const currentMonth = (new Date()).getMonth()
    let startAmount = currentAmountUtil.getCurrentAmmount(account)

    const months: number[] = [currentMonth]
	while (months.length < 12) {
        const last = months[months.length - 1]
        
        if (last == Month.DECEMBER) {
            months.push(Month.JANUARY)
        } else {
            months.push(last + 1)
        }
	}

    const monthlyAmount = account.getMonthlyAmountWithTotalShared()
    const monthAmounts: number[] = [startAmount]
    while (monthAmounts.length < 12) {
        const last = monthAmounts[monthAmounts.length - 1]
        monthAmounts.push(last + monthlyAmount)
    }
</script>

{#if account.getExpenses().length == 0}
	<h1>No expenses</h1>
{:else}
	<div class="grid grid-cols-1 gap-3">
		{#each months as month, index}
            <div class="flex space-x-1">
                <h1>{DateUtil.getMonthName(month)}</h1>
                <h1>{AmountUtil.localize(monthAmounts[index])}</h1>
            </div>
            <p>Transfer: +{AmountUtil.localize(account.getMonthlyAmountWithTotalShared())}</p>
            {#each currentAmountUtil.getExpensesIn(account, month) as expense (expense.getId() + "_" + month)}
                <p>{expense.getName()}: -{expense.getAmount()}</p>
            {/each}
		{/each}
	</div>
{/if}
