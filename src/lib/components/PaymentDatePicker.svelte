<script lang="ts">
	import { PaymentDate } from '$lib/models/PaymentDate';
	import CalendarDatePicker from '$lib/components/CalendarDatePicker.svelte';

	export let paymentDates: PaymentDate[];
	if (paymentDates.length == 0) {
		paymentDates.push(new PaymentDate(0, 0, 1, 0));
	}

	function onInputRemoved(paymentDate: PaymentDate) {
		paymentDates = paymentDates.filter((p) => {
			return p.getId() != paymentDate.getId();
		});
	}

	function addInput() {
		paymentDates = [...paymentDates, new PaymentDate(Math.random(), 0, 0, 0)]
	}
</script>

<div class="flex space-x-3">
	<p class="text-xl">Payment dates</p>
	<button on:click={addInput} type="button" class="btn btn-sm variant-filled">
		Add date
	</button>
</div>

{#each paymentDates as paymentDate (paymentDate.getId())}
	<CalendarDatePicker {paymentDate} canDelete={paymentDates.length > 1} {onInputRemoved} />
{/each}
