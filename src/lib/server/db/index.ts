import { env } from '$env/dynamic/private';

if (!env.NEON_DATABASE_URL) throw new Error('NEON_DATABASE_URL is not set');
