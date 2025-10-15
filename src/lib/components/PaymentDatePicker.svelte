<script lang="ts">
	import { PaymentDate } from '$lib/models/PaymentDate';
	import { _ } from 'svelte-i18n';
	import { Month } from '$lib/enums/Month';
	import MessageCircleMore from 'lucide-svelte/icons/message-circle-more';
	import type { Snippet } from 'svelte';

	interface Props {
		paymentDates: PaymentDate[];
		disabled?: boolean;
		children: Snippet;
	}

	let { paymentDates = $bindable(), disabled = false, children }: Props = $props();

	paymentDates.sort((d1, d2) => d1.month - d2.month);

	function addInput() {
		const newPaymentDate = new PaymentDate({
			id: Math.random(),
			expenseId: 0,
			month: Month.JANUARY + paymentDates.length,
			userIds: []
		});

		paymentDates = [...paymentDates, newPaymentDate];
	}
</script>

<div class="flex space-x-3">
	<p class="text-xl">{$_('paymentDates')}</p>
	{#if paymentDates.length < 12}
		<button {disabled} onclick={addInput} type="button" class="preset-filled btn btn-sm">
			{$_('addDate')}
		</button>
	{/if}
</div>

{@render children()}

{#if paymentDates.length === 0}
	<div class="flex">
		<MessageCircleMore size="20" />
		<span class="text-sm">{$_('expense.isMonthly.explanation')}</span>
	</div>
{/if}
