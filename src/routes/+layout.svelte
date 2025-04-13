<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import Header from '$lib/components/Header.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import { _ } from 'svelte-i18n';
	import Landmark from 'lucide-svelte/icons/landmark';
	import Settings from 'lucide-svelte/icons/settings';
	import Scale from 'lucide-svelte/icons/scale';
	import { Toaster } from '@skeletonlabs/skeleton-svelte';
	import { toaster } from '$lib/util/toaster';

	let { children } = $props();
</script>

{#snippet links()}
	<Navigation.Tile
		href="/accounts"
		label={$_('accounts.title')}
		selected={page.url.pathname.startsWith('/accounts')}><Landmark /></Navigation.Tile
	>
	<Navigation.Tile
		href="/balance"
		label={$_('currentAmount.title')}
		selected={page.url.pathname.startsWith('/balance')}><Scale /></Navigation.Tile
	>
	<Navigation.Tile
		href="/settings"
		label={$_('settings.title')}
		selected={page.url.pathname.startsWith('/settings')}><Settings /></Navigation.Tile
	>
{/snippet}

<Toaster {toaster}></Toaster>
<Sidebar {links}>
	<main class="p-5 pb-8 sm:pr-16 sm:pb-16 sm:pl-16 md:pr-20 md:pl-20 2xl:pr-36 2xl:pl-36">
		<Header
			title={page.data.title}
			titleParams={page.data.titleParams}
			details={page.data.details}
			backHref={page.data.backHref}
			editHref={page.data.editHref}
		/>

		<div class="mt-2">
			<SearchBar />
		</div>

		<div class="mt-3">
			{@render children?.()}
		</div>
	</main>
</Sidebar>

<div class="fixed bottom-0 w-full sm:hidden">
	<Navigation.Bar>
		{@render links?.()}
	</Navigation.Bar>
</div>
