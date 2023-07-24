import { AccountClient } from '$lib/clients/AccountClient.js'
import { redirect } from '@sveltejs/kit';

export async function load(event) {

    const session = await event.locals.getSession();
    if (session == null) {
        throw redirect(303, "/");
    }

    const client = new AccountClient(session.user.id)
    const id = new Number(event.params.id)

    let account
    if (id == 0) {
        account = null
    } else {
        account = await client.getById(id.valueOf())
        
        if (account == null) {
            throw redirect(303, "/")
        }
    }

    return {
        session: session,
        account: account?.serialize()
    }
}

export const actions = {
    default: async ({ request, params, locals }) => {
        const data = await request.formData()
        const id = new Number(params.id)
        const name = new String(data.get('name'))
        
        if (name == null) {
            return { success: false }
        }

        const session = await locals.getSession()

        if (session == null) {
            return { success: false }
        }

        const client = new AccountClient(session.user.id)
        if (id == 0) {
            client.create(name.valueOf())
        } else {
            client.update(id.valueOf(), name.valueOf())
        }

        return { success: true }
    }
}