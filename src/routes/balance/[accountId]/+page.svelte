<script lang="ts">
	import { Month } from '$lib/enums/Month.js';
	import { Account } from '$lib/models/Account.js';
	import { AmountUtil } from '$lib/util/AmountUtil';
	import { CurrentAmountUtil } from '$lib/util/CurrentAmountUtil.js';
	import { DateUtil } from '$lib/util/DateUtil.js';
    
    export let data
    const account = Account.parse(data.account)
    const currentAmountUtil = new CurrentAmountUtil()

    const dates = [new Date()]
    let year = (new Date()).getFullYear()
	while (dates.length < 12) {
        const previousDate = dates[dates.length - 1]
        
        let newDate = new Date();
        newDate.setDate(1)

        if (previousDate.getMonth() == Month.DECEMBER) {
            newDate.setMonth(Month.JANUARY)
            year++
        } else {
            newDate.setMonth(previousDate.getMonth() + 1)
        }
        newDate.setFullYear(year)
        dates.push(newDate)
	}

    const monthAmounts: number[] = []
    dates.forEach(date => {
        monthAmounts.push(currentAmountUtil.getAccountBalanceOn(account, date))
    })
</script>

{#if account.getExpenses().length == 0}
	<h1>No expenses</h1>
{:else}
	<div class="grid grid-cols-1 gap-3">
		{#each dates as date, index}
            <div class="flex space-x-1">
                <h1>{DateUtil.getMonthName(date.getMonth())}</h1>
                <h1>{AmountUtil.localize(monthAmounts[index])}</h1>
            </div>
            <p>Transfer: +{AmountUtil.localize(account.getMonthlyAmountWithTotalShared())}</p>
            {#each currentAmountUtil.getExpensesIn(account, date.getMonth()) as expense (expense.getId() + "_" + index)}
                <p>{expense.getName()}: -{expense.getAmount()}</p>
            {/each}
		{/each}
	</div>
{/if}
