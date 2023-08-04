<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import { i18n, locale, locales } from '$lib/localization/i18n';
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';

	import {
		AppShell,
		AppBar,
		LightSwitch,
		Avatar,
		Toast,
		Modal,
		type PopupSettings,
		popup
	} from '@skeletonlabs/skeleton';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	const userMenuPopup: PopupSettings = {
		event: 'click',
		target: 'userMenuPopup',
		placement: 'bottom'
	};

	const user = $page.data.session?.user;

	function getProfilePicture() {
		return user?.image ?? `https://avatars.dicebear.com/api/identicon/${user.id}.svg`;
	}
</script>

<Modal />
<Toast />

<AppShell>
	<svelte:fragment slot="header">
		<AppBar shadow="shadow-md">
			<svelte:fragment slot="lead">
				<a
					href="/accounts"
					class="ml-5 select-none text-3xl sm:ml-16"
					style="font-family: 'Permanent Marker', cursive;"
				>
					Budget planner
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					class="btn btn-sm variant-ghost-surface hidden sm:block"
					href="/accounts"
					rel="noreferrer">{$i18n('accounts.title')}</a
				>
				<a class="btn btn-sm variant-ghost-surface hidden sm:block" href="/balance" rel="noreferrer"
					>{$i18n('currentAmount.title')}</a
				>

				<div class="hidden sm:block">
					<LightSwitch />
				</div>

				<select class="hidden sm:block" bind:value={$locale}>
					{#each locales as l}
						<option value={l}>{l}</option>
					{/each}
				</select>

				<button use:popup={userMenuPopup} aria-label="User menu button">
					<Avatar src={getProfilePicture()} width="w-12" rounded="rounded-full" />
				</button>

				<div data-popup="userMenuPopup">
					<div class="borderborder-gray-400 card mr-3 mt-3 w-40 space-y-2 p-4 shadow-xl">
						<a class="btn variant-ghost w-full sm:hidden" href="/accounts" rel="noreferrer"
							>{$i18n('accounts.title')}</a
						>
						<a class="btn variant-ghost w-full sm:hidden" href="/balance" rel="noreferrer"
							>{$i18n('currentAmount.title')}</a
						>

						<div class="block sm:hidden">
							<LightSwitch />
						</div>

						<select class="block sm:hidden" bind:value={$locale}>
							{#each locales as l}
								<option value={l}>{l}</option>
							{/each}
						</select>
						<button on:click={() => signOut()} class="btn variant-ghost w-full"
							>{$i18n('signOut')}</button
						>
					</div>
				</div>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<div class="m-5 sm:ml-16 sm:mr-16 sm:mt-10 md:ml-20 md:mr-20">
		<slot />
	</div>
</AppShell>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
</style>
