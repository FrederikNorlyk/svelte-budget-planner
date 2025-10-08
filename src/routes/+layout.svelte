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
	import { resolve } from '$app/paths';

	const { children } = $props();

	// Detect if the app is running as a progressive web app
	const isPWA =
		typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches;
</script>

{#snippet links()}
	<Navigation.Tile
		href={resolve('/accounts')}
		label={$_('accounts.title')}
		selected={page.url.pathname.startsWith('/accounts')}
	>
		<Landmark />
	</Navigation.Tile>
	<Navigation.Tile
		href={resolve('/balance')}
		label={$_('currentAmount.title')}
		selected={page.url.pathname.startsWith('/balance')}
	>
		<Scale />
	</Navigation.Tile>
	<Navigation.Tile
		href={resolve('/settings')}
		label={$_('settings.title')}
		selected={page.url.pathname.startsWith('/settings')}
	>
		<Settings />
	</Navigation.Tile>
{/snippet}

<Toaster {toaster}></Toaster>
<Sidebar {links}>
	<main class="mb-28 p-5 sm:mb-0 sm:pr-16 sm:pl-16 md:pr-20 md:pl-20 2xl:pr-36 2xl:pl-36">
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

<div
	class="{isPWA
		? 'bg-surface-100-900 pr-4 pb-4 pl-4'
		: ''} border-t-surface-200-800 fixed bottom-0 w-full border-t-1 sm:hidden"
>
	<Navigation.Bar>
		{@render links?.()}
	</Navigation.Bar>
</div>
