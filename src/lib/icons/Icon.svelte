<script lang="ts">
	export let size: number;
	export let cssClass: string | undefined;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	fill="none"
	viewBox="0 0 24 24"
	stroke-width="1.5"
	stroke="currentColor"
	class="h-{size} w-{size} {cssClass ?? ''}"
>
	<slot />
</svg>
