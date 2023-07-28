<script lang="ts">
	import type { PaymentDate } from '$lib/models/PaymentDate';
	import CalendarDatePicker from '$lib/components/CalendarDatePicker.svelte';

	export let paymentDates: PaymentDate[];
</script>

{#if paymentDates.length == 0}
	<CalendarDatePicker dayOfMonth={1} canDelete={false} />
{:else}
	{#each paymentDates as paymentDate (paymentDate.getId())}
		<CalendarDatePicker dayOfMonth={paymentDate.getDayOfMonth()} month={paymentDate.getMonth()} canDelete={true} />
	{/each}
{/if}
