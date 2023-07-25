<script lang="ts">
	export let label: string;
    export let name: string
	export let value: any | undefined;
</script>

<div class="flex flex-col dark:text-white">
	<label for="{name}">{label}</label>
	<input name="{name}" value={value || ''} required={true} />
</div>
