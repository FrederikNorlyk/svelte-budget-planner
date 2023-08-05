<script lang="ts">
	import SelectField from '$lib/components/SelectField.svelte';
	import type { SelectOption } from '$lib/components/types/SelectOption';
	import IconXMark from '$lib/icons/IconXMark.svelte';
	import { i18n } from '$lib/localization/i18n';
	import type { PaymentDate } from '$lib/models/PaymentDate';
	import { DateUtil } from '$lib/util/DateUtil';

	export let paymentDate: PaymentDate
	export let onInputRemoved: (paymentDate: PaymentDate) => void
	let self: HTMLDivElement

	const daysOfMonth: SelectOption<Number>[] = []
	for (let i = 1; i <= 31; i++) {
		daysOfMonth.push({
			value: i,
			text: i.toString()
		});
	}

	const months: SelectOption<Number>[] = []
	for (let i = 0; i < 12; i++) {
		months.push({
			value: i,
			text: DateUtil.getMonthName(i)
		})
	}

	function removeSelf() {
		self.parentNode?.removeChild(self)
		onInputRemoved(paymentDate)
	}
</script>

<div bind:this={self} class="flex space-x-3">
	<span class="grow">
		<SelectField
			value={paymentDate.getDayOfMonth()}
			name="dayOfMonth"
			label={$i18n('calendarDatePicker.day')}
			required={true}
			options={daysOfMonth}
		/>
	</span>
	<span class="grow">
		<SelectField
			value={paymentDate.getMonth()}
			name="month"
			label={$i18n('calendarDatePicker.month')}
			required={true}
			options={months}
		/>
	</span>
	<div>
		<button on:click={removeSelf} type="button" class="btn-icon variant-filled mt-6 bg-error-600">
			<IconXMark cssClass="w-8 h-8" />
		</button>
	</div>
</div>
