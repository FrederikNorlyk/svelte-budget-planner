<script lang="ts">
	import type SearchResult from '$lib/models/SearchResult';
	import SearchField from './SearchField.svelte';
	import SearchResultList from './SearchResultList.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { getOfflineSnapshot } from '$lib/offlineSnapshot';
	import { resolve } from '$app/paths';
	import { RecordType } from '$lib/models/SearchResult';

	let searchResults: SearchResult[] = $state([]);
	// TODO: figure out how bind stateful dom elements
	let searchFieldInput: any = $state(); // eslint-disable-line
	let searchListDomElements: HTMLAnchorElement[] = $state([]);

	async function onSearchValueChanged(value: string) {
		if (value.trim() === '') {
			searchResults = [];
			return;
		}

		const query = encodeURIComponent(value);
		try {
			const response = await fetch(`/api/search?q=${query}`);

			if (!response.ok) {
				console.error('Server error:', response.statusText);
				return;
			}

			searchResults = await response.json();
		} catch {
			const userId = localStorage.getItem('budget-planner-last-user');
			const snapshot = userId ? await getOfflineSnapshot(userId) : null;
			if (!snapshot) return;
			const q = value.trim().toLocaleLowerCase();
			searchResults = [
				...snapshot.accounts
					.filter((account) => account.name.toLocaleLowerCase().includes(q))
					.map((account) => ({
						name: account.name,
						url: resolve('/accounts/[accountId]', { accountId: String(account.id) }),
						recordType: RecordType.ACCOUNT
					})),
				...snapshot.expenses
					.filter((expense) => expense.name.toLocaleLowerCase().includes(q))
					.map((expense) => ({
						name: expense.name,
						url: resolve('/accounts/[accountId]/[expenseId]', {
							accountId: String(expense.accountId),
							expenseId: String(expense.id)
						}),
						recordType: RecordType.EXPENSE
					})),
				...[
					...new Set(
						snapshot.expenses
							.map((expense) => expense.tag)
							.filter((tag): tag is string => tag != null && tag.toLocaleLowerCase().includes(q))
					)
				].map((tag) => ({
					name: tag,
					url: resolve('/tags/[name]', { name: tag }),
					recordType: RecordType.TAG
				}))
			];
		}
	}

	function focusFirstSearchResult() {
		const validSearchListElements = searchListDomElements.filter((element) => element != null);

		validSearchListElements[0]?.focus();
	}

	function focusLastSearchResult() {
		const validSearchListElements = searchListDomElements.filter((element) => element != null);
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
				if (typedCharacter === 'Backspace') {
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
