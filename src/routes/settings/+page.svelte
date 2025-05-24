<script lang="ts">
	import NumberField from '$lib/components/NumberField.svelte';
	import { enhance } from '$app/forms';
	import { _ } from 'svelte-i18n';
	import { signOut } from '@auth/sveltekit/client';
	import { toaster } from '$lib/util/toaster';

	const { data } = $props();
	let isSaving = $state(false);
	const settings = $derived(data.settings);

	function signOutButtonPressed(event: MouseEvent) {
		event.preventDefault();
		signOut();
	}
</script>

<div class="card-primary p-10">
	<form
		class="space-y-5"
		method="post"
		action="?/save"
		use:enhance={() => {
			isSaving = true;

			return async ({ update }) => {
				await update();
				isSaving = false;

				toaster.success({
					title: $_('settings.saved')
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

		<div class="space-y-1">
			<button disabled={isSaving} class="btn-primary w-full sm:block sm:w-auto"
				>{$_('button.save')}</button
			>

			<button
				onclick={signOutButtonPressed}
				disabled={isSaving}
				class="btn-neutral w-full sm:block sm:w-auto"
			>
				{$_('signOut')}
			</button>
		</div>
	</form>
</div>
