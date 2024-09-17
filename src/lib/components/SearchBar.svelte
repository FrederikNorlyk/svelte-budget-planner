<script lang="ts">
	import type SearchResult from '$lib/models/SearchResult';
	import SearchField from './SearchField.svelte';
	import SearchResultList from './SearchResultList.svelte';
	import { onMount, onDestroy } from 'svelte';

	let searchResults: SearchResult[] = [];
	let searchFieldInput: HTMLInputElement;
	let searchListDomElements: HTMLAnchorElement[] = [];

	async function onSearchValueChanged(value: string) {
		if (value.trim() === '') {
			searchResults = [];
			return;
		}

		const query = encodeURIComponent(value);
		const response = await fetch(`/api/search?q=${query}`);

		if (!response.ok) {
			console.error('Server error:', response.statusText);
			return;
		}

		const json = await response.json();

		searchResults = json;
	}

	function focusFirstSearchResult() {
		var validSearchListElements = searchListDomElements.filter((element) => element != null);

		validSearchListElements[0]?.focus();
	}

	function focusLastSearchResult() {
		var validSearchListElements = searchListDomElements.filter((element) => element != null);
		validSearchListElements.at(-1)?.focus();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.ctrlKey && event.key === 'k') {
			event.preventDefault();
			searchFieldInput?.focus();
		}
	}

	onMount(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', handleKeydown);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleKeydown);
		}
	});
</script>

<SearchField
	bind:input={searchFieldInput}
	onValueChanged={onSearchValueChanged}
	{focusFirstSearchResult}
	{focusLastSearchResult}
/>

{#if searchResults.length > 0}
	<div class="mt-2">
		<SearchResultList
			onSearchResultClicked={() => {
				searchFieldInput.value = '';
				searchResults = [];
			}}
			setSearchFieldAsFocus={(typedCharacter) => {
				searchFieldInput.focus();
				if (typedCharacter == 'Backspace') {
					searchFieldInput.value = searchFieldInput.value.substring(
						0,
						searchFieldInput.value.length - 1
					);
				} else {
					searchFieldInput.value += typedCharacter;
				}
				onSearchValueChanged(searchFieldInput.value);
			}}
			results={searchResults}
			bind:listElements={searchListDomElements}
		/>
	</div>
{/if}
