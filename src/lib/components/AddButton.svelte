<script lang="ts">
	import Plus from '@lucide/svelte/icons/plus';
	import type { ResolvedPathname } from '$app/types';
	import { onMount } from 'svelte';

	interface Props {
		href: ResolvedPathname;
		ariaLabel: string;
	}

	const { href, ariaLabel }: Props = $props();
	let online = $state(true);
	onMount(() => {
		const update = () => (online = navigator.onLine);
		window.addEventListener('online', update);
		window.addEventListener('offline', update);
		update();
		return () => {
			window.removeEventListener('online', update);
			window.removeEventListener('offline', update);
		};
	});
</script>

{#if online}
	<a
		class="group card-primary clickable border-surface-200-800 hover:border-surface-300-700 flex items-center justify-center border-4 border-dashed p-10"
		{href}
		aria-label={ariaLabel}
	>
		<Plus size="55" class="text-primary-400-600 group-hover:text-primary-600-400" />
	</a>
{/if}
