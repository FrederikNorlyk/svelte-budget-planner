<script lang="ts">
	import type { SelectOption } from '$lib/components/types/SelectOption';
	import X from 'lucide-svelte/icons/x';
	import type { PaymentDate } from '$lib/models/PaymentDate';
	import { DateUtil } from '$lib/util/DateUtil';
	import type { Snippet } from 'svelte';

	interface Props {
		paymentDates: PaymentDate[];
		paymentDate: PaymentDate;
		disabled?: boolean;
		children: Snippet;
	}

	let { paymentDates = $bindable(), paymentDate, disabled = false, children }: Props = $props();

	const months: SelectOption<number>[] = [];
	for (let i = 0; i < 12; i++) {
		months.push({
			value: i,
			label: DateUtil.getMonthName(i)
		});
	}

	function removeSelf() {
		paymentDates = paymentDates.filter((p) => {
			return p.id != paymentDate.id;
		});
	}
</script>

<div class="flex space-x-3">
	<span class="grow">
		{@render children()}
	</span>
	<div>
		<button {disabled} onclick={removeSelf} type="button" class="btn-error btn-icon mt-6">
			<X />
		</button>
	</div>
</div>
