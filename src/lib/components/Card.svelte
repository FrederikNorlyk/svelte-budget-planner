<script lang="ts">
	import type { Account } from '$lib/models/Account';

	export let account: Account;
	export let totalAmount: number;
</script>

<a
	class="group flex rounded-md border bg-white p-10 hover:border-slate-300"
	href="/accounts/{account.getId()}"
>
	<div class="grow">
		<h2 class="text-2xl">{account.getName()}</h2>
		<h1 class="text-4xl">{totalAmount} kr,-</h1>
	</div>

	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="h-8 w-8 text-slate-300 group-hover:text-slate-400"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
</a>
