import { createDatabaseClient } from "./db-client";

/**
 * Simple script to test database connection
 * Run with: tsx server/test-db-connection.ts
 */

async function testConnection() {
  console.log("\n🔍 Testing database connection...\n");
  
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is not set!");
    console.error("   Please set DATABASE_URL in Render dashboard");
    process.exit(1);
  }

  console.log("✅ DATABASE_URL is set");
  console.log(`   URL: ${process.env.DATABASE_URL.substring(0, 30)}...`);
  
  const client = createDatabaseClient(process.env.DATABASE_URL);
  const { pool, isNeon } = client;
  
  if (isNeon) {
    console.log("📡 Using Neon serverless driver (WebSocket/HTTPS)");
  } else {
    console.log("📡 Using standard PostgreSQL driver (TCP)");
  }

  try {
    console.log("\n🔌 Attempting to connect and query...");
    
    console.log("\n📊 Testing query...");
    const result = await pool.query("SELECT NOW() as current_time, version() as pg_version");
    console.log("✅ Successfully connected to database!");
    console.log(`   Current time: ${result.rows[0].current_time}`);
    console.log(`   PostgreSQL: ${result.rows[0].pg_version.split(',')[0]}`);
    
    console.log("\n🔍 Checking if tables exist...");
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log("⚠️  No tables found in database!");
      console.log("   Run 'npm run db:push' to create tables");
    } else {
      console.log(`✅ Found ${tablesResult.rows.length} tables:`);
      tablesResult.rows.forEach((row: any) => {
        console.log(`   - ${row.table_name}`);
      });
    }
    
    console.log("\n✨ Database connection test complete!\n");
    
  } catch (error) {
    console.error("\n❌ Database connection test failed:");
    console.error(error);
    console.error("\nPossible issues:");
    console.error("  1. DATABASE_URL is incorrect");
    console.error("  2. Database server is not accessible");
    console.error("  3. Tables haven't been created yet (run 'npm run build')");
    console.error("  4. Database connection issue\n");
    process.exit(1);
  } finally {
    await pool.end();
  }

  process.exit(0);
}

testConnection();
