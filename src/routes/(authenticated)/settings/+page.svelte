<script lang="ts">
	import NumberField from '#lib/components/NumberField.svelte';
	import { enhance } from '$app/forms';
	import { _ } from 'svelte-i18n';
	import { toaster } from '#lib/util/toaster.ts';

	const { data } = $props();
	let isSaving = $state(false);
	const settings = $derived(data.settings);
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

		<button disabled={isSaving} class="btn-primary w-full sm:block sm:w-auto"
			>{$_('button.save')}</button
		>
	</form>

	<hr class="my-12" />

	<form method="POST" action="/auth/signout">
		<button disabled={isSaving} class="btn-tertiary w-full sm:block sm:w-auto">
			{$_('signOut')}
		</button>
	</form>
</div>
