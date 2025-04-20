<script lang="ts">
	import Tag from 'lucide-svelte/icons/tag';
	import Banknote from 'lucide-svelte/icons/banknote';
	import Landmark from 'lucide-svelte/icons/landmark';
	import { RecordType } from '$lib/models/SearchResult';
	import type SearchResult from '$lib/models/SearchResult';

	interface Props {
		results?: SearchResult[];
		onSearchResultClicked: () => void;
		/**
		 * References to each dom element for each search result.
		 */
		listElements?: HTMLAnchorElement[];
		setSearchFieldAsFocus: (typedCharacter: string) => void;
	}

	let {
		results = [],
		onSearchResultClicked,
		listElements = $bindable([]),
		setSearchFieldAsFocus
	}: Props = $props();

	function getResultIcon(result: SearchResult) {
		switch (result.recordType) {
			case RecordType.ACCOUNT:
				return Landmark;
			case RecordType.EXPENSE:
				return Banknote;
			case RecordType.TAG:
				return Tag;
		}
	}

	function onKeyUp(currentIndex: number, event: KeyboardEvent) {
		if (event.key === 'Tab') {
			// Preserve browser behaviour
			return;
		}

		// Some characters should be interpreted as a new search
		const searchCharacters = ['Backspace', '-', ',', '.'];

		// If you type a letter, a number, or any of searchCharacters, then auto-jump the user into the search field and type the key there.
		if (/^[a-zA-Z0-9]$/.test(event.key) || searchCharacters.includes(event.key)) {
			event.preventDefault();
			setSearchFieldAsFocus(event.key);
			return;
		}

		const validSearchListElements = listElements.filter((element) => element != null);

		if (!validSearchListElements.length) {
			return;
		}

		let index = 0;

		if (event.key === 'ArrowDown') {
			index = currentIndex + 1;
			if (index > validSearchListElements.length - 1) {
				index = 0;
			}
			validSearchListElements[index].focus();
		} else if (event.key === 'ArrowUp') {
			index = currentIndex - 1;
			if (index == -1) {
				index = validSearchListElements.length - 1;
			}
		}

		validSearchListElements[index].focus();
	}
</script>

<nav class="card bg-surface-50-950 p-2 shadow-2xl">
	<ul class="m-1 space-y-2">
		{#each results as result, index}
			{@const SvelteComponent = getResultIcon(result)}
			<li>
				<a
					bind:this={listElements[index]}
					onclick={() => {
						onSearchResultClicked();
					}}
					onkeyup={(e) => onKeyUp(index, e)}
					href={result.url}
					data-sveltekit-reload
					class="grid grid-cols-[auto_1fr] space-x-2"
				>
					<SvelteComponent size="20" class="m-1" />
					<span>{result.name}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
