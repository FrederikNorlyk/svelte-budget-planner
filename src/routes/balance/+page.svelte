<script lang="ts">
	import AccountBalanceCard from '$lib/components/AccountBalanceCard.svelte';

	const { data } = $props();
	const accounts = data.accounts;
</script>

<div class="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
	{#each accounts as account (account.id)}
		<AccountBalanceCard {account} />
	{/each}
</div>
