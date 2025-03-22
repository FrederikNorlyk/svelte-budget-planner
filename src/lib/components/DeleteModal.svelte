<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { _ } from 'svelte-i18n';
	import { enhance } from '$app/forms';

	interface Props {
		open: boolean;
		title: string;
		body: string;
	}

	let { open, title, body }: Props = $props();

	let isSubmitting = $state(false);

	function onCancel() {
		open = false;
	}
</script>

<Modal
	{open}
	onOpenChange={(e) => (open = e.open)}
	triggerBase="btn preset-tonal"
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
			<form
				method="post"
				action="?/delete"
				use:enhance={() => {
					isSubmitting = true;

					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
			>
				<button type="button" class="btn preset-tonal" disabled={isSubmitting} onclick={onCancel}
					>{$_('button.cancel')}</button
				>
				<button type="submit" class="btn preset-filled" disabled={isSubmitting}
					>{$_('button.delete')}</button
				>
			</form>
		</footer>
	{/snippet}
</Modal>
