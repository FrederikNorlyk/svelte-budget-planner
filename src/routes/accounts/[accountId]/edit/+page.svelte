<script lang="ts">
	import { i18n } from "$lib/localization/i18n";
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import { Account } from '$lib/models/Account';
	import {
		modalStore,
		toastStore,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';

	export let data;
	export let form;

	let account = data.account != null ? Account.parse(data.account) : null;

	if (form?.error) {
		toastStore.trigger({
			message: form.error,
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

<form class="card space-y-2 bg-white p-4" method="post" action="?/save">
	<TextField name="name" label={$i18n('account.name')} autofocus={account == null} required={true} value={account?.getName()} />

	<div class="flex space-x-2">
		<button class="btn variant-filled basis-1/4 bg-primary-500">{$i18n('button.save')}</button>

		{#if account != null}
			<button
				formnovalidate={true}
				class="btn variant-filled basis-1/4"
				on:click|preventDefault={showDeleteModal}>{$i18n('button.delete')}</button
			>
		{/if}
	</div>
</form>
