<script lang="ts">
	interface Props {
		children: import('svelte').Snippet;
	}

	const { children }: Props = $props();
</script>

<div class="flex space-x-2">
	{@render children()}
</div>
