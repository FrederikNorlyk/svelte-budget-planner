import { AccountClient } from '$lib/clients/AccountClient.js'
import { ExpenseClient } from '$lib/clients/ExpenseClient.js';
import { redirect } from '@sveltejs/kit';

export async function load(event) {

    const session = await event.locals.getSession();
    if (session == null) {
        throw redirect(303, "/");
    }

    const accountClient = new AccountClient(session.user.id)
    const expenseClient = new ExpenseClient(session.user.id)

    const id = +event.params.accountId

    const account = await accountClient.getById(id)

    if (account == null) {
        throw redirect(303, "/accounts")
    }

    const expenses = await expenseClient.listBelongingTo(account)

    return {
        session: session,
        account: account.serialize(),
        expenses: expenses.map((e) => e.serialize())
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

        if (id == 0) {
            client.create(name)
        } else {
            client.update(id, name)
        }

        return {
            name: name
        }
    },

    delete: async ({ params, locals }) => {
        const session = await locals.getSession()

        if (session == null) {
            throw redirect(303, "/")
        }

        const client = new AccountClient(session.user.id)
        const id = +params.accountId
        const result = await client.delete(id);

        if (result.getError() != null) {
            return {
                error: result.getError()
            }
        }

        throw redirect(303, "/accounts")
    }
}