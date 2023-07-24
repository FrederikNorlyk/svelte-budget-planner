import { AccountClient } from "$lib/clients/AccountClient"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async (event) => {

    const session = await event.locals.getSession()
    const accountClient = session != null ? new AccountClient(session.user.id) : null
    const accounts = await accountClient?.listAll() ?? []
    
    return {
        session: session,
        accounts: accounts.map((a) => a.serialize())
    }
}