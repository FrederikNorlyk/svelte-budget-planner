<script lang="ts">
	import Menu from 'lucide-svelte/icons/menu';
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import PencilLine from 'lucide-svelte/icons/pencil-line';
	import { _ } from 'svelte-i18n';
	import { signOut } from '@auth/sveltekit/client';
	import { Modal } from '@skeletonlabs/skeleton-svelte';

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

	let drawerState = $state(false);

	function drawerClose() {
		drawerState = false;
	}
</script>

<div class="flex space-x-2">
	<div class="flex grow">
		{#if backHref}
			<a class="mt-2 mr-2" href={backHref}>
				<button type="button" class="preset-filled btn-icon" aria-label="Back button">
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

	<a
		class="preset-tonal-surface border-surface-500 btn btn-sm hidden h-8 border md:block"
		href="/accounts"
		rel="noreferrer">{$_('accounts.title')}</a
	>
	<a
		class="preset-tonal-surface border-surface-500 btn btn-sm hidden h-8 border md:block"
		href="/balance"
		rel="noreferrer">{$_('currentAmount.title')}</a
	>

	<Modal
		open={drawerState}
		onOpenChange={(e) => (drawerState = e.open)}
		triggerBase="btn preset-tonal"
		contentBase="bg-surface-100-900 p-4 space-y-4 shadow-xl w-[300px] h-screen"
		positionerJustify="justify-end"
		positionerAlign=""
		positionerPadding=""
		transitionsPositionerIn={{ x: 480, duration: 200 }}
		transitionsPositionerOut={{ x: 480, duration: 200 }}
	>
		{#snippet trigger()}
			<Menu />
		{/snippet}
		{#snippet content()}
			<header class="w-full">
				<h2 class="h2 text-center">{$_('navigationMenu.title')}</h2>
			</header>
			<div class="flex flex-col gap-y-2">
				<a class="btn preset-filled-primary-500 md:hidden" href="/accounts" rel="noreferrer"
					>{$_('accounts.title')}</a
				>
				<a class="btn preset-filled-primary-500 md:hidden" href="/balance" rel="noreferrer"
					>{$_('currentAmount.title')}</a
				>
				<a class="btn preset-filled-primary-500" href="/settings" rel="noreferrer"
					>{$_('settings.title')}</a
				>
				<button type="button" class="btn preset-filled-primary-500" onclick={() => signOut()}
					>{$_('signOut')}</button
				>
			</div>
			<footer class="flex flex-col">
				<button type="button" class="btn preset-filled" onclick={drawerClose}
					>{$_('navigationMenu.closeButton')}</button
				>
			</footer>
		{/snippet}
	</Modal>
</div>
