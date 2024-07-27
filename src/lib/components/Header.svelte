<script lang="ts">
	import IconArrowLeft from '$lib/icons/IconArrowLeft.svelte';
	import IconBarsThree from '$lib/icons/IconBarsThree.svelte';
	import IconPencilSquare from '$lib/icons/IconPencilSquare.svelte';
	import { i18n, type ReplacementVariables } from '$lib/localization/i18n';
	import {
		Toast,
		Modal,
		type PopupSettings,
		popup,
		initializeStores
	} from '@skeletonlabs/skeleton';

	export let title: string;
	export let titleParams: ReplacementVariables | undefined;
	export let details: string;
	export let backHref: string | undefined = undefined;
	export let editHref: string | undefined = undefined;
	export let userProfilePicture: string;

	const userMenuPopup: PopupSettings = {
		event: 'click',
		target: 'userMenuPopup',
		placement: 'bottom'
	};
</script>

<div class="flex space-x-2">
	<div class="flex flex-grow">
		{#if backHref}
			<a class="mr-1 mt-2" href={backHref}>
				<button type="button" class="variant-filled btn-icon" aria-label="Back button">
					<IconArrowLeft cssClass="h-8 w-8" />
				</button>
			</a>
		{/if}

		<div>
			{#if editHref}
				<a class="flex space-x-1" href={editHref} aria-label="Edit">
					<h1 class="text-3xl">{$i18n(title, titleParams)}</h1>
					<IconPencilSquare cssClass="flex-none h-5 w-5" />
				</a>
				<p>{$i18n(details)}</p>
			{:else}
				<h1 class="text-3xl">{$i18n(title, titleParams)}</h1>
				<p>{$i18n(details)}</p>
			{/if}
		</div>
	</div>

	<a class="variant-ghost-surface btn btn-sm hidden h-8 md:block" href="/accounts" rel="noreferrer"
		>{$i18n('accounts.title')}</a
	>
	<a class="variant-ghost-surface btn btn-sm hidden h-8 md:block" href="/balance" rel="noreferrer"
		>{$i18n('currentAmount.title')}</a
	>

	<a href="/settings" class="hidden md:block">
		<img
			src={userProfilePicture}
			alt="Current user"
			class="h-8 w-8 overflow-hidden rounded-full object-cover"
		/>
	</a>

	<button
		class="variant-ghost-surface btn-icon h-10 w-12 md:hidden"
		use:popup={userMenuPopup}
		aria-label="Menu button"
	>
		<IconBarsThree cssClass="w-8 h-8" />
	</button>

	<div data-popup="userMenuPopup">
		<div class="borderborder-gray-400 card mr-3 mt-3 w-40 space-y-2 p-4 shadow-xl">
			<a class="variant-ghost btn w-full" href="/accounts" rel="noreferrer"
				>{$i18n('accounts.title')}</a
			>
			<a class="variant-ghost btn w-full" href="/balance" rel="noreferrer"
				>{$i18n('currentAmount.title')}</a
			>
			<a class="variant-ghost btn w-full" href="/settings" rel="noreferrer"
				>{$i18n('settings.title')}</a
			>
		</div>
	</div>
</div>
