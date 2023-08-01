<script lang="ts">
	import IconArrowCircleRight from '$lib/icons/IconArrowCircleRight.svelte';
	import type { Account } from '$lib/models/Account';
	import { AmountUtil } from '$lib/util/AmountUtil';

	export let account: Account;
	export let totalAmount: number;
</script>

<a
	class="group card flex rounded-md bg-white p-10"
	href="/accounts/{account.getId()}"
	aria-label="Open the account {account.getName()}"
>
	<div class="grow">
		<h2 class="text-2xl">{account.getName()}</h2>
		<h1 class="text-4xl">{AmountUtil.localize(totalAmount)}</h1>
	</div>

	<IconArrowCircleRight cssClass="h-8 w-8 text-slate-300 group-hover:text-slate-400" />
</a>
