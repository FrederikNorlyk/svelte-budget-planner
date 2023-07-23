## Svelte budget planner
Simple budget planning application, built using SvelteKit.

### Technologies
- SvelteKit
- Auth.Js (OAuth 2.0)
- Tailwind CSS

### What can it do?
🛑 This project is stil very much a work in progress.

### Installation
Next.js require three environment variables:
```
GITHUB_ID=
GITHUB_SECRET=
AUTH_SECRET=
```

I'm hosting the app on [Vercel](https://vercel.com/). To link the application with you Vercel PostgreSQL database, run the follwing commands:
[Read more](https://vercel.com/docs/cli)
```
pnpm i -g vercel
vercel link
vercel env pull .env.development.local
```
