<script lang="ts">
	import { i18n } from '$lib/localization/i18n';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import { Account } from '$lib/models/Account';
	import { type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { enhance } from '$app/forms';
	import Checkbox from '$lib/components/Checkbox.svelte';

	import { getModalStore } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	export let data;
	export let form;

	let account = data.account != null ? Account.parse(data.account) : null;
	let isSaving = false;

	if (form?.error) {
		toastStore.trigger({
			message: $i18n(form.error),
			background: 'variant-filled-error'
		});
	}

	function showDeleteModal(): void {
		const component: ModalComponent = { ref: DeleteModal };
		const modal: ModalSettings = {
			type: 'component',
			component: component,
			title: $i18n('deleteAccount.title'),
			body: $i18n('deleteAccount.body'),
			buttonTextSubmit: $i18n('button.delete'),
			buttonTextCancel: $i18n('button.cancel')
		};
		modalStore.trigger(modal);
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
			label={$i18n('account.name')}
			autofocus={account == null}
			required={true}
			value={account?.name}
			disabled={isSaving}
		/>

		<Checkbox
			name="shared"
			label={$i18n('account.shared')}
			value={(account?.userIds.length ?? 0) > 1}
			disabled={isSaving}
		/>
	</div>

	<div class="flex space-x-2">
		<button disabled={isSaving} class="variant-filled btn basis-1/4 bg-primary-500"
			>{$i18n('button.save')}</button
		>

		{#if account != null}
			<button
				formnovalidate={true}
				disabled={isSaving}
				class="variant-filled btn basis-1/4"
				on:click|preventDefault={showDeleteModal}>{$i18n('button.delete')}</button
			>
		{/if}
	</div>
</form>
