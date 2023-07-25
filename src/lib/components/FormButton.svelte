<script lang="ts">
	export let type: string;
	export let text: string;

	let cssClass: string;
	if (type == 'primary') {
		cssClass = 'bg-sky-400 hover:bg-sky-500 dark:bg-sky-700 dark:hover:bg-sky-800';
	} else if (type == 'danger') {
		cssClass = 'bg-red-400 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-800';
	} else {
		cssClass = 'bg-green-400';
	}
</script>

<button class="rounded-sm p-2 font-semibold text-white {cssClass}">
	{text}
</button>
