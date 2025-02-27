<script lang="ts">
	import Menu from 'lucide-svelte/icons/menu';
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import PencilLine from 'lucide-svelte/icons/pencil-line';
	import { type PopupSettings, popup } from '@skeletonlabs/skeleton';
	import { _ } from 'svelte-i18n';
	import { signOut } from '@auth/sveltekit/client';

	interface Props {
		title: string;
		titleParams?: Record<string, string | number | boolean | Date | null | undefined> | undefined;
		details: string;
		backHref?: string | undefined;
		editHref?: string | undefined;
	}

	let {
		title,
		titleParams = undefined,
		details,
		backHref = undefined,
		editHref = undefined
	}: Props = $props();

	const userMenuPopup: PopupSettings = {
		event: 'click',
		target: 'userMenuPopup',
		placement: 'bottom'
	};
</script>

<div class="flex space-x-2">
	<div class="flex flex-grow">
		{#if backHref}
			<a class="mr-2 mt-2" href={backHref}>
				<button type="button" class="variant-filled btn-icon" aria-label="Back button">
					<ArrowLeft />
				</button>
			</a>
		{/if}

		<div>
			{#if editHref}
				<a class="flex space-x-1" href={editHref} aria-label="Edit">
					<h1 class="text-3xl">{$_(title, { values: titleParams })}</h1>
					<PencilLine size="17" />
				</a>
				<p>{$_(details)}</p>
			{:else}
				<h1 class="text-3xl">{$_(title, { values: titleParams })}</h1>
				<p>{$_(details)}</p>
			{/if}
		</div>
	</div>

	<a class="variant-ghost-surface btn btn-sm hidden h-8 md:block" href="/accounts" rel="noreferrer"
		>{$_('accounts.title')}</a
	>
	<a class="variant-ghost-surface btn btn-sm hidden h-8 md:block" href="/balance" rel="noreferrer"
		>{$_('currentAmount.title')}</a
	>

	<div>
		<button
			class="variant-ghost-surface btn-icon btn-sm h-8 w-8"
			use:popup={userMenuPopup}
			aria-label="Menu button"
		>
			<Menu />
		</button>
	</div>

	<div data-popup="userMenuPopup" class="z-50">
		<div class="card mr-3 mt-3 w-40 space-y-2 p-4 shadow-xl">
			<a class="variant-ghost btn w-full md:hidden" href="/accounts" rel="noreferrer"
				>{$_('accounts.title')}</a
			>
			<a class="variant-ghost btn w-full md:hidden" href="/balance" rel="noreferrer"
				>{$_('currentAmount.title')}</a
			>
			<a class="variant-ghost btn w-full" href="/settings" rel="noreferrer"
				>{$_('settings.title')}</a
			>
			<button class="variant-ghost btn w-full" onclick={() => signOut()}>{$_('signOut')}</button>
		</div>
	</div>
</div>
