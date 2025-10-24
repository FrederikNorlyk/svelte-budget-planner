<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import Header from '$lib/components/Header.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { Toast } from '@skeletonlabs/skeleton-svelte';
	import Navigation from '$lib/components/Navigation.svelte';

	import { toaster } from '$lib/util/toaster';
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
			{@render children?.()}
		</div>
	</main>
</Navigation>
