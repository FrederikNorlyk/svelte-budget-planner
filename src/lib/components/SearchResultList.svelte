<script lang="ts">
	import Tag from 'lucide-svelte/icons/tag';
	import Banknote from 'lucide-svelte/icons/banknote';
	import Landmark from 'lucide-svelte/icons/landmark';
	import { RecordType } from '$lib/models/SearchResult';
	import type SearchResult from '$lib/models/SearchResult';

	export let results: SearchResult[] = [];
	export let onSearchResultClicked: () => void;
	/**
	 * References to each dom element for each search result.
	 */
	export let listElements: HTMLAnchorElement[] = [];
	export let setSearchFieldAsFocus: (typedCharacter: string) => void;

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
		// Some characters should be interpret it as a new search
		var searchCharacters = ['Backspace', '-', ',', '.'];

		if (/^[a-zA-Z0-9]$/.test(event.key) || searchCharacters.includes(event.key)) {
			event.preventDefault();
			setSearchFieldAsFocus(event.key);
			return;
		}

		var validSearchListElements = listElements.filter((element) => element != null);

		if (!validSearchListElements.length) {
			return;
		}

		var index = 0;

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

<nav class="card list-nav bg-white p-2 shadow-2xl">
	<ul>
		{#each results as result, index}
			<li>
				<a
					bind:this={listElements[index]}
					on:click={() => {
						onSearchResultClicked();
					}}
					on:keyup={(e) => onKeyUp(index, e)}
					href={result.url}
					data-sveltekit-reload
				>
					<span class="badge">
						<svelte:component this={getResultIcon(result)} size="20" />
					</span>
					<span class="flex-auto">{result.name}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
