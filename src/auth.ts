import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from "@auth/sveltekit/providers/github"
import Credentials from '@auth/sveltekit/providers/credentials';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [
		GitHub,
		Credentials({
			name: 'a demo user',
			async authorize() {
				return { id: '1', name: 'Jane Doe', email: 'jsmith@example.com', image: '/demouser.jpg' };
			}
		})
	],
	callbacks: {
		async session({ session, token }) {
			return Promise.resolve({ ...session, user: { ...session.user, id: token.sub } });
		}
	}
});
