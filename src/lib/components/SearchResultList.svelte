<script lang="ts">
	export let results: string[];
</script>

<ul>
	{#each results as result}
		<li>{result}</li>
	{/each}
</ul>
