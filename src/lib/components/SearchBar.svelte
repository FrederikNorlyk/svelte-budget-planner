<script lang="ts">
	import type SearchResult from '$lib/models/SearchResult';
	import SearchField from './SearchField.svelte';
	import SearchResultList from './SearchResultList.svelte';

	let searchResults: SearchResult[] = [];
	let searchFieldInput: HTMLInputElement;
	let searchListElements: HTMLAnchorElement[];

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

	function onKeyPressed(event: KeyboardEvent): boolean {
		var validSearchListElements = searchListElements.filter((element) => element != null);

		if (event.key === 'ArrowDown') {
			if (validSearchListElements.length) {
				validSearchListElements[0].focus();
			}
			return true;
		} else if (event.key === 'ArrowUp') {
			if (validSearchListElements.length) {
				validSearchListElements[validSearchListElements.length - 1].focus();
			}
			return true;
		}
		return false;
	}
</script>

<SearchField bind:input={searchFieldInput} onValueChanged={onSearchValueChanged} {onKeyPressed} />

{#if searchResults.length > 0}
	<div class="mt-2">
		<SearchResultList
			onSearchResultClicked={() => {
				searchFieldInput.value = '';
				searchResults = [];
			}}
			setSearchFieldAsFocus={(typedCharacter) => {
				searchFieldInput.focus();
				searchFieldInput.value += typedCharacter;
				onSearchValueChanged(searchFieldInput.value);
			}}
			results={searchResults}
			bind:listElements={searchListElements}
		/>
	</div>
{/if}
