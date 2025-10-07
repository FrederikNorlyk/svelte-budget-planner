import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'en';

register('en', () => import('./locales/en.json'));
register('da', () => import('./locales/da.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? globalThis.navigator.language : defaultLocale
});
