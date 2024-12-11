<script lang="ts">
	import MessageCircleMore from 'lucide-svelte/icons/message-circle-more';

	import { _ } from 'svelte-i18n';

	interface Props {
		question: string;
	}

	let { question }: Props = $props();
</script>

<div class="space-y-6">
	<div class="dm:mr-60 relative mr-20 mt-5 md:ml-20">
		<p class="rounded-xl bg-slate-400 p-5 pl-10 text-white shadow-lg">
			{$_(question)}
		</p>
	</div>
	<div class="relative ml-20 mt-5 md:ml-60 md:mr-20">
		<span class="absolute -left-3 -top-3 h-10 w-10 rounded-full bg-white p-2">
			<MessageCircleMore />
		</span>
		<p class="rounded-xl bg-tertiary-500 p-5 pl-10 text-white shadow-lg">
			{$_('chat.howToAdd')}
		</p>
	</div>
</div>
