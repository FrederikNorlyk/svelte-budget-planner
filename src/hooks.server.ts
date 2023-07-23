import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import type { Account, Profile, Session } from "@auth/core/types";
import type { JWT } from "@auth/core/jwt";
import type { AdapterUser } from "@auth/core/adapters";

type HandleParams = Parameters<Handle>[0];

async function authorization({ event, resolve }: HandleParams) {
  const session = await event.locals.getSession();
  const isLoggedIn = session;

  // Protect any routes under /authenticated
  if (event.url.pathname.startsWith("/auth") && isLoggedIn) {
    throw redirect(303, "/");
  }

  if (!event.url.pathname.startsWith("/auth") && !isLoggedIn) {
    throw redirect(303, "/auth");
  }

  // If the request is still here, just proceed as normally
  return resolve(event);
}

// First handle authentication, then authorization
// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
export const handle: Handle = sequence(
  SvelteKitAuth({
    providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
    callbacks: {
      async session({session, token}) {
        return Promise.resolve({ ...session, user: { ...session.user, id: token.sub } })
      }
    }
  }),
  authorization
);