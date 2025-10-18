<script lang="ts">
	import CircleArrowRight from 'lucide-svelte/icons/circle-arrow-right';
	import type { Account } from '$lib/models/Account';
	import { AmountUtil } from '$lib/util/AmountUtil';
	import { _ } from 'svelte-i18n';
	import { resolve } from '$app/paths';

	interface Props {
		account: Account;
	}

	const { account }: Props = $props();
</script>

<a
	class="card-primary clickable group p-10"
	href={resolve('/accounts/[accountId]', { accountId: String(account.id) })}
	aria-label="Open the account {account.name}"
>
	<div class="flex">
		<h2 class="text-surface-contrast-100-900 grow text-2xl">{account.name}</h2>

		<CircleArrowRight
			class="text-primary-400-600 group-hover:text-primary-600-400 ml-2 h-8 w-8 flex-none"
		/>
	</div>

	<div class="flex flex-wrap">
		<p class="text-surface-contrast-100-900 text-4xl font-bold">
			{AmountUtil.localizeInteger(account.monthlyAmount)}
		</p>
		<p class="text-neutral mt-auto">/{$_('month')}</p>
	</div>
</a>
