<script lang="ts">
	import TextField from '$lib/components/TextField.svelte';
	import { Account } from '$lib/models/Account';

	export let data;
	export let form;

	let account = data.account != null ? Account.parse(data.account) : null;
</script>

<form class="card space-y-2 bg-white p-4" method="post" action="?/save">
	<TextField name="name" label="Name" required={true} value={account?.getName()} />

	{#if form?.error}
		<p>{form?.error}</p>
	{/if}

	<div class="flex space-x-2">
		<button class="btn variant-filled basis-1/4 bg-primary-500">Save</button>

		{#if account != null}
			<button class="btn variant-filled basis-1/4" formaction="?/delete">Delete account</button>
		{/if}
	</div>
</form>
