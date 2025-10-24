<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import { ArrowLeftRightIcon } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import Landmark from 'lucide-svelte/icons/landmark';
	import Scale from 'lucide-svelte/icons/scale';
	import Settings from 'lucide-svelte/icons/settings';
	import { _ } from 'svelte-i18n';

	interface Props {
		children: Snippet;
		currentUrl: string;
	}

	const { children, currentUrl }: Props = $props();

	const buttonClasses = 'btn hover:preset-tonal';
	const anchorRail = `${buttonClasses} aspect-square w-full max-w-[84px] items-center`;
	const anchorSidebar = `${buttonClasses} justify-start px-2 w-full`;
	const anchorBar = 'btn hover:preset-tonal flex-col items-center gap-1';

	let isRailLayout = $state(true);
	const currentAnchor = $derived(isRailLayout ? anchorRail : anchorSidebar);

	/* eslint-disable svelte/no-navigation-without-resolve */
	/* Even though the href is resolved here, eslint still complains below */
	const links = [
		{ label: 'accounts.title', href: resolve('/accounts'), icon: Landmark },
		{ label: 'currentAmount.title', href: resolve('/balance'), icon: Scale },
		{ label: 'settings.title', href: resolve('/settings'), icon: Settings }
	];

	// Detect if the app is running as a progressive web app
	const isPWA =
		typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches;

	function toggleLayout() {
		isRailLayout = !isRailLayout;
	}

	function getButtonClass(href: string, isSidebar: boolean) {
		const selectedClass = currentUrl.startsWith(href) ? 'bg-secondary-100-900' : '';

		if (isSidebar) {
			return currentAnchor + ' ' + selectedClass;
		} else {
			return anchorBar + ' ' + selectedClass;
		}
	}
</script>

<div class="h-screen sm:grid sm:grid-cols-[auto_1fr]">
	<Navigation
		layout={isRailLayout ? 'rail' : 'sidebar'}
		class="hidden h-screen grid-rows-[1fr] gap-4 sm:grid {!isRailLayout && ''}"
	>
		<Navigation.Content>
			<Navigation.Menu>
				{#each links as link (link)}
					{@const Icon = link.icon}

					<a href={link.href} class={getButtonClass(link.href, true)}>
						<Icon class={isRailLayout ? 'size-5' : 'size-4'} />
						{#if !isRailLayout}<span>{$_(link.label)}</span>{/if}
					</a>
				{/each}
			</Navigation.Menu>
		</Navigation.Content>
		<Navigation.Footer>
			<button
				type="button"
				class={isRailLayout ? anchorRail : anchorSidebar}
				onclick={toggleLayout}
			>
				<ArrowLeftRightIcon class={isRailLayout ? 'size-5' : 'size-4'} />
				{#if !isRailLayout}<span>{$_('navigator.resize')}</span>{/if}
			</button>
		</Navigation.Footer>
	</Navigation>

	<div class="flex h-screen flex-col">
		<div class="flex-1 overflow-y-scroll">
			{@render children()}
		</div>

		<Navigation
			layout="bar"
			class="{isPWA
				? 'bg-surface-100-900 pr-4 pb-4 pl-4'
				: ''} border-t-surface-200-800 w-full border-t-1 sm:hidden"
		>
			<Navigation.Menu class="grid auto-cols-fr grid-flow-col gap-2">
				{#each links as link (link)}
					{@const Icon = link.icon}

					<a href={link.href} class={getButtonClass(link.href, false)}>
						<Icon class="size-5" />
						<span class="text-[10px]">{$_(link.label)}</span>
					</a>
				{/each}
			</Navigation.Menu>
		</Navigation>
	</div>
</div>
