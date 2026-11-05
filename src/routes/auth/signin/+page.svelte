<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import Landmark from '@lucide/svelte/icons/landmark';

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

<main class="flex min-h-screen items-center justify-center p-4 sm:p-6 md:p-8">
	<section
		class="card-primary border-surface-200-800 flex w-full max-w-md flex-col items-center rounded-2xl border p-6 text-center shadow-xl sm:p-8 md:p-10"
	>
		<div
			class="bg-primary-500/10 text-primary-500 mb-4 flex size-14 items-center justify-center rounded-2xl shadow-xs"
		>
			<Landmark class="size-7" />
		</div>

		<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Budget planner</h1>
		<p class="text-neutral mt-2 text-sm sm:text-base">
			Sign in to manage your budget and track expenses
		</p>

		{#if errorMessage}
			<div
				class="bg-error-500/10 border-error-500/30 text-error-500 mt-4 w-full rounded-lg border p-3 text-center text-sm"
				role="alert"
			>
				{errorMessage}
			</div>
		{/if}

		<div class="mt-8 flex w-full flex-col items-center">
			<button
				type="button"
				class="btn-primary flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 sm:h-14"
				disabled={isSigningIn}
				onclick={signInWithGitHub}
			>
				<svg class="size-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
					/>
				</svg>
				<span>Sign in with GitHub</span>
			</button>

			<div class="border-surface-200-800 mt-6 w-full border-t pt-4">
				<form method="POST" action="?/demo" class="w-full">
					<button
						type="submit"
						class="text-neutral hover:text-surface-900-100 cursor-pointer text-xs transition-colors duration-150 hover:underline disabled:opacity-50 sm:text-sm"
						disabled={isSigningIn}
					>
						Sign in as a demo user
					</button>
				</form>
			</div>
		</div>
	</section>
</main>
