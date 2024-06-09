import { SettingsClient } from '$lib/clients/SettingsClient';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	if (session == null) {
		redirect(303, '/');
	}

	const settingsClient = new SettingsClient(session.user.id);
	const settings = await settingsClient.getForCurrentUser();

	return {
		session: session,
		settings: settings.serialize()
	};
};

export const actions = {
	save: async ({ request, locals }) => {
		const data = await request.formData();
		const income = +(data.get('income') ?? 0);
		const locale = data.get('locale');

		if (income < 0) {
			return {
				error: 'user.income.required'
			};
		}

		if (locale != 'en' && locale != 'da') {
			return {
				error: 'user.locale.required'
			};
		}

		const session = await locals.auth();

		if (session == null) {
			redirect(303, '/');
		}

		const client = new SettingsClient(session.user.id);
		const settings = await client.getForCurrentUser();

		await client.update(settings.id, { income: income, locale: locale });

		redirect(303, '/settings');
	}
};
