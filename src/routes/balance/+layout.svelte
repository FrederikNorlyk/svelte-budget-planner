<script lang="ts">
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { SvelteMap } from 'svelte/reactivity';

	const { children } = $props();

	const scrollPositions = new SvelteMap<string, number>();

	beforeNavigate((nav) => {
		if (nav.from?.url.pathname) {
			// Store the scroll position for the current page
			scrollPositions.set(nav.from.url.pathname, window.scrollY);
		}
	});

	afterNavigate((nav) => {
		if (nav.to?.url.pathname) {
			// Restore the scroll position for the page if it exists
			const savedPosition = scrollPositions.get(nav.to.url.pathname);
			if (savedPosition !== undefined) {
				window.scrollTo(0, savedPosition);
			}
		}
	});
</script>

{@render children?.()}
