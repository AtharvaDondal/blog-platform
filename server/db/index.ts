import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Use native PostgreSQL connection (not HTTP)
const client = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  max: 10,
});

export const db = drizzle(client, { schema });