import { ExpenseClient } from '$lib/clients/ExpenseClient'
import { Expense } from '$lib/models/Expense.js';
import { redirect } from '@sveltejs/kit';

export async function load(event) {

    const session = await event.locals.getSession();
    if (session == null) {
        throw redirect(303, "/");
    }

    const client = new ExpenseClient(session.user.id)
    const id = +event.params.expenseId

    let expense
    if (id == 0) {
        expense = null
    } else {
        expense = await client.getById(id)

        if (expense == null) {
            throw redirect(303, "/accounts/" + event.params.accountId)
        }
    }

    return {
        session: session,
        expense: expense?.serialize(),
    }
}

export const actions = {
    save: async ({ request, params, locals }) => {
        const data = await request.formData()
        const name = data.get('name')?.toString()
        const amount = +(data.get('amount')?.toString() || '')
        const frequency = +(data.get('frequency')?.toString() || '')
        const tag = data.get('tag')?.toString()
        const isEnabled = !!data.get('isEnabled')
        
        if (name == null || amount == 0 || frequency < 1 || frequency > 12 || tag == null) {
            return { error: 'Invalid data' }
        }
        
        const id = +params.expenseId
        const accountId = +params.accountId

        const session = await locals.getSession()

        if (session == null) {
            throw redirect(303, "/")
        }

        const client = new ExpenseClient(session.user.id)
        const expense = new Expense(id, name, amount, frequency, tag, accountId, isEnabled)

        if (id == 0) {
            client.create(expense)
        } else {
            client.update(expense)
        }

        throw redirect(303, "/accounts/" + params.accountId)
    },

    delete: async ({ params, locals }) => {
        const session = await locals.getSession()

        if (session == null) {
            throw redirect(303, "/")
        }

        const client = new ExpenseClient(session.user.id)
        const id = +params.expenseId
        const result = await client.delete(id);

        if (result.getError() != null) {
            return {
                error: result.getError()
            }
        }

        throw redirect(303, "/accounts/" + params.accountId)
    }
}