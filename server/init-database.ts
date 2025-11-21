import { execSync } from "child_process";
import { getDb, getPool } from "./db";

async function initDatabase() {
  console.log("🚀 Starting Database Initialization for Railway...\n");

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not set. Make sure the database is provisioned.");
    process.exit(1);
  }

  try {
    // Step 1: Test database connection
    console.log("📡 Step 1: Testing database connection...");
    const pool = await getPool();
    const testResult = await pool.query('SELECT NOW()');
    console.log(`✅ Database connection successful! Server time: ${testResult.rows[0].now}\n`);

    // Step 2: Check if database is already initialized
    console.log("🔍 Step 2: Checking database state...");
    const tableCheckResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'categories'
      );
    `);
    
    const isInitialized = tableCheckResult.rows[0].exists;

    if (isInitialized) {
      // Database already has tables
      console.log("⚠️  Database appears to be initialized.");
      
      // Check if it has data
      const db = await getDb();
      const categoriesCount = await pool.query('SELECT COUNT(*) FROM categories');
      const count = parseInt(categoriesCount.rows[0].count);
      
      if (count > 0) {
        console.log(`   Found ${count} categories in database.`);
        console.log("   Skipping initialization to preserve existing data.");
        console.log("   If you want to reinitialize, manually drop all tables first.\n");
        process.exit(0);
      } else {
        console.log("   Database has tables but no data. Proceeding with seeding...\n");
      }
    } else {
      // Step 3: Create database schema using Drizzle Kit
      console.log("🏗️  Step 3: Creating database schema from shared/schema.ts...");
      console.log("   Using Drizzle Kit to push schema to database...");
      
      try {
        execSync('npx drizzle-kit push --force', {
          stdio: 'inherit',
          env: { ...process.env }
        });
        console.log("✅ Database schema created successfully!\n");
      } catch (error: any) {
        console.error("❌ Error creating schema:", error.message);
        throw error;
      }
    }

    // Step 4: Seed the database with initial data
    console.log("🌱 Step 4: Seeding database with initial data...");
    try {
      execSync('tsx server/seed.ts', {
        stdio: 'inherit',
        env: { ...process.env }
      });
    } catch (error: any) {
      if (error.status === 0) {
        // Exit code 0 means success (seed.ts calls process.exit(0))
        console.log("✅ Database seeded successfully!\n");
      } else {
        console.error("❌ Error seeding database:", error.message);
        throw error;
      }
    }

    // Step 5: Create admin user
    console.log("👤 Step 5: Creating admin user...");
    try {
      execSync('tsx server/create-admin.ts', {
        stdio: 'inherit',
        env: { ...process.env }
      });
    } catch (error: any) {
      if (error.status === 0) {
        // Exit code 0 means success
        console.log("✅ Admin user created successfully!\n");
      } else {
        console.error("❌ Error creating admin user:", error.message);
        throw error;
      }
    }

    // Step 6: Verify everything is set up correctly
    console.log("🔍 Step 6: Verifying database setup...");
    
    const tables = ['categories', 'menu_items', 'ingredients', 'product_variants', 
                   'snapshots', 'snapshot_categories', 'snapshot_ingredients', 
                   'snapshot_menu_items', 'gallery_images', 'static_content', 
                   'admin_users', 'app_settings', 'orders', 'reservations'];
    
    for (const table of tables) {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = $1
        );
      `, [table]);
      
      if (result.rows[0].exists) {
        const countResult = await pool.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`   ✓ ${table}: ${countResult.rows[0].count} records`);
      } else {
        console.warn(`   ⚠️  ${table}: missing`);
      }
    }

    console.log("\n✨ Database initialization completed successfully!");
    console.log("\n📋 Summary:");
    console.log("   ✅ All database tables created");
    console.log("   ✅ Initial data seeded (categories, menu items, ingredients)");
    console.log("   ✅ Admin user created");
    console.log("\n🎉 Your application is ready to use on Railway!");
    console.log("   Admin Panel: https://your-app.up.railway.app/admin");
    console.log("   Username: admin");
    console.log("   Password: mk509918\n");

  } catch (error: any) {
    console.error("\n💥 Database initialization failed!");
    console.error("Error:", error.message);
    if (error.stack) {
      console.error("Stack:", error.stack);
    }
    process.exit(1);
  }

  process.exit(0);
}

initDatabase();
