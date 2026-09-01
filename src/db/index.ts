import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';

// For Next.js, we need to ensure the database file is placed correctly.
// local.db will be in the root of the project.
const sqlite = new Database(path.join(process.cwd(), 'local.db'));
export const db = drizzle(sqlite, { schema });
