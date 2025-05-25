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
	triggerBase="btn-neutral"
	contentBase="card-primary p-9 space-y-4 shadow-xl max-w-screen-sm"
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
		<footer>
			<form
				method="post"
				action="?/delete"
				class="flex justify-end space-x-2"
				use:enhance={() => {
					isSubmitting = true;

					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
			>
				<button type="button" class="btn-neutral" disabled={isSubmitting} onclick={onCancel}
					>{$_('button.cancel')}</button
				>
				<button type="submit" class="btn-error" disabled={isSubmitting}
					>{$_('button.delete')}</button
				>
			</form>
		</footer>
	{/snippet}
</Modal>
