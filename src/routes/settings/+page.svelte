<script lang="ts">
	import NumberField from '$lib/components/NumberField.svelte';
	import { Settings } from '$lib/models/Settings.js';
	import { enhance } from '$app/forms';
	import { _ } from 'svelte-i18n';
	import { type ToastContext } from '@skeletonlabs/skeleton-svelte';
	import { getContext } from 'svelte';
	import { signOut } from '@auth/sveltekit/client';

	export const toast: ToastContext = getContext('toast');

	let { data } = $props();
	let isSaving = $state(false);
	const settings = $derived(Settings.parse(data.settings));
</script>

<div class="card mt-5 space-y-3 bg-white p-10">
	<form
		class="space-y-8"
		method="post"
		action="?/save"
		use:enhance={() => {
			isSaving = true;

			return async ({ update }) => {
				await update();
				isSaving = false;

				toast.create({
					description: $_('settings.saved'),
					type: 'success'
				});
			};
		}}
	>
		<NumberField
			name="income"
			label={$_('user.income')}
			required={true}
			disabled={isSaving}
			value={settings.income}
		/>

		<button disabled={isSaving} class="preset-filled btn bg-success-500 w-full basis-1/4 sm:w-auto"
			>{$_('button.save')}</button
		>
	</form>

	<button
		onclick={() => signOut()}
		disabled={isSaving}
		class="preset-filled btn w-full basis-1/4 bg-neutral-500 sm:w-auto"
	>
		{$_('signOut')}
	</button>
</div>
