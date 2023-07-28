<script lang="ts">
	import IconArrowLeft from '$lib/icons/IconArrowLeft.svelte';
	import { page } from '$app/stores';
</script>

<div class="flex space-x-2">
	<a class="mt-2" href=".">
		<button type="button" class="btn-icon variant-filled">
			<IconArrowLeft cssClass="h-8 w-8" />
		</button>
	</a>
	<div>
		<h1 class="text-3xl">{$page.data.title}</h1>
		<p>{$page.data.details}</p>
	</div>
</div>

<div class="mt-3">
	<slot />
</div>
