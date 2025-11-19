import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const { Pool } = pg;

let pool: InstanceType<typeof Pool> | null = null;
let db: ReturnType<typeof drizzle> | null = null;

async function createPool(): Promise<InstanceType<typeof Pool>> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const connectionString = process.env.DATABASE_URL;
  const isProduction = process.env.NODE_ENV === "production";
  
  // Log connection attempt (hide credentials)
  const sanitizedUrl = connectionString.replace(/:([^:@]+)@/, ':****@');
  console.log(`🔌 Attempting database connection to: ${sanitizedUrl}`);
  
  // Railway-optimized connection pool configuration
  const poolConfig = {
    connectionString,
    // Railway requires SSL in production
    ssl: isProduction ? { rejectUnauthorized: false } : undefined,
    // Connection pool settings optimized for Railway
    max: 20, // Maximum pool size
    min: 2,  // Minimum pool size
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, // 10s timeout for initial connection
    // Support both IPv4 and IPv6
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
  };

  const newPool = new Pool(poolConfig);

  // Test the connection with retry logic
  const maxRetries = 5;
  const baseDelay = 2000; // 2 seconds

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Connection attempt ${attempt}/${maxRetries}...`);
      
      const client = await newPool.connect();
      await client.query('SELECT NOW()');
      client.release();
      
      console.log('✅ Database connection successful!');
      return newPool;
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries;
      
      // Log detailed error information
      console.error(`❌ Connection attempt ${attempt} failed:`, {
        code: error.code,
        message: error.message,
        errno: error.errno,
        syscall: error.syscall,
        hostname: error.hostname,
        address: error.address,
        port: error.port,
      });

      if (isLastAttempt) {
        console.error('💥 All connection attempts failed. Please check:');
        console.error('1. DATABASE_URL is correctly set in Railway variables');
        console.error('2. Postgres service is deployed and running');
        console.error('3. Both services are in the same Railway project');
        console.error('4. If using Alpine image, set ENABLE_ALPINE_PRIVATE_NETWORKING=true');
        
        // Clean up the failed pool
        await newPool.end().catch(() => {});
        throw new Error(`Failed to connect to database after ${maxRetries} attempts: ${error.message}`);
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      console.log(`⏳ Waiting ${Math.round(delay)}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Unexpected error in connection retry loop');
}

async function initializeDatabase() {
  if (!pool) {
    // Railway's private network needs time to initialize
    // Add a small delay on first connection attempt in production
    if (process.env.NODE_ENV === "production" && process.env.RAILWAY_ENVIRONMENT) {
      console.log('🚂 Railway environment detected, waiting for private network initialization...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    pool = await createPool();
    db = drizzle(pool, { schema });
    
    // Set up graceful shutdown
    const cleanup = async () => {
      console.log('🛑 Closing database connection pool...');
      if (pool) {
        await pool.end();
        console.log('✅ Database connection pool closed');
      }
    };

    process.on('SIGTERM', cleanup);
    process.on('SIGINT', cleanup);
  }
  
  return { pool, db };
}

// Lazy initialization - connection only happens when first accessed
async function getDb() {
  if (!db) {
    await initializeDatabase();
  }
  return db!;
}

async function getPool() {
  if (!pool) {
    await initializeDatabase();
  }
  return pool!;
}

export { getPool, getDb, pool, db };
