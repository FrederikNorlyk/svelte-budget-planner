<script lang="ts">
	import { _ } from 'svelte-i18n';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import { Account } from '$lib/models/Account';
	import { enhance } from '$app/forms';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import { toaster } from '$lib/util/toaster';

	let { data, form } = $props();

	let account = data.account != null ? Account.parse(data.account) : null;
	let isSaving = $state(false);
	let isShowingDeleteModal = $state(false);

	if (form?.error) {
		toaster.error({
			title: $_(form.error)
		});
	}
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
	<div class="card space-y-4 bg-white p-4">
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
			value={(account?.userIds.length ?? 0) > 1}
			disabled={isSaving}
		/>
	</div>

	<div class="flex space-x-2">
		<button disabled={isSaving} class="preset-filled btn bg-primary-500 basis-1/4"
			>{$_('button.save')}</button
		>

		{#if account != null}
			<DeleteModal
				open={isShowingDeleteModal}
				title={$_('deleteAccount.title')}
				body={$_('deleteAccount.body')}
			></DeleteModal>
		{/if}
	</div>
</form>
