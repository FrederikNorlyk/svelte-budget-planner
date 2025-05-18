<script lang="ts">
	interface Props {
		label: string;
		name: string;
		required?: boolean;
		value: number | undefined;
		autofocus?: boolean;
		disabled?: boolean;
	}

	const {
		label,
		name,
		required = false,
		value,
		autofocus = false,
		disabled = false
	}: Props = $props();
</script>

<label class="label">
	<span class="label-text">{label}</span>
	<!-- svelte-ignore a11y_autofocus -->
	<input
		{name}
		{required}
		{disabled}
		class="input bg-surface-50-950"
		{autofocus}
		type="number"
		step="0.01"
		min="0"
		value={value ?? ''}
	/>
</label>
