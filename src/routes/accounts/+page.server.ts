import { AccountClient } from "$lib/clients/AccountClient"
import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async (event) => {

    const session = await event.locals.getSession()
    
    if (session == null) {
        throw redirect(303, "/")
    }

    const accountClient = new AccountClient(session.user.id)
    const accounts = await accountClient.listAll()
    
    return {
        session: session,
        accounts: accounts.map((a) => a.serialize()),
        totalAmounts: await accountClient.getTotalAmounts()
    }
}