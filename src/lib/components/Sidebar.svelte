<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		children?: import('svelte').Snippet;
		links?: import('svelte').Snippet;
	}

	let { children, links }: Props = $props();

	let value = $state('accounts');
</script>

<div class="h-screen sm:grid sm:grid-cols-[auto_1fr]">
	<div class="hidden sm:flex">
		<Navigation.Rail {value} onValueChange={(newValue) => (value = newValue)} tiles={links} />
	</div>

	<div class="overflow-y-auto">
		{@render children?.()}
	</div>
</div>
