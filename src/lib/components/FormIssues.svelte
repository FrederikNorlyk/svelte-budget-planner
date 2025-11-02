<script lang="ts">
	import type { RemoteFormIssue } from '@sveltejs/kit';
	import { _ } from 'svelte-i18n';

	interface Props {
		issues: RemoteFormIssue[] | undefined;
	}

	const { issues }: Props = $props();
</script>

{#if issues}
	<ul class="card bg-error-100-900 p-4">
		{#each issues as issue, index (index)}
			<li class="text-error-contrast-100-900">
				{$_(issue.message)}
			</li>
		{/each}
	</ul>
{/if}
