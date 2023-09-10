<script lang="ts">
	import { page, updated } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';
	import { i18n, locale, locales } from '$lib/localization/i18n';
	import SelectField from '$lib/components/SelectField.svelte';
	import type { SelectOption } from '$lib/components/types/SelectOption';
	import { LightSwitch, toastStore } from '@skeletonlabs/skeleton';
	import NumberField from '$lib/components/NumberField.svelte';
	import { Settings } from '$lib/models/Settings.js';
	import { enhance } from '$app/forms';
	
	const user = $page.data.session?.user
	export let data;
	export let form;

	if (form?.error) {
		toastStore.trigger({
			message: form.error,
			background: 'variant-filled-error'
		});
	}

	let isSaving = false
	const settings = Settings.parse(data.settings)

	const localeOptions: SelectOption<String>[] = []
	locales.forEach((locale) => {
		var text

		switch (locale) {
			case 'en':
				text = 'English'
				break
			case 'da':
				text = 'Dansk'
				break
			default:
				text = 'Unknown'
				break
		}

		localeOptions.push({
			value: locale,
			text: text
		});
	})

	function getProfilePicture() {
		return user?.image ?? `https://avatars.dicebear.com/api/identicon/${user.id}.svg`;
	}
</script>

<h1 class="text-3xl">{$i18n('settings.title')}</h1>
<p>{$i18n('settings.details')}</p>

<div class="mt-5 card bg-white p-10 space-y-3">
	<div class="flex">
		<img src={getProfilePicture()} class="rounded-full w-12 h-12 object-cover" alt="The current user" />
		
		<span class="grow"/>
		
		<div class="text-end flex space-x-1">
			<h2 class="text-lg">{user?.name}</h2>
			<small class="text-slate-400">#{user?.id}</small>
		</div>
	</div>

	<hr>

	<form class="sm:w-64 pt-4">
		<SelectField
			name="locale"
			label={$i18n('user.locale')}
			options={localeOptions}
			bind:value={$locale}
			disabled={isSaving}
		/>
	</form>

	<div>
		<label class="label" for="light-switch">Dark mode</label>
		<LightSwitch disabled={isSaving} class="mt-1" id="light-switch" />
	</div>

	<form 
		class="space-y-2"
		method="post" 
		action="?/save"
		use:enhance={() => {
			isSaving = true

			return async ({ update }) => {
				await update()
				isSaving = false
			}
		}}
	>
		<NumberField name="income" label={$i18n('user.income')} required={true} disabled={isSaving} value={settings.getIncome()}/>
		<button disabled={isSaving} class="btn variant-filled basis-1/4 bg-primary-500">{$i18n('button.save')}</button>
	</form>

	<div class="h-4"></div>

	<div class="flex">
		<span class="grow"></span>
		<button on:click={() => signOut()} class="btn variant-ghost w-full sm:w-auto"
			>{$i18n('signOut')}</button
		>
	</div>
</div>
