<script lang="ts">
	export let results: string[];
</script>

<ul>
	{#each results as result, index}
		<li>{result}</li>
	{/each}
</ul>
