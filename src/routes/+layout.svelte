<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { ToastProvider } from '@skeletonlabs/skeleton-svelte';
	import Header from '$lib/components/Header.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<ToastProvider>
	<main class="p-5 pb-8 sm:pr-16 sm:pb-16 sm:pl-16 md:pr-20 md:pl-20 2xl:pr-36 2xl:pl-36">
		<Header
			title={$page.data.title}
			titleParams={$page.data.titleParams}
			details={$page.data.details}
			backHref={$page.data.backHref}
			editHref={$page.data.editHref}
		/>

		<div class="mt-2">
			<SearchBar />
		</div>

		<div class="mt-3">
			{@render children?.()}
		</div>
	</main>
</ToastProvider>
