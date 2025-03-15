<script lang="ts">
	import SelectField from '$lib/components/SelectField.svelte';
	import type { SelectOption } from '$lib/components/types/SelectOption';
	import X from 'lucide-svelte/icons/x';
	import { _ } from 'svelte-i18n';
	import type { PaymentDate } from '$lib/models/PaymentDate';
	import { DateUtil } from '$lib/util/DateUtil';

	interface Props {
		paymentDate: PaymentDate;
		disabled?: boolean;
		onInputRemoved: (paymentDate: PaymentDate) => void;
	}

	let { paymentDate, disabled = false, onInputRemoved }: Props = $props();
	let self: HTMLDivElement | undefined = $state();

	const months: SelectOption<number>[] = [];
	for (let i = 0; i < 12; i++) {
		months.push({
			value: i,
			label: DateUtil.getMonthName(i)
		});
	}

	function removeSelf() {
		if (!self) {
			return;
		}
		self.parentNode?.removeChild(self);
		onInputRemoved(paymentDate);
	}
</script>

<div bind:this={self} class="flex space-x-3">
	<span class="grow">
		<SelectField
			value={paymentDate.month}
			name="month"
			label={$_('calendarDatePicker.month')}
			required={true}
			{disabled}
			options={months}
		/>
	</span>
	<div>
		<button
			{disabled}
			onclick={removeSelf}
			type="button"
			class="preset-filled btn-icon bg-error-600 mt-6"
		>
			<X />
		</button>
	</div>
</div>
