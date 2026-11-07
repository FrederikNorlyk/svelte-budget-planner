import '#lib/i18n/index.ts'; // Import to initialize. Important :)
import { browser } from '$app/env';
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	if (browser) {
		void locale.set(globalThis.navigator.language);
	}
	await waitLocale();
};
