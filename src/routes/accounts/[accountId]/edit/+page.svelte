<script lang="ts">
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
			title: 'Delete account',
			body: `You are about to delete an account.`,
			buttonTextSubmit: 'Delete account'
		};
		modalStore.trigger(modal);
	}
</script>

<form class="card space-y-2 bg-white p-4" method="post" action="?/save">
	<TextField name="name" label="Name" required={true} value={account?.getName()} />

	<div class="flex space-x-2">
		<button class="btn variant-filled basis-1/4 bg-primary-500">Save</button>

		{#if account != null}
			<button
				formnovalidate={true}
				class="btn variant-filled basis-1/4"
				on:click|preventDefault={showDeleteModal}>Delete</button
			>
		{/if}
	</div>
</form>
