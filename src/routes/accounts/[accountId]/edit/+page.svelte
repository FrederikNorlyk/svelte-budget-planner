<script lang="ts">
	import { _ } from 'svelte-i18n';
	import DeleteDialog from '$lib/components/DeleteDialog.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import { enhance } from '$app/forms';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import { toaster } from '$lib/util/toaster';

	const { data, form } = $props();

	const account = data.account;
	let isSaving = $state(false);
	let isShowingDeleteDialog = $state(false);

	$effect(() => {
		if (form?.error) {
			isShowingDeleteDialog = false;
			toaster.error({
				title: $_(form.error)
			});
		}
	});
</script>

<form
	class="space-y-4"
	method="post"
	action="?/save"
	use:enhance={() => {
		isSaving = true;

		return async ({ update }) => {
			await update();
			isSaving = false;
		};
	}}
>
	<div class="card bg-surface-100-900 space-y-4 p-4">
		<TextField
			name="name"
			label={$_('account.name')}
			autofocus={account == null}
			required={true}
			value={account?.name}
			disabled={isSaving}
		/>

		<Checkbox
			name="shared"
			label={$_('account.shared')}
			value={account?.isShared ?? false}
			disabled={isSaving}
		/>
	</div>

	<div class="flex space-x-2">
		<button disabled={isSaving} class="btn-primary basis-1/4">{$_('button.save')}</button>

		{#if account != null}
			<DeleteDialog
				open={isShowingDeleteDialog}
				title={$_('deleteAccount.title')}
				body={$_('deleteAccount.body')}
			></DeleteDialog>
		{/if}
	</div>
</form>
