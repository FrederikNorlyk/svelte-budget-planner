<script lang="ts">
	import { PaymentDate } from '$lib/models/PaymentDate';
	import CalendarDatePicker from '$lib/components/CalendarDatePicker.svelte';
	import { i18n } from '$lib/localization/i18n';
	import { Month } from '$lib/enums/Month';

	export let paymentDates: PaymentDate[]

	function onInputRemoved(paymentDate: PaymentDate) {
		paymentDates = paymentDates.filter((p) => {
			return p.getId() != paymentDate.getId()
		})
	}

	function addInput() {
		paymentDates = [...paymentDates, new PaymentDate(Math.random(), 0, Month.JANUARY, 1)]
	}
</script>

<div class="flex space-x-3">
	<p class="text-xl">{$i18n('paymentDates')}</p>
	<button on:click={addInput} type="button" class="btn btn-sm variant-filled">
		{$i18n('addDate')}
	</button>
</div>

{#each paymentDates as paymentDate (paymentDate.getId())}
	<CalendarDatePicker {paymentDate} {onInputRemoved} />
{/each}
