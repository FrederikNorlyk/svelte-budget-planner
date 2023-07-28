<script lang="ts" generics="T extends Object">
	import type { SelectOption } from "./types/SelectOption";

    export let name: string
    export let label: string
    export let value: T | undefined = undefined
    export let required: boolean | undefined = undefined
    export let options: SelectOption<T>[]
</script>

<label class="label">
	<span>{label}</span>
    
	<select {name} class="input bg-secondary-50" size="1" value={value} {required}>
        {#each options as option (option.value)}
            <option value={option.value}>{option.text}</option>
        {/each}
    </select>
</label>
