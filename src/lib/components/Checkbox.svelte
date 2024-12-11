<script lang="ts">
	interface Props {
		label: string;
		name: string;
		value: boolean;
		disabled?: boolean;
	}

	let { label, name, value = $bindable(), disabled = false }: Props = $props();
</script>

<label class="flex items-center space-x-2">
	<input class="checkbox" type="checkbox" {name} bind:checked={value} {disabled} />
	<p>{label}</p>
</label>
