<script lang="ts">
	import { Account } from '$lib/models/Account.js';

    export let data
    const account = data.account != null ? Account.parse(data.account) : null
</script>

<form method="post" action="/update"></form>

<form method="POST">
    <label for="name">Name</label>
    <input name="name" value="{account?.getName() || ''}" />
    
    {#if account == null}
        <button>Create account</button>
    {:else}
        <button>Update account</button>
    {/if}
    
</form>