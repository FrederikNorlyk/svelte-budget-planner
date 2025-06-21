import { form, getRequestEvent } from '$app/server';
import { AccountClient } from '$lib/server/clients/AccountClient';
import { SettingsClient } from '$lib/server/clients/SettingsClient';
import { redirect } from '@sveltejs/kit';

export const save = form(async (data: FormData) => {
	const id = Number(data.get('id'));
	const name = data.get('name') as string;
	const isShared = (data.get('shared') as string) == 'on';

	if (name == null || name.trim().length == 0) {
		return {
			error: 'Name is required'
		};
	}

	const { locals } = getRequestEvent();
	const session = await locals.auth();

	if (!session) {
		redirect(303, '/');
	}

	const client = new AccountClient(session.user.id);

	const userIds = [session.user.id];
	if (isShared) {
		const settingsClient = new SettingsClient(session.user.id);
		const setting = await settingsClient.getForCurrentUser();

		const partnerId = setting.partnerId;
		if (partnerId != null) {
			userIds.push(partnerId);
		}
	}

	if (id == 0) {
		await client.create({ name: name, userId: userIds });
	} else {
		await client.update(id, { name: name, userId: userIds });
	}

	redirect(303, '/accounts');
});
