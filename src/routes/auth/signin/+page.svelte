<script lang="ts">
	import { authClient } from '$lib/auth-client';

	let isSigningIn = $state(false);
	let errorMessage = $state('');

	async function signInWithGitHub() {
		isSigningIn = true;
		errorMessage = '';

		const { error } = await authClient.signIn.social({
			provider: 'github',
			callbackURL: '/accounts'
		});

		if (error) {
			errorMessage = error.message ?? 'Unable to sign in.';
			isSigningIn = false;
		}
	}
</script>

<svelte:head>
	<title>Sign in</title>
</svelte:head>

{#if errorMessage}
	<p class="text-error-500" role="alert">{errorMessage}</p>
{/if}

<section class="flex-col space-y-4">
	<h1 class="text-center text-4xl">Budget planner</h1>

	<button
		type="button"
		class="btn-primary btn-lg h-20 w-full"
		disabled={isSigningIn}
		onclick={signInWithGitHub}
	>
		Sign in with GitHub
	</button>

	<form method="POST" action="?/demo">
		<button type="submit" class="btn-secondary btn-lg h-20 w-full" disabled={isSigningIn}>
			Sign in as a demo user
		</button>
	</form>
</section>
