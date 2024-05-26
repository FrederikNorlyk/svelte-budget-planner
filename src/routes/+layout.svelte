<script lang="ts">
	import '../app.postcss';
	import { i18n } from '$lib/localization/i18n';
	import { page } from '$app/stores';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';

	import {
		AppShell,
		AppBar,
		Toast,
		Modal,
		type PopupSettings,
		popup,
		initializeStores
	} from '@skeletonlabs/skeleton';
	import IconBarsThree from '$lib/icons/IconBarsThree.svelte';

	initializeStores();

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	const userMenuPopup: PopupSettings = {
		event: 'click',
		target: 'userMenuPopup',
		placement: 'bottom'
	};

	const user = $page.data.session?.user;

	function getProfilePicture() {
		return user?.image ?? `https://avatars.dicebear.com/api/identicon/${user?.id ?? 'unknown'}.svg`;
	}
</script>

<Modal />
<Toast />

<AppShell>
	<svelte:fragment slot="header">
		<AppBar
			shadow="shadow-md"
			padding="p-3 pl-5 pr-5 sm:pl-16 sm:pr-16 md:pl-20 md:pr-20 2xl:pl-36 2xl:pr-36"
		>
			<svelte:fragment slot="lead">
				<a
					href="/accounts"
					class="select-none text-3xl"
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

				<a href="/settings" class="hidden sm:block">
					<img
						src={getProfilePicture()}
						alt="Current user"
						class="overflow-hidden rounded-full w-12 h-12 object-cover"
					/>
				</a>

				<button class="sm:hidden pr-4" use:popup={userMenuPopup} aria-label="Menu button">
					<IconBarsThree cssClass="w-8 h-8" />
				</button>

				<div data-popup="userMenuPopup">
					<div class="borderborder-gray-400 card mr-3 mt-3 w-40 space-y-2 p-4 shadow-xl">
						<a class="btn variant-ghost w-full sm:hidden" href="/accounts" rel="noreferrer"
							>{$i18n('accounts.title')}</a
						>
						<a class="btn variant-ghost w-full sm:hidden" href="/balance" rel="noreferrer"
							>{$i18n('currentAmount.title')}</a
						>
						<a class="btn variant-ghost w-full sm:hidden" href="/settings" rel="noreferrer"
							>{$i18n('settings.title')}</a
						>
					</div>
				</div>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<div class="m-5 sm:ml-16 sm:mr-16 sm:mt-10 md:ml-20 md:mr-20 2xl:ml-36 2xl:mr-36">
		<slot />
	</div>
</AppShell>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
</style>
