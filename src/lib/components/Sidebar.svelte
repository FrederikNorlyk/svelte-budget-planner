<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import { _ } from 'svelte-i18n';
	import Landmark from 'lucide-svelte/icons/landmark';
	import Settings from 'lucide-svelte/icons/settings';
	import Scale from 'lucide-svelte/icons/scale';
	import LogOut from 'lucide-svelte/icons/log-out';
	import { signOut } from '@auth/sveltekit/client';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	// State
	let value = $state('accounts');
</script>

<div class="card border-surface-100-900 grid h-full w-full grid-cols-[auto_1fr] border-[1px]">
	<Navigation.Rail {value} onValueChange={(newValue) => (value = newValue)}>
		{#snippet tiles()}
			<Navigation.Tile id="accounts" href="/accounts" label={$_('accounts.title')}
				><Landmark /></Navigation.Tile
			>
			<Navigation.Tile id="balance" href="/balance" label={$_('currentAmount.title')}
				><Scale /></Navigation.Tile
			>
			<Navigation.Tile id="settings" href="/settings" label={$_('settings.title')}
				><Settings /></Navigation.Tile
			>
			<Navigation.Tile id="signOut" label={$_('signOut')} onclick={() => signOut()}
				><LogOut /></Navigation.Tile
			>
		{/snippet}
	</Navigation.Rail>

	{@render children?.()}
</div>
