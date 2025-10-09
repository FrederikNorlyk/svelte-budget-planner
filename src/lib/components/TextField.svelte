<script lang="ts">
	interface Props {
		label: string;
		name: string;
		required?: boolean;
		value: string | number;
		autofocus?: boolean;
		disabled?: boolean;
	}

	const {
		label,
		name,
		required = false,
		value,
		autofocus = false,
		disabled = false,
		...rest
	}: Props = $props();
</script>

<label class="label">
	<span class="label-text">{label}</span>
	<!-- svelte-ignore a11y_autofocus -->
	<input
		{name}
		{required}
		{disabled}
		maxlength={100}
		class="input bg-surface-50-950"
		{autofocus}
		type="text"
		value={value ?? ''}
		{...rest}
	/>
</label>
