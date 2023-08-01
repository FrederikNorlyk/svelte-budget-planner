import { derived, writable } from 'svelte/store';
import translations from './translations';

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
function translate(locale, key, vars) {
	let text = translations[locale][key];

	if (!text) {
		return key;
	}

	Object.keys(vars).map((k) => {
		const regex = new RegExp(`{{${k}}}`, 'g');
		text = text.replace(regex, vars[k]);
	});

	return text;
}

export const i18n = derived(
	locale,
	($locale) =>
		(key, vars = {}) =>
			translate($locale, key, vars)
);
