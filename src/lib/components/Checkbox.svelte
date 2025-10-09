<script lang="ts">
	interface Props {
		label: string;
		name: string;
		checked: boolean;
		disabled: boolean;
	}

	let { label, name, checked = $bindable(), disabled = false, ...rest }: Props = $props();
</script>

<label class="flex items-center space-x-2">
	<input class="checkbox" type="checkbox" {name} bind:checked {disabled} {...rest} />
	<span>{label}</span>
</label>
