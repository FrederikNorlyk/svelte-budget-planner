import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SettingsClient } from '$lib/clients/SettingsClient';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();

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

		if (income < 0) {
			return {
				error: 'user.income.required'
			};
		}

		const session = await locals.getSession();

		if (session == null) {
			redirect(303, '/');
		}

		const client = new SettingsClient(session.user.id);

		const settings = await client.getForCurrentUser();
		settings.setIncome(income);
		await client.update(settings);

		redirect(303, '/settings');
	}
};
