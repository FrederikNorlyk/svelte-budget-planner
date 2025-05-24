<script lang="ts">
	import Plus from 'lucide-svelte/icons/plus';

	interface Props {
		href: string;
		ariaLabel: string;
	}

	const { href, ariaLabel }: Props = $props();
</script>

<a
	class="card-primary border-surface-200-800 flex items-center justify-center border-4 border-dashed p-10"
	{href}
	aria-label={ariaLabel}
>
	<Plus size="55" class="text-slate-300" />
</a>
