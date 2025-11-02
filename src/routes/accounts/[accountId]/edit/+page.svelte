<script lang="ts">
	import { _ } from 'svelte-i18n';
	import TextField from '$lib/components/TextField.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { deleteAccount, upsertAccount } from './account.remote';
	import { toaster } from '$lib/util/toaster';
	import ButtonGroup from '$lib/components/ButtonGroup.svelte';
	import DeleteDialog from '$lib/components/DeleteDialog.svelte';
	import FormIssues from '$lib/components/FormIssues.svelte';

	const { data } = $props();
	const account = data.account;
	const form = upsertAccount.for(account?.id ?? 0);

	if (account) {
		form.fields.set({
			name: account.name,
			isShared: account.isShared
		});
	}
</script>

<form class="space-y-4" {...form.enhance(({ submit }) => submit())}>
	<div class="card-primary space-y-4 p-4">
		<FormIssues issues={form.fields.allIssues()} />

		<TextField
			{...form.fields.name.as('text')}
			value={account?.name ?? ''}
			label={$_('account.name')}
			autofocus={account == null}
			required={true}
			disabled={!!form.pending}
		/>

		<Checkbox
			{...form.fields.isShared.as('checkbox')}
			checked={account?.isShared ?? false}
			label={$_('account.shared')}
			disabled={!!form.pending}
		/>
	</div>

	<ButtonGroup>
		<button disabled={!!form.pending} class="btn-primary basis-1/4">{$_('button.save')}</button>

		{#if account != null}
			<DeleteDialog
				title={$_('deleteAccount.title')}
				body={$_('deleteAccount.body')}
				onSubmit={async () => {
					const result = await deleteAccount(account.id);
					if (result.error) {
						toaster.error({ title: $_(result.error) });
						return;
					}

					await goto(resolve('/accounts'));
				}}
			/>
		{/if}
	</ButtonGroup>
</form>
