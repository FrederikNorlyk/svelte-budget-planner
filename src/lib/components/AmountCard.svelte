<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { AmountUtil } from '$lib/util/AmountUtil';

	interface Props {
		text: string;
		amount: number;
	}

	const { text, amount }: Props = $props();
</script>

<div class="md:p-10">
	<h2 class="text-xl">{$_(text)}</h2>
	<div class="flex flex-wrap">
		<h1 class="text-2xl">{AmountUtil.localizeDecimal(amount)}</h1>
		<p class="mt-auto text-slate-500">/{$_('month')}</p>
	</div>
</div>
