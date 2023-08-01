import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { ExpenseClient } from "$lib/clients/ExpenseClient"
import { AccountClient } from "$lib/clients/AccountClient"

export const load: PageServerLoad = async (event) => {

    const session = await event.locals.getSession()
    
    if (session == null) {
        throw redirect(303, "/")
    }

    const accountClient = new AccountClient(session.user.id)
    const accounts = await accountClient.listAll('name')

    const expenseClient = new ExpenseClient(session.user.id)
    const expenses = await expenseClient.listAllWithPaymentDates()

    accounts.forEach((account) => {
        account.setExpenses(expenses.filter((expense) => expense.getAccountId() === account.getId()))
    })

    return {
        session: session,
        accounts: accounts.map((account) => account.serialize())
    }
}