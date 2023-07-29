<script>
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';

	import { page } from '$app/stores';
	import { AppShell, AppBar, LightSwitch, Avatar, Toast, Modal } from '@skeletonlabs/skeleton';
	import { signOut } from '@auth/sveltekit/client';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<Modal />
<Toast />

<AppShell>
	<svelte:fragment slot="header">
		<AppBar shadow="shadow-md">
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Skeleton</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a class="btn btn-sm variant-ghost-surface" href="/" rel="noreferrer"> Home </a>
				<a class="btn btn-sm variant-ghost-surface" href="/accounts" rel="noreferrer"> Accounts </a>

				<button on:click={() => signOut()} class="btn btn-sm variant-ghost-surface">Sign out</button
				>
				<LightSwitch />
				{#if $page.data.session?.user?.image}
					<Avatar src={$page.data.session.user.image} width="w-12" rounded="rounded-full" />
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<div class="m-5 sm:m-16">
		<slot />
	</div>
</AppShell>
