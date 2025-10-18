<script lang="ts">
	import MessageCircleMore from 'lucide-svelte/icons/message-circle-more';

	import { _ } from 'svelte-i18n';

	interface Props {
		question: string;
	}

	const { question }: Props = $props();
</script>

<div class="space-y-6">
	<div class="dm:mr-60 relative mt-5 mr-20 md:ml-20">
		<p class="bg-surface-200-800 text-surface-contrast-200-800 rounded-xl p-5 pl-10 shadow-lg">
			{$_(question)}
		</p>
	</div>
	<div class="relative mt-5 ml-20 md:mr-20 md:ml-60">
		<span class="absolute -top-3 -left-3 h-10 w-10 rounded-full bg-white p-2">
			<MessageCircleMore />
		</span>
		<p class="rounded-xl bg-blue-600 p-5 pl-10 text-white shadow-lg">
			{$_('chat.howToAdd')}
		</p>
	</div>
</div>
