import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "@shared/schema";

// Configure Neon for serverless environments (Vercel)
// Use fetch for HTTP connections instead of WebSocket
if (process.env.VERCEL) {
  neonConfig.fetchConnectionCache = true;
} else {
  // For local development with Replit, use WebSocket
  import('ws').then((ws) => {
    neonConfig.webSocketConstructor = ws.default;
  });
}

let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { pool, db };
