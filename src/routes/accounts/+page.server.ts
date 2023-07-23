import { AccountClient } from "$lib/clients/AccountClient"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async (event) => {

    const session = await event.locals.getSession();
    const accountClient = session != null ? new AccountClient(session.user.id) : null

    return {
        session: session,
        accounts: accountClient?.listAll() ?? []
    }
}

export const actions = {
    default: async ({ request, locals }) => {
        const data = await request.formData();
        const name = new String(data.get('name'));
        
        if (name == null) {
            return { success: false }
        }

        const session = await locals.getSession()

        if (session == null) {
            return { success: false }
        }

        const client = new AccountClient(session.user.id);
        client.create(name.valueOf());

        return { success: true };
    }
};