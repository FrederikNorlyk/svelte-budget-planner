<script lang="ts">
	import SelectField from '$lib/components/SelectField.svelte';
	import type { SelectOption } from '$lib/components/types/SelectOption';
	import IconXMark from '$lib/icons/IconXMark.svelte';

	export let dayOfMonth: number;
	export let month: number | undefined = undefined;
	export let canDelete: boolean

	const daysOfMonth: SelectOption<Number>[] = [];
	for (let i = 1; i <= 31; i++) {
		daysOfMonth.push({
			value: i,
			text: i.toString()
		});
	}

	const months: SelectOption<Number>[] = [
		{
			value: 1,
			text: 'January'
		},
		{
			value: 2,
			text: 'February'
		},
		{
			value: 3,
			text: 'March'
		},
		{
			value: 4,
			text: 'April'
		},
		{
			value: 5,
			text: 'May'
		},
		{
			value: 6,
			text: 'June'
		},
		{
			value: 7,
			text: 'July'
		},
		{
			value: 8,
			text: 'August'
		},
		{
			value: 9,
			text: 'September'
		},
		{
			value: 10,
			text: 'October'
		},
		{
			value: 11,
			text: 'November'
		},
		{
			value: 12,
			text: 'December'
		}
	];
</script>

<div class="flex space-x-3">
	<span class="grow">
		<SelectField
			value={dayOfMonth}
			name="dayOfMonth"
			label="Day"
			required={true}
			options={daysOfMonth}
		/>
	</span>
	<span class="grow">
		<SelectField value={month} name="month" label="Month" required={true} options={months} />
	</span>
	{#if canDelete}
		<div>
			<button type="button" class="btn-icon variant-filled mt-6 bg-error-600">
				<IconXMark cssClass="w-8 h-8" />
			</button>
		</div>
	{/if}
</div>
