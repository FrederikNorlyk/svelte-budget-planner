import { AccountClient } from '$lib/clients/AccountClient.js'
import { redirect } from '@sveltejs/kit'

export async function load(event) {

    const session = await event.locals.getSession();
    if (session == null) {
        throw redirect(303, "/")
    }

    const accountClient = new AccountClient(session.user.id)

    const id = +event.params.accountId

    let account = null
    if (id != 0) {
        account = await accountClient.getById(id)
    }

    return {
        session: session,
        account: account?.serialize(),
    }
}

export const actions = {
    save: async ({ request, params, locals }) => {
        
        const data = await request.formData()
        const name = data.get('name')?.toString()

        if (name == null || name.trim().length == 0) {
            return {
                error: 'Name is required'
            }
        }

        const session = await locals.getSession()

        if (session == null) {
            throw redirect(303, "/")
        }

        const id = +params.accountId
        const client = new AccountClient(session.user.id)

        let account
        if (id == 0) {
            account = await client.create(name)
        } else {
            account = await client.update(id, name)
        }

        if (account == null) {
            return { error: 'Could not create account'}
        }

        throw redirect(303, "/accounts")
    },

    delete: async ({ params, locals }) => {
        const session = await locals.getSession()

        if (session == null) {
            throw redirect(303, "/")
        }

        const client = new AccountClient(session.user.id)
        const id = +params.accountId
        const result = await client.delete(id)

        if (result.getError() != null) {
            return {
                error: result.getError()
            }
        }

        throw redirect(303, "/accounts")
    }
}