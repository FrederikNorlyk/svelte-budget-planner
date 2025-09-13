<script lang="ts">
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import PencilLine from 'lucide-svelte/icons/pencil-line';
	import { _ } from 'svelte-i18n';
	import type { ResolvedPathname } from '$app/types';

	interface Props {
		title: string;
		titleParams?: Record<string, string | number | boolean | Date | null | undefined> | undefined;
		details: string;
		backHref?: ResolvedPathname | undefined;
		editHref?: ResolvedPathname | undefined;
	}

	const {
		title,
		titleParams = undefined,
		details,
		backHref = undefined,
		editHref = undefined
	}: Props = $props();
</script>

<div class="flex space-x-2">
	<div class="flex grow">
		{#if backHref}
			<!-- eslint-disable svelte/no-navigation-without-resolve -->
			<!-- ESLint does not accept that result.url is of type ResolvedPathname -->
			<a class="mt-2 mr-2" href={backHref}>
				<button type="button" class="preset-filled btn-icon" aria-label="Back button">
					<ArrowLeft />
				</button>
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
		{/if}

		<div>
			{#if editHref}
				<!-- eslint-disable svelte/no-navigation-without-resolve -->
				<!-- ESLint does not accept that result.url is of type ResolvedPathname -->
				<a class="flex space-x-1" href={editHref} aria-label="Edit">
					<h1 class="text-3xl">{$_(title, { values: titleParams })}</h1>
					<PencilLine size="17" />
				</a>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
				<p>{$_(details)}</p>
			{:else}
				<h1 class="text-3xl">{$_(title, { values: titleParams })}</h1>
				<p>{$_(details)}</p>
			{/if}
		</div>
	</div>
</div>
