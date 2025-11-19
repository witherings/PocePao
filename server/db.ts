import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const { Pool } = pg;

let pool: InstanceType<typeof Pool> | null = null;
let db: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  // Railway requires SSL for production PostgreSQL connections
  pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" 
      ? { rejectUnauthorized: false } 
      : undefined
  });
  
  db = drizzle(pool, { schema });
}

export { pool, db };
