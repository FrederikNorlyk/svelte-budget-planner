<script lang="ts">
	import IconArrowLeft from '$lib/icons/IconArrowLeft.svelte';
	import IconPencilSquare from '$lib/icons/IconPencilSquare.svelte';
	import { i18n } from '$lib/localization/i18n';

	export let title: string;
	export let titleParams: {} | undefined;
	export let details: string;
	export let backHref: string | undefined = undefined;
	export let editHref: string | undefined = undefined;
</script>

<div class="flex space-x-2">
	{#if backHref}
		<a class="mt-2" href={backHref}>
			<button type="button" class="variant-filled btn-icon" aria-label="Back button">
				<IconArrowLeft cssClass="h-8 w-8" />
			</button>
		</a>
	{/if}

	<div>
		{#if editHref}
			<a class="flex space-x-1" href={editHref} aria-label="Edit">
				<h1 class="text-3xl">{$i18n(title, titleParams)}</h1>
				<IconPencilSquare cssClass="flex-none h-5 w-5" />
			</a>
			<p>{$i18n(details)}</p>
		{:else}
			<h1 class="text-3xl">{$i18n(title, titleParams)}</h1>
			<p>{$i18n(details)}</p>
		{/if}
	</div>
</div>
