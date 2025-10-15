<script lang="ts">
	import { _ } from 'svelte-i18n';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { deleteAccount, upsertAccount } from './account.remote';
	import { toaster } from '$lib/util/toaster';

	const { data } = $props();

	const account = data.account;
	if (account) {
		upsertAccount.fields.set({
			name: account.name,
			isShared: account.isShared
		});
	}
</script>

<form class="space-y-4" {...upsertAccount.enhance(({ submit }) => submit())}>
	<div class="card bg-surface-100-900 space-y-4 p-4">
		{#if upsertAccount.fields.allIssues()}
			{#each upsertAccount.fields.allIssues() ?? [] as issue, index (index)}
				<p>{issue.message}</p>
			{/each}
		{/if}

		<TextField
			{...upsertAccount.fields.name.as('text')}
			value={account?.name ?? ''}
			label={$_('account.name')}
			autofocus={account == null}
			required={true}
			disabled={!!upsertAccount.pending}
		/>

		<Checkbox
			{...upsertAccount.fields.isShared.as('checkbox')}
			checked={account?.isShared ?? false}
			label={$_('account.shared')}
			disabled={!!upsertAccount.pending}
		/>
	</div>

	<div class="flex space-x-2">
		<button disabled={!!upsertAccount.pending} class="btn-primary basis-1/4"
			>{$_('button.save')}</button
		>

		{#if account != null}
			<DeleteModal
				title={$_('deleteAccount.title')}
				body={$_('deleteAccount.body')}
				onSubmit={() => {
					deleteAccount(account.id).then((result) => {
						if (result.error) {
							toaster.error({ title: $_(result.error) });
							return;
						}

						goto(resolve('/accounts'));
					});
				}}
			></DeleteModal>
		{/if}
	</div>
</form>
