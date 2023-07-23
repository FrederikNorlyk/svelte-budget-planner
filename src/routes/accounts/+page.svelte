<script lang="ts">
	import { Account } from '$lib/models/Account.js';

	export let data;
	const accounts = data.accounts.map((u) => Account.parse(u));
</script>

<h1>Accounts</h1>

<ul>
	{#each accounts as account (account.getId())}
		<li>{account.getName()}</li>
	{/each}
</ul>

<form method="POST">
    <label for="name">Name</label>
    <input name="name" />
    <button>Create account</button>
</form>