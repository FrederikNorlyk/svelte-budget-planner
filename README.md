## Svelte budget planner
Simple budget planning application, built using SvelteKit.

### Technologies
- SvelteKit
- Auth.js (OAuth 2.0)
- Skeleton UI
- Tailwind CSS
- Vitest (Unit tests)

### What can it do?
🛑 This project is still very much a work in progress.
The budget planner allows you to manage your expenses in a simple user interface. The application keeps track of payment dates, which it uses to calculate the required account balances, to avoid overdrawing.

### Installation
I'm hosting the app [here on Vercel](https://vercel.com/). To link the application with your Vercel PostgreSQL database, run the following commands:
[Read more](https://vercel.com/docs/cli)
```
pnpm i -g vercel
vercel link
vercel env pull .env.development.local
```

Auth.js require three environment variables:
```
GITHUB_ID=
GITHUB_SECRET=
AUTH_SECRET=
```
