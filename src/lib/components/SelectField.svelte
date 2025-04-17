<script lang="ts" generics="T extends Object">
	import type { SelectOption } from './types/SelectOption';

	interface Props {
		name: string;
		label: string;
		required?: boolean | undefined;
		disabled?: boolean;
		// Eslint undefined type warning, has been disabled as it does not recognize the svelte syntax: generics="T"
		value?: T | undefined; // eslint-disable-line no-undef
		options: SelectOption<T>[]; // eslint-disable-line no-undef
	}

	let {
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

	<select {name} {disabled} {value} {required} class="input bg-surface-50" size="1">
		{#each options as option (option.value)}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</label>
