<script lang="ts">
	import { Account } from '$lib/models/Account.js';

	export let data;
	const accounts = data.accounts.map((u) => Account.parse(u));
</script>

<h1>Accounts</h1>
<a href="accounts/0">New account</a>

<ul>
	{#each accounts as account (account.getId())}
		<li>{account.getName()} <a href="accounts/{account.getId()}">Click me</a></li>
	{/each}
</ul>