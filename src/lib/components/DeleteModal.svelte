<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	interface Props {
		parent: SvelteComponent;
	}

	let { parent }: Props = $props();

	const modalStore = getModalStore();

	function cancelButtonPressed(event: Event) {
		event.preventDefault();
		parent.onClose();
	}
</script>

{#if $modalStore[0]}
	<div class="modal-example-form card w-modal space-y-4 bg-white p-4 shadow-xl">
		<header class="text-2xl font-bold">{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>

		<footer class="modal-footer {parent.regionFooter}">
			<form method="post" action="?/delete">
				<button class="btn {parent.buttonNeutral}" onclick={cancelButtonPressed}
					>{parent.buttonTextCancel}</button
				>
				<button class="btn {parent.buttonPositive}">{parent.buttonTextSubmit}</button>
			</form>
		</footer>
	</div>
{/if}
