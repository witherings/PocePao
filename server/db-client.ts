import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { Pool as PgPool } from 'pg';
import * as schema from "@shared/schema";
import ws from 'ws';

type QueryResult = {
  rows: any[];
  rowCount?: number | null;
};

type PoolFacade = {
  query: (text: string, params?: any[]) => Promise<QueryResult>;
  end: () => Promise<void>;
};

type DbClient = {
  pool: PoolFacade;
  rawPool: NeonPool | PgPool;
  db: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzlePg>;
  isNeon: boolean;
};

export function createDatabaseClient(connectionString: string): DbClient {
  // Parse hostname to detect Neon databases correctly
  // Only treat as Neon if the hostname ends with .neon.tech or DATABASE_CLIENT is explicitly set
  let isNeonDatabase = process.env.DATABASE_CLIENT === 'neon';
  
  if (!isNeonDatabase) {
    try {
      const url = new URL(connectionString);
      isNeonDatabase = url.hostname.endsWith('.neon.tech') || url.hostname === 'neon.tech';
    } catch {
      // If URL parsing fails, default to pg driver for safety
      isNeonDatabase = false;
    }
  }
  
  if (isNeonDatabase) {
    if (process.env.VERCEL) {
      neonConfig.fetchConnectionCache = true;
    } else if (process.env.REPL_ID) {
      neonConfig.webSocketConstructor = ws;
    }
    
    const rawPool = new NeonPool({ connectionString });
    const db = drizzleNeon({ client: rawPool, schema });
    
    const pool: PoolFacade = {
      query: async (text: string, params?: any[]) => {
        const result: any = params 
          ? await rawPool.query(text, params)
          : await rawPool.query(text);
        return result;
      },
      end: async () => {
        // Neon Pool uses close() method to close WebSocket connections
        if (typeof (rawPool as any).close === 'function') {
          await (rawPool as any).close();
        } else if (typeof (rawPool as any).cleanup === 'function') {
          await (rawPool as any).cleanup();
        }
      }
    };
    
    return { pool, rawPool, db, isNeon: true };
  } else {
    const rawPool = new PgPool({ connectionString });
    const db = drizzlePg({ client: rawPool, schema });
    
    const pool: PoolFacade = {
      query: async (text: string, params?: any[]) => {
        return params
          ? await rawPool.query(text, params)
          : await rawPool.query(text);
      },
      end: async () => {
        await rawPool.end();
      }
    };
    
    return { pool, rawPool, db, isNeon: false };
  }
}
