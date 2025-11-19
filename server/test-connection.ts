import { getPool, getDb } from './db';

async function testConnection() {
  console.log('🧪 Testing database connection...');
  console.log('📍 Environment:', process.env.NODE_ENV);
  console.log('🚂 Railway Environment:', process.env.RAILWAY_ENVIRONMENT || 'Not detected');
  
  try {
    // Test pool connection
    const pool = await getPool();
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    
    console.log('✅ Connection successful!');
    console.log('⏰ Server time:', result.rows[0].current_time);
    console.log('🐘 PostgreSQL version:', result.rows[0].pg_version);
    
    // Test Drizzle ORM
    const db = await getDb();
    console.log('✅ Drizzle ORM initialized successfully');
    
    // Close connection
    await pool.end();
    console.log('✅ Connection closed gracefully');
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Connection test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testConnection();
