<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';

	import { page } from '$app/stores';
	import { AppShell, AppBar, LightSwitch, Avatar, Toast, Modal, type PopupSettings, popup } from '@skeletonlabs/skeleton';
	import { signOut } from '@auth/sveltekit/client';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	const userMenuPopup: PopupSettings = {
		event: 'click',
		target: 'userMenuPopup',
		placement: 'bottom',
	};

	const user = $page.data.session?.user

	function getProfilePicture() {
		return user?.image ?? `https://avatars.dicebear.com/api/identicon/${user.id}.svg`
	}
</script>

<Modal />
<Toast />

<AppShell>
	<svelte:fragment slot="header">
		<AppBar shadow="shadow-md">
			<svelte:fragment slot="lead">
				<strong class="ml-5 text-xl sm:ml-16">Budget planner</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a class="btn btn-sm hidden sm:block variant-ghost-surface" href="/accounts" rel="noreferrer">Home</a>

				<LightSwitch />

				<button use:popup={userMenuPopup}>
					<Avatar src={getProfilePicture()} width="w-12" rounded="rounded-full" />
				</button>

				<div data-popup="userMenuPopup">
					<div class="card borderborder-gray-400 p-4 w-40 mr-3 mt-3 shadow-xl space-y-2">
						<a class="sm:hidden w-full btn variant-ghost" href="/accounts" rel="noreferrer">Home</a>
						<button on:click={() => signOut()} class="w-full btn variant-ghost">Sign out</button>
					</div>
				</div>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<div class="m-5 sm:m-16">
		<slot />
	</div>
</AppShell>
