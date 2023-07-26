<script lang="ts">
	import Icon from './Icon.svelte';

	export let cssClass: string;
</script>

<Icon {cssClass}>
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
	/>
</Icon>
