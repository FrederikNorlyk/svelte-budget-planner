<script lang="ts">
	import TextField from '$lib/components/TextField.svelte';
	import { Expense } from '$lib/models/Expense.js';
	import {
		type AutocompleteOption,
		type ModalComponent,
		type ModalSettings,
		Switch
	} from '@skeletonlabs/skeleton-svelte';
	import { Combobox } from '@skeletonlabs/skeleton-svelte';
	import PaymentDatePicker from '$lib/components/PaymentDatePicker.svelte';
	import { PaymentDate } from '$lib/models/PaymentDate.js';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import { _ } from 'svelte-i18n';
	import NumberField from '$lib/components/NumberField.svelte';
	import { enhance } from '$app/forms';
	import SelectField from '$lib/components/SelectField.svelte';
	import type { SelectOption } from '$lib/components/types/SelectOption.js';
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	let { form, data } = $props();
	const expense = data.expense != null ? Expense.parse(data.expense) : null;
	const paymentDates = data.paymentDates.map((d) => PaymentDate.parse(d));

	let isSaving = $state(false);

	let tagOptions: SelectOption<string>[] = [];
	data.tags.forEach((tag) => {
		tagOptions.push({ label: tag, value: tag });
	});

	$effect(() => {
		if (form?.error) {
			toastStore.trigger({
				message: $_(form.error),
				background: 'preset-filled-error-500'
			});
		}
	});

	let shareOptions: SelectOption<boolean>[] = [
		{
			value: false,
			label: $_('expense.notShared')
		},
		{
			value: true,
			label: $_('expense.isShared')
		}
	];

	function showDeleteModal(event: MouseEvent): void {
		event.preventDefault();

		const component: ModalComponent = { ref: DeleteModal };

		const modal: ModalSettings = {
			type: 'component',
			component: component,
			title: $_('deleteExpense.title'),
			body: $_('deleteExpense.body'),
			buttonTextSubmit: $_('button.delete'),
			buttonTextCancel: $_('button.cancel')
		};

		modalStore.trigger(modal);
	}
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
	<div class="card space-y-2 bg-white p-4">
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
			data={tagOptions}
			disabled={isSaving}
		/>

		<Switch
			disabled={isSaving}
			name="isEnabled"
			active="bg-primary-500"
			checked={expense?.isEnabled ?? true}>{$_('expense.isEnabled')}</Switch
		>
	</div>

	<div class="card space-y-2 bg-white p-4">
		<PaymentDatePicker {paymentDates} disabled={isSaving} />
	</div>

	<div class="flex space-x-2 p-4">
		<button disabled={isSaving} class="preset-filled btn bg-primary-500 basis-1/4"
			>{$_('button.save')}</button
		>

		{#if expense != null}
			<button
				formnovalidate={true}
				disabled={isSaving}
				class="preset-filled btn basis-1/4"
				onclick={showDeleteModal}>{$_('button.delete')}</button
			>
		{/if}
	</div>
</form>
