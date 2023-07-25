<script>
	import { signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
</script>

<header class="flex space-x-5 bg-emerald-500 dark:bg-slate-200 dark:text-slate-800 text-slate-100">
	{#if $page.data.session?.user?.image}
		<img class="flex-none"
			src={$page.data.session?.user?.image}
			alt={$page.data.session?.user?.name}
			style="width: 64px; height: 64px;"
		/>
	{/if}
	<span>
		<strong>{$page.data.session?.user?.name}</strong>
		<strong>{$page.data.session?.user?.id}</strong>
	</span>
	<button on:click={() => signOut()}>Sign out</button>
	<a href="/">Home</a>
	<a href="/accounts">Accounts</a>
</header>
