import { SettingsClient } from '$lib/server/clients/SettingsClient';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	if (!session) {
		redirect(303, '/');
	}

	const settingsClient = new SettingsClient(session.user.id);
	const settings = await settingsClient.getForCurrentUser();

	return {
		session: session,
		settings: settings
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

		const session = await locals.auth();

		if (!session) {
			redirect(303, '/');
		}

		const client = new SettingsClient(session.user.id);
		const settings = await client.getForCurrentUser();

		await client.update(settings.id, { income: income, userId: session.user.id });

		redirect(303, '/settings');
	}
};
