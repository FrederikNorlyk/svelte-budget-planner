<script lang="ts">
    import { signIn } from '@auth/sveltekit/client';
</script>

<h1>Not logged in</h1>
<button on:click={() => signIn()}>Sign In with GitHub</button>