<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
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

<Dialog {open} onOpenChange={(e) => (open = e.open)}>
	<Dialog.Trigger class="btn preset-filled">{$_('button.delete')}</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="bg-surface-50-950/50 fixed inset-0 z-50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center">
			<Dialog.Content class="card bg-surface-100-900 w-md space-y-2 p-4 shadow-xl">
				<Dialog.Title class="text-2xl font-bold">{title}</Dialog.Title>
				<Dialog.Description>{body}</Dialog.Description>

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
					<Dialog.CloseTrigger
						class="btn preset-tonal"
						type="button"
						onclick={onCancel}
						disabled={isSubmitting}>{$_('button.delete')}</Dialog.CloseTrigger
					>
					<Dialog.CloseTrigger class="btn preset-tonal" type="submit" disabled={isSubmitting}
						>{$_('button.cancel')}</Dialog.CloseTrigger
					>
				</form>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
