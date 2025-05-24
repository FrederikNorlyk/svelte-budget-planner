<script lang="ts">
	import CircleArrowRight from 'lucide-svelte/icons/circle-arrow-right';
	import type { Account } from '$lib/models/Account';
	import { AmountUtil } from '$lib/util/AmountUtil';
	import { _ } from 'svelte-i18n';

	interface Props {
		account: Account;
	}

	const { account }: Props = $props();
</script>

<a
	class="card-primary group p-10"
	href="/accounts/{account.id}"
	aria-label="Open the account {account.name}"
>
	<div class="flex">
		<h2 class="text-surface-contrast-100-900 grow text-2xl">{account.name}</h2>

		<CircleArrowRight class="ml-2 h-8 w-8 flex-none text-slate-300 group-hover:text-slate-400" />
	</div>

	<div class="flex flex-wrap">
		<p class="text-surface-contrast-100-900 text-4xl font-bold">
			{AmountUtil.localizeInteger(account.monthlyAmount)}
		</p>
		<p class="mt-auto text-slate-500">/{$_('month')}</p>
	</div>
</a>
