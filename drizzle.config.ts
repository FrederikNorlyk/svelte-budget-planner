import { defineConfig } from 'drizzle-kit';

if (!process.env.NEON_DATABASE_URL) throw new Error('NEON_DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: { url: process.env.NEON_DATABASE_URL },
	verbose: true,
	strict: true
});
