<script>
	import { signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
</script>

<header class="flex">
	{#if $page.data.session?.user?.image}
		<img
			src={$page.data.session?.user?.image}
			alt={$page.data.session?.user?.name}
			style="width: 64px; height: 64px;"
		/>
	{/if}
	<span>
		<strong>{$page.data.session?.user?.name}</strong>
		<strong>{$page.data.session?.user?.id}</strong>
	</span>
	<button on:click={() => signOut()} class="button">Sign out</button>
</header>
