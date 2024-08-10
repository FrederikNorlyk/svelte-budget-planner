<script lang="ts">
	import SearchField from './SearchField.svelte';
	import SearchResultList from './SearchResultList.svelte';

	let isSearching: boolean;
	let results: string[] = [];

	async function onSearchValueChanged(value: string) {
		if (value.trim() === '') {
			results = [];
			return;
		}

		const query = encodeURIComponent(value);
		const resposne = await fetch(`api/search?q=${query}`);
		const json = await resposne.json();
		results = json;
	}
</script>

<SearchField bind:hasFocus={isSearching} onValueChanged={onSearchValueChanged} />

{#if isSearching}
	<SearchResultList {results} />
{/if}
