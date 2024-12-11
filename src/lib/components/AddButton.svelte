<script lang="ts">
	import Plus from 'lucide-svelte/icons/plus';

	interface Props {
		href: string;
		ariaLabel: string;
	}

	let { href, ariaLabel }: Props = $props();
</script>

<a
	class="card flex items-center justify-center rounded-md border-4 border-dashed bg-white p-10"
	{href}
	aria-label={ariaLabel}
>
	<Plus size="55" class="text-slate-300" />
</a>
