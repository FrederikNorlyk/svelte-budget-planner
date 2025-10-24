<script lang="ts">
	import {
		Combobox,
		Portal,
		type ComboboxRootProps,
		useListCollection
	} from '@skeletonlabs/skeleton-svelte';
	import type { SelectOption } from '$lib/components/types/SelectOption';

	interface Props {
		name: string;
		label: string;
		value?: string;
		disabled?: boolean;
		allowCustomValue?: boolean;
		options: SelectOption<string>[];
	}

	const {
		name,
		label,
		value,
		disabled = false,
		allowCustomValue = false,
		options
	}: Props = $props();

	let items = $state(options);

	const collection = $derived(
		useListCollection({
			items: items,
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value
		})
	);

	const onOpenChange = () => {
		items = options;
	};

	const onInputValueChange: ComboboxRootProps['onInputValueChange'] = (event) => {
		const filtered = options.filter((option) =>
			option.value.toLowerCase().includes(event.inputValue.toLowerCase())
		);
		if (filtered.length > 0) {
			items = filtered;
		} else {
			items = options;
		}
	};
</script>

<Combobox
	class="w-full"
	placeholder="Search..."
	{collection}
	{onOpenChange}
	{onInputValueChange}
	{allowCustomValue}
	inputBehavior="autohighlight"
	openOnClick={true}
>
	<Combobox.Label>{label}</Combobox.Label>
	<Combobox.Control>
		<Combobox.Input {name} {value} {disabled} />
		<Combobox.Trigger />
	</Combobox.Control>
	<Portal>
		<Combobox.Positioner class="z-[1]!">
			<Combobox.Content>
				{#each items as item (item.value)}
					<Combobox.Item {item}>
						<Combobox.ItemText>{item.label}</Combobox.ItemText>
						<Combobox.ItemIndicator />
					</Combobox.Item>
				{/each}
			</Combobox.Content>
		</Combobox.Positioner>
	</Portal>
</Combobox>
