<script lang="ts">
	import IconArrowLeft from '$lib/icons/IconArrowLeft.svelte';
	import { page } from '$app/stores';
	import { i18n } from '$lib/localization/i18n';
	import IconPencilSquare from '$lib/icons/IconPencilSquare.svelte';
</script>

<div class="flex space-x-2">
	<a class="mt-2" href=".">
		<button type="button" class="btn-icon variant-filled" aria-label="Back button">
			<IconArrowLeft cssClass="h-8 w-8" />
		</button>
	</a>
	<div>
		{#if $page.data.editHref}
			<a class="flex" href={$page.data.editHref} aria-label="Edit">
				<h1 class="text-3xl">{$i18n($page.data.title)}</h1>
				<IconPencilSquare cssClass="flex-none h-5 w-5" />
			</a>
			<p>{$i18n($page.data.details)}</p>
		{:else}
			<h1 class="text-3xl">{$i18n($page.data.title)}</h1>
			<p>{$i18n($page.data.details)}</p>
		{/if}
	</div>
</div>

<div class="mt-3">
	<slot />
</div>
