<script lang="ts">
	import TextField from '$lib/components/TextField.svelte';
	import { _ } from 'svelte-i18n';
	import { Combobox } from '@skeletonlabs/skeleton-svelte';
	import NumberField from '$lib/components/NumberField.svelte';
	import SelectField from '$lib/components/SelectField.svelte';
	import type { SelectOption } from '$lib/components/types/SelectOption.js';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import { toaster } from '$lib/util/toaster';
	import { deleteExpense, upsertExpense } from './expense.remote';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { monthOptions, shareOptions } from './options';
	import MonthPicker from '$lib/components/MonthPicker.svelte';
	import PaymentDatePicker from '$lib/components/PaymentDatePicker.svelte';
	import ButtonGroup from '$lib/components/ButtonGroup.svelte';

	const { data } = $props();
	const expense = data.expense;

	const isShowingDeleteModal = $state(false);

	const tagOptions: SelectOption<string>[] = [];
	data.tags.forEach((tag) => {
		tagOptions.push({ label: tag, value: tag });
	});

	if (expense) {
		upsertExpense.fields.set({
			name: expense.name,
			amount: expense.amount,
			isEnabled: expense.isEnabled,
			isShared: String(expense.isShared),
			months: expense.paymentDates.map((paymentDate) => String(paymentDate.month)),
			tag: expense.tag ?? ''
		});
	}

	let paymentDates = $state(expense?.paymentDates ?? []);
</script>

<form class="space-y-4" {...upsertExpense.enhance(({ submit }) => submit())}>
	{#if upsertExpense.fields.allIssues()}
		{#each upsertExpense.fields.allIssues() ?? [] as issue, index (index)}
			<p>{issue.message}</p>
		{/each}
	{/if}

	<div class="card bg-surface-100-900 space-y-2 p-4">
		<TextField
			{...upsertExpense.fields.name.as('text')}
			value={expense?.name ?? ''}
			label={$_('expense.name')}
			autofocus={expense == null}
			required={true}
			disabled={!!upsertExpense.pending}
		/>

		<div class="flex space-x-2">
			<span class="grow">
				<NumberField
					{...upsertExpense.fields.amount.as('number')}
					value={expense?.amount ?? ''}
					label={$_('expense.amount')}
					required={true}
					disabled={!!upsertExpense.pending}
				/>
			</span>

			<SelectField
				{...upsertExpense.fields.isShared.as('select')}
				value={expense?.isShared ?? 'false'}
				label={$_('expense.shared.label')}
				options={shareOptions}
				disabled={!!upsertExpense.pending}
			/>
		</div>

		<Combobox
			name="tag"
			label={$_('expense.group')}
			value={expense?.tag ? [expense.tag] : undefined}
			defaultInputValue={expense?.tag ?? undefined}
			data={tagOptions}
			disabled={!!upsertExpense.pending}
			allowCustomValue={true}
		/>

		<!-- Spacing -->
		<div></div>

		<Checkbox
			{...upsertExpense.fields.isEnabled.as('checkbox')}
			disabled={!!upsertExpense.pending}
			label={$_('expense.isEnabled')}
		/>
	</div>

	<div class="card-primary space-y-2 p-4">
		<PaymentDatePicker bind:paymentDates disabled={!!upsertExpense.pending}>
			{#each paymentDates as paymentDate, index (paymentDate.id)}
				<MonthPicker bind:paymentDates {paymentDate} disabled={!!upsertExpense.pending}>
					<SelectField
						{...upsertExpense.fields.months[index].as('select')}
						label={$_('calendarDatePicker.month')}
						required={true}
						options={monthOptions}
						disabled={!!upsertExpense.pending}
					/>
				</MonthPicker>
			{/each}
		</PaymentDatePicker>
	</div>

	<ButtonGroup>
		<button disabled={!!upsertExpense.pending} class="btn-primary basis-1/4"
			>{$_('button.save')}</button
		>

		{#if expense != null}
			<DeleteModal
				open={isShowingDeleteModal}
				title={$_('deleteExpense.title')}
				body={$_('deleteExpense.body')}
				onSubmit={() => {
					deleteExpense(expense.id).then((result) => {
						if (result.error) {
							toaster.error({ title: $_(result.error) });
							return;
						}

						goto(resolve('/accounts/[accountId]', { accountId: String(expense.accountId) }));
					});
				}}
			/>
		{/if}
	</ButtonGroup>
</form>
