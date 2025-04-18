## Svelte budget planner TEST

Simple budget planning application, built using SvelteKit.

<img src="screenshot_01.png" alt="Screenshot of the accounts page">

### Tech stack

- SvelteKit
- Auth.js (OAuth 2.0)
- TypeScript
- PostgreSQL
- Skeleton UI
- Tailwind CSS
- Playwright (End-to-end tests)
- Vitest (Unit tests)

### What can it do?

The budget planner allows you to manage your expenses in a simple user interface. The application keeps track of payment dates, which it uses to calculate the required account balances, to avoid overdrawing.

### Try it out 🚀

I'm hosting the app [here on Vercel](https://svelte-budget-planner.vercel.app/). You can sign in using your GitHub account or as a demo user.

### Installation

If you want to run it yourself you can follow these instructions.

To link the application with your Vercel PostgreSQL database, run this command
([Read more](https://vercel.com/docs/cli)):

```bash
npx vercel link
```

Then create an `.env` file by running:

```bash
npx vercel env pull .env
```

### Environment variables

The following environment variables are need.

#### Auth.js

The app is only set up to work with Github so these variables are required.

```
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_SECRET=
```

#### Playwright

Playwright needs to know which site to navigate to, when testing.

```
PLAYWRIGHT_BASE_URL=https://svelte-budget-planner.vercel.app
```

#### Database connection

If you want to prefix your database table names, then you can set:

```
# The expenses table will be "test_expenses" instead of "expenses".
DB_TABLE_PREFIX=test
```

Vercel's PostgreSQL database connection requires:

```
POSTGRES_DATABASE=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_PRISMA_URL=
POSTGRES_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
```
