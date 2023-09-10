import { AccountClient } from "$lib/clients/AccountClient"
import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { SettingsClient } from "$lib/clients/SettingsClient"

export const load: PageServerLoad = async (event) => {

    const session = await event.locals.getSession()
    
    if (session == null) {
        throw redirect(303, "/")
    }

    const accountClient = new AccountClient(session.user.id)
    const accounts = await accountClient.listAllExpanded('name')
    
    const settingsClient = new SettingsClient(session.user.id)
    const settings = await settingsClient.getForCurrentUser()

    return {
        session: session,
        accounts: accounts.map((a) => a.serialize()),
        settings: settings.serialize()
    }
}