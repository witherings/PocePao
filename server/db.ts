import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  const useSSL = !process.env.DATABASE_URL.includes('localhost');
  
  pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: useSSL ? { rejectUnauthorized: false } : undefined
  });
  
  db = drizzle(pool, { schema });
}

export { pool, db };
