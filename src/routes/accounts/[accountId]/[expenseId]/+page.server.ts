import { ExpenseClient } from '$lib/clients/ExpenseClient'
import { PaymentDateClient } from '$lib/clients/PaymentDateClient.js';
import { SettingsClient } from '$lib/clients/SettingsClient';
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

        const data = await request.formData();
        const name = data.get('name')?.toString();
        const amount = +(data.get('amount')?.toString() || '');
        const tag = data.get('tag')?.toString();
        const isEnabled = !!data.get('isEnabled');
        const isShared = data.get('isShared') == 'true';
        const daysOfMonth = data.getAll('dayOfMonth');
        const months = data.getAll('month');

        if (name == null || amount == 0 || isNaN(amount)) {
            return { error: 'Invalid data' };
        }

        if (months.length > 12) {
            return { error: 'expense.error.maxMonths' };
        }

        if ((new Set(months)).size !== months.length) {
            return { error: 'expense.error.duplicateMonths' };
        }

        if (daysOfMonth.length != months.length) {
            return { error: 'Invalid payment date information' };
        }

        const id = +params.expenseId;
        const accountId = +params.accountId;

        const session = await locals.getSession();

        if (session == null) {
            throw redirect(303, "/");
        }

        const userIds = [session.user.id];
        if (isShared) {
            const settingsClient = new SettingsClient(session.user.id);
            const setting = await settingsClient.getForCurrentUser();

            const partnerId = setting.getPartnerId();
            if (partnerId != null) {
                userIds.push(partnerId);
            }
        }

        const expense = new Expense(id, name, amount, tag, accountId, isEnabled, isShared, userIds);

        const expenseClient = new ExpenseClient(session.user.id);

        let newExpense;
        if (id == 0) {
            newExpense = await expenseClient.create(expense);
        } else {
            newExpense = await expenseClient.update(expense);
        }

        if (newExpense == null) {
            return { error: 'Could save the expense' };
        }

        const paymentDateClient = new PaymentDateClient(session.user.id);
        await paymentDateClient.deleteAllBelongingTo(expense);

        for (let i = 0; i < daysOfMonth.length; i++) {
            const dayOfMonth = +daysOfMonth[i];
            const month = +months[i];

            const paymentDate = new PaymentDate(0, newExpense.getId(), month, dayOfMonth);
            const createdPaymentDate = await paymentDateClient.create(paymentDate);

            if (createdPaymentDate == null) {
                return { error: 'Could not create payment date' };
            }
        }

        throw redirect(303, "/accounts/" + params.accountId);
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