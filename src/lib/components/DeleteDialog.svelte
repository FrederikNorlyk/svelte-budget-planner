<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import { _ } from 'svelte-i18n';

	interface Props {
		title: string;
		body: string;
		onSubmit: () => Promise<void>;
	}

	const { title, body, onSubmit }: Props = $props();

	let isSubmitting = $state(false);
</script>

<Dialog>
	<Dialog.Trigger class="btn-neutral">{$_('button.delete')}</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="bg-surface-50-950/50 fixed inset-0 z-50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center">
			<Dialog.Content class="card-primary max-w-screen-sm space-y-4 p-9 shadow-xl">
				<Dialog.Title class="text-2xl font-bold">{title}</Dialog.Title>
				<Dialog.Description>{body}</Dialog.Description>

				<Dialog.CloseTrigger class="btn-neutral" type="button" disabled={isSubmitting}
					>{$_('button.cancel')}</Dialog.CloseTrigger
				>
				<Dialog.CloseTrigger
					class="btn-error"
					type="submit"
					disabled={isSubmitting}
					onclick={() => {
						isSubmitting = true;

						onSubmit().then(() => {
							isSubmitting = false;
						});
					}}>{$_('button.delete')}</Dialog.CloseTrigger
				>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
