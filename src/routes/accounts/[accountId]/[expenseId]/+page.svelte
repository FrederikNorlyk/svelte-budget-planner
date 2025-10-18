<script lang="ts">
	import TextField from '$lib/components/TextField.svelte';
	import PaymentDatePicker from '$lib/components/PaymentDatePicker.svelte';
	import { _ } from 'svelte-i18n';
	import NumberField from '$lib/components/NumberField.svelte';
	import { enhance } from '$app/forms';
	import SelectField from '$lib/components/SelectField.svelte';
	import type { SelectOption } from '$lib/components/types/SelectOption.js';
	import DeleteDialog from '$lib/components/DeleteDialog.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import { toaster } from '$lib/util/toaster';
	import Combobox from '$lib/components/Combobox.svelte';
	import ButtonGroup from '$lib/components/ButtonGroup.svelte';

	const { form, data } = $props();
	const expense = data.expense;

	let isSaving = $state(false);
	const isShowingDeleteDialog = $state(false);

	const tagOptions: SelectOption<string>[] = [];
	data.tags.forEach((tag) => {
		tagOptions.push({ label: tag, value: tag });
	});

	$effect(() => {
		if (form?.error) {
			toaster.error({
				title: $_(form.error)
			});
		}
	});

	const shareOptions: SelectOption<boolean>[] = [
		{
			value: false,
			label: $_('expense.notShared')
		},
		{
			value: true,
			label: $_('expense.isShared')
		}
	];
</script>

<form
	class="space-y-4"
	method="POST"
	action="?/save"
	use:enhance={() => {
		isSaving = true;

		return async ({ update }) => {
			await update();
			isSaving = false;
		};
	}}
>
	<div class="card-primary space-y-2 p-5">
		<TextField
			name="name"
			label={$_('expense.name')}
			autofocus={expense == null}
			required={true}
			value={expense?.name}
			disabled={isSaving}
		/>

		<div class="flex space-x-2">
			<span class="grow">
				<NumberField
					name="amount"
					label={$_('expense.amount')}
					required={true}
					value={expense?.amount}
					disabled={isSaving}
				/>
			</span>

			<SelectField
				name="isShared"
				label={$_('expense.shared.label')}
				options={shareOptions}
				value={expense?.isShared ?? false}
				disabled={isSaving}
			/>
		</div>

		<Combobox
			name="tag"
			label={$_('expense.group')}
			value={expense?.tag ?? undefined}
			options={tagOptions}
			disabled={isSaving}
			allowCustomValue={true}
		/>

		<!-- Spacing -->
		<div></div>

		<Checkbox
			disabled={isSaving}
			name="isEnabled"
			label={$_('expense.isEnabled')}
			value={expense?.isEnabled ?? true}
		/>
	</div>

	<div class="card-primary space-y-2 p-5">
		<PaymentDatePicker paymentDates={expense?.paymentDates ?? []} disabled={isSaving} />
	</div>

	<ButtonGroup>
		<button disabled={isSaving} class="btn-primary basis-1/4">{$_('button.save')}</button>

		{#if expense != null}
			<DeleteDialog
				open={isShowingDeleteDialog}
				title={$_('deleteExpense.title')}
				body={$_('deleteExpense.body')}
			/>
		{/if}
	</ButtonGroup>
</form>
