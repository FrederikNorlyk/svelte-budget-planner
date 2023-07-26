<script lang="ts">
	export let label: string;
    export let name: string
	export let value: any | undefined;
</script>

<label class="label">
	<span>{label}</span>
	<input {name} class="input bg-secondary-50" type="text" value={value ?? ''} />
</label>