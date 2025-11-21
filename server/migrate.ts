import { getDb, getPool } from "./db";

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not set. Make sure the database is provisioned.");
    process.exit(1);
  }

  try {
    console.log("🔄 Running database migrations...\n");

    const db = await getDb();
    const pool = await getPool();

    // Helper to get column definition
    const getColumnInfo = async (table: string, column: string) => {
      const result = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default, numeric_precision, numeric_scale
        FROM information_schema.columns 
        WHERE table_name = $1 AND column_name = $2
      `, [table, column]);
      return result.rows[0];
    };

    // Helper to safely add column if it doesn't exist
    const ensureColumn = async (
      table: string,
      column: string,
      definition: string,
      description: string
    ) => {
      const existing = await getColumnInfo(table, column);
      
      if (!existing) {
        console.log(`  ➕ Adding ${column}: ${description}`);
        await pool.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
        console.log(`     ✓ Successfully added ${column}`);
      } else {
        console.log(`  ✓ ${column} exists`);
      }
    };

    // Menu Items migrations
    console.log("📝 Migrating menu_items table...");
    
    await ensureColumn(
      'menu_items',
      'price_small',
      'NUMERIC(10,2)',
      'Klein price for size options'
    );

    await ensureColumn(
      'menu_items',
      'enable_base_selection',
      'INTEGER NOT NULL DEFAULT 0',
      'Enable base selection before cart'
    );

    await ensureColumn(
      'menu_items',
      'has_variants',
      'INTEGER NOT NULL DEFAULT 0',
      'Has variants (base/flavor selection)'
    );

    await ensureColumn(
      'menu_items',
      'variant_type',
      'TEXT',
      'Type of variant: base or flavor'
    );

    await ensureColumn(
      'menu_items',
      'requires_variant_selection',
      'INTEGER NOT NULL DEFAULT 0',
      'Must select variant before adding to cart'
    );

    // Ingredients migrations
    console.log("\n📝 Migrating ingredients table...");
    
    await ensureColumn(
      'ingredients',
      'price_small',
      'NUMERIC(10,2)',
      'Price for Klein bowl size'
    );

    await ensureColumn(
      'ingredients',
      'price_standard',
      'NUMERIC(10,2)',
      'Price for Standard bowl size'
    );

    // Ensure product_variants table exists
    console.log("\n📝 Ensuring product_variants table exists...");
    const pvTableResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'product_variants'
      );
    `);
    
    if (!pvTableResult.rows[0].exists) {
      console.log("  ➕ Creating product_variants table");
      await pool.query(`
        CREATE TABLE product_variants (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          menu_item_id VARCHAR NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          name_de TEXT NOT NULL,
          type TEXT NOT NULL,
          "order" INTEGER NOT NULL DEFAULT 0,
          available INTEGER NOT NULL DEFAULT 1
        )
      `);
      console.log("     ✓ Successfully created product_variants table");
    } else {
      console.log("  ✓ product_variants table exists");
    }

    // Ensure app_settings table exists
    console.log("\n📝 Ensuring app_settings table exists...");
    const tableCheckResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'app_settings'
      );
    `);
    
    if (!tableCheckResult.rows[0].exists) {
      console.log("  ➕ Creating app_settings table");
      await pool.query(`
        CREATE TABLE app_settings (
          id INTEGER PRIMARY KEY DEFAULT 1,
          maintenance_mode INTEGER NOT NULL DEFAULT 0,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await pool.query(`INSERT INTO app_settings (id, maintenance_mode) VALUES (1, 0)`);
      console.log("     ✓ Successfully created app_settings table");
    } else {
      console.log("  ✓ app_settings table exists");
    }

    // Ensure snapshot_ingredients table exists
    console.log("\n📝 Ensuring snapshot_ingredients table exists...");
    const siTableResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'snapshot_ingredients'
      );
    `);
    
    if (!siTableResult.rows[0].exists) {
      console.log("  ➕ Creating snapshot_ingredients table");
      await pool.query(`
        CREATE TABLE snapshot_ingredients (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          snapshot_id VARCHAR NOT NULL REFERENCES snapshots(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          name_de TEXT NOT NULL,
          ingredient_type TEXT NOT NULL,
          description TEXT,
          description_de TEXT,
          image TEXT,
          price NUMERIC(10,2),
          price_small NUMERIC(10,2),
          price_standard NUMERIC(10,2),
          available INTEGER NOT NULL DEFAULT 1,
          original_ingredient_id VARCHAR NOT NULL
        )
      `);
      console.log("     ✓ Successfully created snapshot_ingredients table");
    } else {
      console.log("  ✓ snapshot_ingredients table exists");
    }

    // Verify all critical columns exist
    console.log("\n🔍 Verifying schema...");
    const criticalColumns = [
      { table: 'menu_items', column: 'price_small' },
      { table: 'menu_items', column: 'enable_base_selection' },
      { table: 'menu_items', column: 'has_variants' },
      { table: 'menu_items', column: 'variant_type' },
      { table: 'menu_items', column: 'requires_variant_selection' },
      { table: 'ingredients', column: 'price_small' },
      { table: 'ingredients', column: 'price_standard' },
    ];

    let allColumnsExist = true;
    for (const { table, column } of criticalColumns) {
      const exists = await getColumnInfo(table, column);
      if (!exists) {
        console.error(`  ❌ Missing column: ${table}.${column}`);
        allColumnsExist = false;
      } else {
        console.log(`  ✓ ${table}.${column}`);
      }
    }

    if (!allColumnsExist) {
      console.error("\n❌ Schema verification failed - some columns are still missing!");
      process.exit(1);
    }

    console.log("\n✅ All migrations completed successfully!");
    console.log("✅ Schema verification passed!");
    
  } catch (error: any) {
    console.error("❌ Error running migrations:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }

  process.exit(0);
}

runMigrations();
