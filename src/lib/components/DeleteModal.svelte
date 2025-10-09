<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { _ } from 'svelte-i18n';

	interface Props {
		open?: boolean;
		title: string;
		body: string;
		onSubmit: () => void;
	}

	let { open = false, title, body, onSubmit }: Props = $props();

	function onCancel() {
		open = false;
	}
</script>

<Modal
	{open}
	onOpenChange={(e) => (open = e.open)}
	triggerBase="btn-neutral"
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet trigger()}{$_('button.delete')}{/snippet}
	{#snippet content()}
		<header class="flex justify-between">
			<h2 class="h2">{title}</h2>
		</header>
		<article>
			<p>{body}</p>
		</article>
		<footer class="flex justify-end gap-4">
			<button class="btn preset-tonal" onclick={onCancel}>{$_('button.cancel')}</button>
			<button class="btn preset-filled" onclick={onSubmit}>{$_('button.delete')}</button>
		</footer>
	{/snippet}
</Modal>
