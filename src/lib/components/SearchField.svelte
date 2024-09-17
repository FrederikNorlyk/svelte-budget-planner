<script lang="ts">
	import IconMagnifyingGlass from '$lib/icons/IconMagnifyingGlass.svelte';

	export let hasFocus = false;
	export let onValueChanged: (value: string) => void;
	/**
	 * Fired when a keyboard key is pressed while the field has focus.
	 *
	 * Return true to indicate that the key press was captured by the parent and should not be handled by the
	 * search field.
	 */
	export let focusFirstSearchResult: () => void;
	export let focusLastSearchResult: () => void;
	export let input: HTMLInputElement;
	import { _ } from 'svelte-i18n';

	let value: string;
	let timeoutId: number;

	function onKeyUp(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			focusFirstSearchResult();
			event.preventDefault();
			return;
		} else if (event.key === 'ArrowUp') {
			focusLastSearchResult();
			event.preventDefault();
			return;
		}

		if (event.key === 'Escape' || event.key === 'Enter') {
			(event.target as HTMLInputElement).blur();
		}
	}

	function onInput(event: Event) {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		const target = event.target as HTMLInputElement;
		const value = target.value;

		if (value.trim() === '') {
			onValueChanged('');
		} else {
			timeoutId = window.setTimeout(() => onValueChanged(value), 400);
		}
	}
</script>

<button on:click={() => input.focus()} class="w-full cursor-text">
	<div class="input-group grid-cols-[auto_1fr_auto]">
		<div>
			<IconMagnifyingGlass cssClass="w-6 h-6 text-gray-600" />
		</div>

		<input
			on:focusin={() => {
				hasFocus = true;
			}}
			on:focusout={() => {
				hasFocus = false;
			}}
			on:keyup={onKeyUp}
			on:input={onInput}
			bind:this={input}
			bind:value
			type="search"
			placeholder={$_('searchField.placeholder')}
		/>
	</div></button
>
