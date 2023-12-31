// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}

		interface Session {
			user: {
				id: number,
				name: string,
				email: string,
				image: string,
				income: number
			}
		}
	}
}

export {};