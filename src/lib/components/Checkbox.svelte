<script lang="ts">
	export let label: string;
    export let name: string
	export let checked: boolean;
</script>

<div class="flex flex-col dark:text-white">
	<label for="{name}">{label}</label>
	<input name="{name}" type="checkbox" {checked} />
</div>
