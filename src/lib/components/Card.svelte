<script lang="ts">
	import IconArrowCircleRight from '$lib/icons/IconArrowCircleRight.svelte';
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

	<IconArrowCircleRight size={8} cssClass="text-slate-300 group-hover:text-slate-400" />
</a>
