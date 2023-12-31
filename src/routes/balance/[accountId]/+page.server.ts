import { AccountClient } from "$lib/clients/AccountClient"
import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { ExpenseClient } from "$lib/clients/ExpenseClient"

export const load: PageServerLoad = async (event) => {

    const session = await event.locals.getSession()
    if (session == null) {
        throw redirect(303, "/")
    }

    const accountClient = new AccountClient(session.user.id)
    const expenseClient = new ExpenseClient(session.user.id)

    const id = +event.params.accountId

    const account = await accountClient.getById(id)

    if (account == null) {
        throw redirect(303, "/accounts")
    }

    let expenses = await expenseClient.listBelongingTo(account)
    expenses = await expenseClient.addPaymentDatesTo(expenses)
    account.setExpenses(expenses)

    return {
        session: session,
        account: account.serialize()
    }
}