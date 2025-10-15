import { command, form, getRequestEvent } from '$app/server';
import { AccountClient } from '$lib/server/clients/AccountClient';
import { SettingsClient } from '$lib/server/clients/SettingsClient';
import { redirect } from '@sveltejs/kit';
import * as v from 'valibot';

export const upsertAccount = form(
	v.object({
		name: v.string(),
		isShared: v.optional(v.boolean(), false)
	}),
	async ({ name, isShared }) => {
		const { locals, params } = getRequestEvent();
		const session = await locals.auth();

		if (!session) {
			redirect(303, '/');
		}

		const id = params.accountId ? +params.accountId : undefined;

		if (Number.isNaN(id)) {
			throw new Error('Invalid id: ' + id);
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

		if (id) {
			await client.update(id, { name: name, userIds: userIds });
		} else {
			await client.create({ name: name, userIds: userIds });
		}

		redirect(303, '/accounts');
	}
);

export const deleteAccount = command(v.number(), async (id) => {
	const { locals } = getRequestEvent();
	const session = await locals.auth();

	if (!session) {
		throw new Error('User not authorized');
	}

	const client = new AccountClient(session.user.id);
	const result = await client.delete(id);

	if (result.getError() != null) {
		return {
			error: result.getError()
		};
	}

	return {
		success: true
	};
});
