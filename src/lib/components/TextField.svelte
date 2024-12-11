<script lang="ts">
	interface Props {
		label: string;
		name: string;
		required?: boolean;
		value: string | undefined;
		autofocus?: boolean;
		disabled?: boolean;
	}

	let {
		label,
		name,
		required = false,
		value,
		autofocus = false,
		disabled = false
	}: Props = $props();
</script>

<label class="label">
	<span>{label}</span>
	<!-- svelte-ignore a11y_autofocus -->
	<input
		{name}
		{required}
		{disabled}
		maxlength={100}
		class="input bg-secondary-50"
		{autofocus}
		type="text"
		value={value ?? ''}
	/>
</label>
