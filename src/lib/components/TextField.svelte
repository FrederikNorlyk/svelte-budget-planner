<script lang="ts">
	export let label: string;
    export let name: string
	export let required = false
	export let value: any | undefined;
	export let autofocus = false
</script>

<label class="label">
	<span>{label}</span>
	<input {name} {required} maxlength={100} class="input bg-secondary-50" {autofocus} type="text" value={value ?? ''} />
</label>