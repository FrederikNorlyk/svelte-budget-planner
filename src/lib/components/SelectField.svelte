<script lang="ts" generics="T extends object">
	import type { SelectOption } from './types/SelectOption';

	interface Props {
		name: string;
		label: string;
		required?: boolean | undefined;
		disabled?: boolean;
		value?: T | undefined;
		options: SelectOption<T>[];
	}

	const {
		name,
		label,
		required = undefined,
		disabled = false,
		value = undefined,
		options
	}: Props = $props();
</script>

<label class="label">
	<span class="label-text">{label}</span>

	<select {name} {disabled} {value} {required} class="input bg-surface-50-950" size="1">
		{#each options as option (option.value)}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</label>
