<script lang="ts">
	import TextField from '$lib/components/TextField.svelte';
	import { _ } from 'svelte-i18n';
	import NumberField from '$lib/components/NumberField.svelte';
	import SelectField from '$lib/components/SelectField.svelte';
	import type { SelectOption } from '$lib/components/types/SelectOption.js';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import { toaster } from '$lib/util/toaster';
	import { deleteExpense, getExpense, upsertExpense } from './expense.remote';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { monthOptions, shareOptions } from './options';
	import MonthPicker from '$lib/components/MonthPicker.svelte';
	import PaymentDatePicker from '$lib/components/PaymentDatePicker.svelte';
	import ButtonGroup from '$lib/components/ButtonGroup.svelte';
	import Combobox from '$lib/components/Combobox.svelte';
	import DeleteDialog from '$lib/components/DeleteDialog.svelte';
	import FormIssues from '$lib/components/FormIssues.svelte';

	const { data, params } = $props();
	const expense = $derived(await getExpense(Number(params.expenseId)));

	const tagOptions: SelectOption<string>[] = [];
	data.tags.forEach((tag) => {
		tagOptions.push({ label: tag, value: tag });
	});

	const expenseForm = upsertExpense.for(expense?.id ?? 0);

	if (expense) {
		expenseForm.fields.set({
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

<form
	class="space-y-4"
	{...expenseForm.enhance(async ({ submit }) => {
		try {
			submit();
			if (!expenseForm.fields.allIssues()) {
				toaster.success({ title: 'Saved!' });
			}
		} catch (e) {
			toaster.error({ title: e });
		}
	})}
>
	<FormIssues issues={expenseForm.fields.allIssues()} />

	<div class="card-primary space-y-2 p-4">
		<TextField
			{...expenseForm.fields.name.as('text')}
			value={expense?.name ?? ''}
			label={$_('expense.name')}
			autofocus={expense == null}
			required={true}
			disabled={!!expenseForm.pending}
		/>

		<div class="flex space-x-2">
			<span class="grow">
				<NumberField
					{...expenseForm.fields.amount.as('number')}
					value={expense?.amount ?? ''}
					label={$_('expense.amount')}
					required={true}
					disabled={!!expenseForm.pending}
				/>
			</span>

			<SelectField
				{...expenseForm.fields.isShared.as('select')}
				value={expense?.isShared ? 'true' : 'false'}
				label={$_('expense.shared.label')}
				options={shareOptions}
				disabled={!!expenseForm.pending}
			/>
		</div>

		<Combobox
			{...expenseForm.fields.tag.as('text')}
			label={$_('expense.group')}
			value={expense?.tag ?? undefined}
			options={tagOptions}
			disabled={!!expenseForm.pending}
			allowCustomValue={true}
		/>

		<!-- Spacing -->
		<div></div>

		<Checkbox
			{...expenseForm.fields.isEnabled.as('checkbox')}
			disabled={!!expenseForm.pending}
			label={$_('expense.isEnabled')}
		/>
	</div>

	<div class="card-primary space-y-2 p-4">
		<PaymentDatePicker bind:paymentDates disabled={!!expenseForm.pending}>
			{#each paymentDates as paymentDate, index (paymentDate.id)}
				<MonthPicker bind:paymentDates {paymentDate} disabled={!!expenseForm.pending}>
					<SelectField
						{...expenseForm.fields.months[index].as('select')}
						label={$_('calendarDatePicker.month')}
						required={true}
						options={monthOptions}
						disabled={!!expenseForm.pending}
					/>
				</MonthPicker>
			{/each}
		</PaymentDatePicker>
	</div>

	<ButtonGroup>
		<button disabled={!!expenseForm.pending} class="btn-primary basis-1/4"
			>{$_('button.save')}</button
		>

		{#if expense != null}
			<DeleteDialog
				title={$_('deleteExpense.title')}
				body={$_('deleteExpense.body')}
				onSubmit={async () => {
					const result = await deleteExpense(expense.id);

					if (result.error) {
						toaster.error({ title: $_(result.error) });
						return;
					}

					await goto(resolve('/accounts/[accountId]', { accountId: String(expense.accountId) }));
				}}
			/>
		{/if}
	</ButtonGroup>
</form>
