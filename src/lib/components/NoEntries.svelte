<script lang="ts">
	import IconChatBubbleOvalLeftEllipsis from "$lib/icons/IconChatBubbleOvalLeftEllipsis.svelte";
	import { i18n } from "$lib/localization/i18n";

    export let question: string
</script>
<div class="space-y-6">
    <div class="relative ml-20 mr-60 mt-5">
        <p class="rounded-xl bg-slate-400 p-5 pl-10 text-white shadow-lg">
            {$i18n(question)}
        </p>
    </div>
    <div class="relative ml-60 mr-20 mt-5">
        <IconChatBubbleOvalLeftEllipsis cssClass="absolute -left-3 -top-3 h-11 w-11 rounded-full bg-white p-2" />
        <p class="rounded-xl bg-tertiary-500 p-5 pl-10 text-white shadow-lg">
            {$i18n('chat.howToAdd')}
        </p>
    </div>
</div>