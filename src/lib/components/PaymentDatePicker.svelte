<script lang="ts">
	import IconPlusCircle from "$lib/icons/IconPlusCircle.svelte";
	import SelectField from "./SelectField.svelte";
	import type { SelectOption } from "./types/SelectOption";

    export let dayOfMonth: number | undefined = undefined
    export let month: number | undefined = undefined

    const daysOfMonth: SelectOption<Number>[] = [];
	for (let i = 1; i <= 31; i++) {
		daysOfMonth.push({
			value: i,
			text: i.toString()
		})
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
	]
</script>

<div class="flex space-x-3">
    <span class="grow">
        <SelectField value={dayOfMonth} name="dayOfMonth[]" label="Day" required={true} options={daysOfMonth} />
    </span>
    <span class="grow">
        <SelectField value={month} name="month[]" label="Month" required={true} options={months} />
    </span>
    <div>
        <button type="button" class="btn-icon bg-primary-500 variant-filled mt-6">
            <IconPlusCircle cssClass="h-8 w-8" />
        </button>
    </div>
</div>