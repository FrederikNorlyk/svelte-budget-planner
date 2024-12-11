<script lang="ts">
	import { PaymentDate } from '$lib/models/PaymentDate';
	import MonthPicker from '$lib/components/MonthPicker.svelte';
	import { _ } from 'svelte-i18n';
	import { Month } from '$lib/enums/Month';
	import MessageCircleMore from 'lucide-svelte/icons/message-circle-more';

	interface Props {
		paymentDates: PaymentDate[];
		disabled?: boolean;
	}

	let { paymentDates = $bindable(), disabled = false }: Props = $props();

	paymentDates.sort((d1, d2) => d1.month - d2.month);

	function onInputRemoved(paymentDate: PaymentDate) {
		paymentDates = paymentDates.filter((p) => {
			return p.id != paymentDate.id;
		});
	}

	function addInput() {
		const newPaymentDate = new PaymentDate({
			id: Math.random(),
			expenseId: 0,
			month: Month.JANUARY,
			userId: []
		});

		paymentDates = [...paymentDates, newPaymentDate];
	}
</script>

<div class="flex space-x-3">
	<p class="text-xl">{$_('paymentDates')}</p>
	<button {disabled} onclick={addInput} type="button" class="variant-filled btn btn-sm">
		{$_('addDate')}
	</button>
</div>

{#each paymentDates as paymentDate (paymentDate.id)}
	<MonthPicker {paymentDate} {disabled} {onInputRemoved} />
{/each}

{#if paymentDates.length === 0}
	<div class="flex">
		<MessageCircleMore size="20" />
		<span class="text-sm">{$_('expense.isMonthly.explanation')}</span>
	</div>
{/if}
