<script lang="ts">
	import '../app.postcss';
	import { page } from '$app/stores';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { Toast, Modal, initializeStores } from '@skeletonlabs/skeleton';
	import Header from '$lib/components/Header.svelte';

	initializeStores();

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	const user = $page.data.session!.user;

	const profilePicture =
		user.image ?? `https://avatars.dicebear.com/api/identicon/${user.id ?? 'unknown'}.svg`;
</script>

<Modal />
<Toast />

<main>
	<div class="m-5 sm:ml-16 sm:mr-16 md:ml-20 md:mr-20 2xl:ml-36 2xl:mr-36">
		<Header
			title={$page.data.title}
			titleParams={$page.data.titleParams}
			details={$page.data.details}
			backHref={$page.data.backHref}
			editHref={$page.data.editHref}
			userProfilePicture={profilePicture}
		/>

		<div class="mt-3">
			<slot />
		</div>
	</div>
</main>
