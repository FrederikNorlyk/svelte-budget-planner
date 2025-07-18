<script lang="ts">
	import TextField from '$lib/components/TextField.svelte';
	import { Combobox } from '@skeletonlabs/skeleton-svelte';
	import PaymentDatePicker from '$lib/components/PaymentDatePicker.svelte';
	import { _ } from 'svelte-i18n';
	import NumberField from '$lib/components/NumberField.svelte';
	import { enhance } from '$app/forms';
	import SelectField from '$lib/components/SelectField.svelte';
	import type { SelectOption } from '$lib/components/types/SelectOption.js';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import { toaster } from '$lib/util/toaster';

	const { form, data } = $props();
	const expense = data.expense;
	const paymentDates = data.paymentDates;

	let isSaving = $state(false);
	const isShowingDeleteModal = $state(false);

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
	<div class="card bg-surface-100-900 space-y-2 p-4">
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
			value={expense?.tag ? [expense.tag] : undefined}
			defaultInputValue={expense?.tag ?? undefined}
			data={tagOptions}
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

	<div class="card bg-surface-100-900 space-y-2 p-4">
		<PaymentDatePicker {paymentDates} disabled={isSaving} />
	</div>

	<div class="flex space-x-2 p-4">
		<button disabled={isSaving} class="btn-primary basis-1/4">{$_('button.save')}</button>

		{#if expense != null}
			<DeleteModal
				open={isShowingDeleteModal}
				title={$_('deleteExpense.title')}
				body={$_('deleteExpense.body')}
			/>
		{/if}
	</div>
</form>
