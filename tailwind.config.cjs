// @ts-check
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', '../**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [forms]
};
