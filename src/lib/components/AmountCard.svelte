<script lang="ts">
	import { i18n } from '$lib/localization/i18n';
	import { AmountUtil } from '$lib/util/AmountUtil';

	export let text: string;
	export let amount: number;
</script>

<div class="md:p-10">
	<h2 class="text-xl">{$i18n(text)}</h2>
	<div class="flex flex-wrap">
		<h1 class="text-2xl">{AmountUtil.localize(amount)}</h1>
		<p class="mt-auto text-slate-500">/{$i18n('month')}</p>
	</div>
</div>
