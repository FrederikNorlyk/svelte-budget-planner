<script lang="ts">
	export let label: string;
    export let name: string
	export let checked: boolean;
</script>

<label class="flex items-center space-x-2">
	<input {name} class="checkbox" type="checkbox" {checked} />
	<p>{label}</p>
</label>