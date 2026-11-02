<script lang="ts">
	import NumberField from '$lib/components/NumberField.svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { _ } from 'svelte-i18n';
	import { toaster } from '$lib/util/toaster';

	const { data } = $props();
	let isSaving = $state(false);
	const settings = $derived(data.settings);

	async function signOutButtonPressed() {
		const response = await fetch('/auth/signout', { method: 'POST' });

		if (!response.ok) {
			toaster.error({ title: 'Unable to sign out.' });
			return;
		}

		await goto(resolve('/auth/signin'));
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

		<div class="space-y-12">
			<button disabled={isSaving} class="btn-primary w-full sm:block sm:w-auto"
				>{$_('button.save')}</button
			>

			<hr />

			<button
				type="button"
				onclick={signOutButtonPressed}
				disabled={isSaving}
				class="btn-tertiary w-full sm:block sm:w-auto"
			>
				{$_('signOut')}
			</button>
		</div>
	</form>
</div>
