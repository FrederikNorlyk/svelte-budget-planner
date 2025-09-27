import { env } from '$env/dynamic/private';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!env.NEON_DATABASE_URL) throw new Error('NEON_DATABASE_URL is not set');

const client = neon(env.NEON_DATABASE_URL);

export const db = drizzle(client, { schema });
