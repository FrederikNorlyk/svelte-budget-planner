import { AccountClient } from '$lib/server/clients/AccountClient';
import { SettingsClient } from '$lib/server/clients/SettingsClient';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	if (!session) {
		redirect(303, '/');
	}

	const accountClient = new AccountClient(session.user.id);
	const settingsClient = new SettingsClient(session.user.id);

	return {
		session: session,
		accounts: await accountClient.listAllExpanded(),
		settings: await settingsClient.getForCurrentUser()
	};
};
