import { ExpenseClient } from '$lib/clients/ExpenseClient'
import { PaymentDateClient } from '$lib/clients/PaymentDateClient.js';
import { Expense } from '$lib/models/Expense.js';
import { PaymentDate } from '$lib/models/PaymentDate.js';
import { redirect } from '@sveltejs/kit';

export async function load(event) {

    const session = await event.locals.getSession();
    if (session == null) {
        throw redirect(303, "/");
    }

    const expenseClient = new ExpenseClient(session.user.id)
    const id = +event.params.expenseId

    let expense
    if (id == 0) {
        expense = null
    } else {
        expense = await expenseClient.getById(id)

        if (expense == null) {
            throw redirect(303, "/accounts/" + event.params.accountId)
        }
    }

    const paymentDateClient = new PaymentDateClient(session.user.id)
    let paymentDates: PaymentDate[] = []
    if (expense != null) {
        paymentDates = await paymentDateClient.listAllBelongingTo(expense);
    }

    return {
        session: session,
        expense: expense?.serialize(),
        tags: await expenseClient.listAllTags(),
        paymentDates: paymentDates.map((d) => d.serialize())
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
        const daysOfMonth = data.getAll('dayOfMonth')
        const months = data.getAll('month')

        if (name == null || amount == 0 || frequency < 1 || frequency > 12 || tag == null || daysOfMonth.length == 0 
            || months.length == 0) {

            return { error: 'Invalid data' }
        }

        const id = +params.expenseId
        const accountId = +params.accountId

        const session = await locals.getSession()

        if (session == null) {
            throw redirect(303, "/")
        }

        const expenseClient = new ExpenseClient(session.user.id)
        const expense = new Expense(id, name, amount, frequency, tag, accountId, isEnabled)

        let newExpense
        if (id == 0) {
            newExpense = await expenseClient.create(expense)
        } else {
            newExpense = await expenseClient.update(expense)
        }
        
        if (newExpense == null) {
            return { error: 'Could not create expense'}
        }

        const paymentDateClient = new PaymentDateClient(session.user.id)
        paymentDateClient.deleteAllBelongingTo(expense)

        for (let i = 0; i < daysOfMonth.length; i++) {
            const dayOfMonth = +daysOfMonth[i];
            const month = +months[i];

            const paymentDate = new PaymentDate(0, newExpense.getId(), dayOfMonth, month)
            paymentDateClient.create(paymentDate)
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