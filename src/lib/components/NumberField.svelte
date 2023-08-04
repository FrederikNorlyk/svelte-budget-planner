<script lang="ts">
	export let label: string;
    export let name: string
	export let required = false
	export let value: any | undefined;
	export let autofocus = false
</script>

<label class="label">
	<span>{label}</span>
	<!-- svelte-ignore a11y-autofocus -->
	<input {name} {required} class="input bg-secondary-50" {autofocus} type="number" step="0.01" min="0" value={value ?? ''} />
</label>