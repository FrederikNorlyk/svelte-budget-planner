<script lang="ts">
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';
	import { i18n, locales } from '$lib/localization/i18n';
	import SelectField from '$lib/components/SelectField.svelte';
	import type { SelectOption } from '$lib/components/types/SelectOption';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import NumberField from '$lib/components/NumberField.svelte';
	import { Settings } from '$lib/models/Settings.js';
	import { enhance } from '$app/forms';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	const user = $page.data.session!.user;
	export let data;
	export let form;

	if (form?.error) {
		toastStore.trigger({
			message: form.error,
			background: 'variant-filled-error'
		});
	}

	let isSaving = false;
	const settings = Settings.parse(data.settings);

	const localeOptions: SelectOption<string>[] = [];
	locales.forEach((locale) => {
		var text;

		switch (locale) {
			case 'en':
				text = 'English';
				break;
			case 'da':
				text = 'Dansk';
				break;
			default:
				text = 'Unknown';
				break;
		}

		localeOptions.push({
			value: locale,
			text: text
		});
	});

	function getProfilePicture() {
		return user.image ?? `https://avatars.dicebear.com/api/identicon/${user.id ?? 'unknown'}.svg`;
	}
</script>

<div class="card mt-5 space-y-3 bg-white p-10">
	<div class="flex">
		<img
			src={getProfilePicture()}
			class="h-12 w-12 rounded-full object-cover"
			alt="The current user"
		/>

		<span class="grow" />

		<div class="flex space-x-1 text-end">
			<h2 class="text-lg">{user.name}</h2>
			<small class="text-slate-400">#{user.id}</small>
		</div>
	</div>

	<hr />

	<div>
		<label class="label" for="light-switch">Dark mode</label>
		<LightSwitch disabled={isSaving} class="mt-1" id="light-switch" />
	</div>

	<form
		class="space-y-2"
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
		<SelectField
			name="locale"
			label={$i18n('user.locale')}
			options={localeOptions}
			value={settings.locale}
			disabled={isSaving}
		/>

		<NumberField
			name="income"
			label={$i18n('user.income')}
			required={true}
			disabled={isSaving}
			value={settings.income}
		/>

		<button disabled={isSaving} class="variant-filled btn basis-1/4 bg-primary-500"
			>{$i18n('button.save')}</button
		>
	</form>

	<div class="h-4"></div>

	<div class="flex">
		<span class="grow"></span>
		<button on:click={() => signOut()} class="variant-ghost btn w-full sm:w-auto"
			>{$i18n('signOut')}</button
		>
	</div>
</div>
