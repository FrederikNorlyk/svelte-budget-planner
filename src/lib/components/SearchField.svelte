<script lang="ts">
	import Search from 'lucide-svelte/icons/search';
	import { _ } from 'svelte-i18n';

	interface Props {
		onValueChanged: (value: string) => void;
		focusFirstSearchResult: () => void;
		focusLastSearchResult: () => void;
		input: HTMLInputElement;
	}

	let {
		onValueChanged,
		focusFirstSearchResult,
		focusLastSearchResult,
		input = $bindable()
	}: Props = $props();

	let value = $state('');
	let timeoutId: number;

	function onKeyUp(event: KeyboardEvent) {
		if (event.key === 'ArrowDown' || event.key === 'Enter') {
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
		const newValue = target.value;

		if (newValue.trim() === '') {
			onValueChanged('');
		} else {
			timeoutId = window.setTimeout(() => onValueChanged(newValue), 400);
		}
	}
</script>

<button onclick={() => input.focus()} class="w-full cursor-text">
	<span class="input-group grid-cols-[auto_1fr_auto]">
		<span class="ig-cell">
			<Search size="23" class="text-gray-500" />
		</span>

		<input
			onkeyup={onKeyUp}
			oninput={onInput}
			bind:this={input}
			bind:value
			type="search"
			placeholder={$_('searchField.placeholder')}
			class="ig-input"
		/>
	</span>
</button>
