import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

type HandleParams = Parameters<Handle>[0];

async function authorization({ event, resolve }: HandleParams) {
  const session = await event.locals.getSession();
  const isLoggedIn = session;

  if (event.url.pathname.startsWith("/auth") && isLoggedIn) {
    throw redirect(303, "/");
  }

  if (!event.url.pathname.startsWith("/auth") && !isLoggedIn) {
    throw redirect(303, "/auth");
  }

  return resolve(event);
}

export const handle: Handle = sequence(
  SvelteKitAuth({
    providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
    callbacks: {
      async session({ session, token }) {
        return Promise.resolve({ ...session, user: { ...session.user, id: token.sub } })
      }
    }
  }),
  authorization
);