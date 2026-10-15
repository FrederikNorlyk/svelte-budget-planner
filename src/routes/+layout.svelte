<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import Header from '$lib/components/Header.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { Toast } from '@skeletonlabs/skeleton-svelte';
	import Navigation from '$lib/components/Navigation.svelte';

	import { toaster } from '$lib/util/toaster';
	import { onMount } from 'svelte';
	import {
		getOfflineSnapshot,
		saveOfflineSnapshot,
		type OfflineSnapshot
	} from '$lib/offlineSnapshot';
	let offlineReady = $state(false);
	let isOnline = $state(true);
	onMount(() => {
		const sync = async () => {
			try {
				const response = await fetch('/api/offline-snapshot', { cache: 'no-store' });
				if (!response.ok) return;
				const snapshot = (await response.json()) as OfflineSnapshot;
				if (snapshot.complete && snapshot.userId) {
					await saveOfflineSnapshot(snapshot);
					localStorage.setItem('budget-planner-last-user', snapshot.userId);
					offlineReady = true;
				}
			} catch {
				// Keep readiness tied to the last committed complete snapshot.
			}
		};
		const update = () => (isOnline = navigator.onLine);
		const reconnect = () => {
			update();
			void sync();
		};
		window.addEventListener('online', reconnect);
		window.addEventListener('offline', update);
		update();
		const lastUser = localStorage.getItem('budget-planner-last-user');
		if (lastUser)
			void getOfflineSnapshot(lastUser).then(
				(snapshot) => (offlineReady = snapshot?.complete === true)
			);
		void sync();
		return () => {
			window.removeEventListener('online', reconnect);
			window.removeEventListener('offline', update);
		};
	});
	const { children } = $props();
</script>

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast}>
			<Toast.Message>
				<Toast.Title>{toast.title}</Toast.Title>
				<Toast.Description>{toast.description}</Toast.Description>
			</Toast.Message>
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>

<Navigation currentUrl={page.url.pathname}>
	<main class="p-5 sm:p-16 sm:pl-16 md:pr-20 md:pl-20 2xl:pr-36 2xl:pl-36">
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
			{#if !isOnline}
				<div class="alert-warning mb-3" role="status">
					Offline mode · showing saved data where available
				</div>
			{:else if offlineReady}
				<div class="text-success-700-300 mb-3 text-sm" role="status">Offline snapshot ready</div>
			{/if}
			{@render children?.()}
		</div>
	</main>
</Navigation>
