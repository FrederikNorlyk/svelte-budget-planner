import { derived, writable } from 'svelte/store';
import translations from './translations';

// Define the shape of the replacement variables object
export interface Vars {
	[key: string]: string;
}

export const locale = writable('en');
export const locales = Object.keys(translations);

/**
 * Translate a localization key.
 * To use replacement variables, match them with the named variable in the translation text.
 * For example: if the translated text is "Hi {{name}}", then vars should be { name: 'Mark' }
 *
 * @param {*} locale the locale to translate to, i.e. 'en' or 'da'
 * @param {*} key the key to translate
 * @param {*} vars any variables to replace in the translation
 * @returns localized string
 */
function translate(locale: string, key: string, vars: Vars): string {
	const translated = translations[locale];

	if (!translated) {
		return key;
	}

	let text = translated[key];

	if (!text) {
		return key;
	}

	Object.keys(vars).map((key) => {
		const value = vars[key];
		const regex = new RegExp(`{{${key}}}`, 'g');
		text = text.replace(regex, value);
	});

	return text;
}

export const i18n = derived(
	locale,
	($locale: string) =>
		(key: string, vars: Vars = {}): string =>
			translate($locale, key, vars)
);
