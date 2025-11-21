import { getPool } from "./db";

async function verifyDatabase() {
  console.log("🔍 Database Verification Report\n");
  console.log("=" .repeat(60));

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not set!");
    process.exit(1);
  }

  try {
    const pool = await getPool();

    // Test connection
    console.log("\n📡 Testing database connection...");
    const testResult = await pool.query('SELECT NOW(), version()');
    console.log(`✅ Connected! Server time: ${testResult.rows[0].now}`);
    console.log(`   PostgreSQL version: ${testResult.rows[0].version.split(',')[0]}`);

    // Check all required tables
    console.log("\n📋 Checking tables...");
    const requiredTables = [
      'categories',
      'menu_items', 
      'ingredients',
      'product_variants',
      'orders',
      'order_items',
      'reservations',
      'gallery_images',
      'static_content',
      'admin_users',
      'app_settings',
      'snapshots',
      'snapshot_categories',
      'snapshot_menu_items',
      'snapshot_ingredients',
      'snapshot_gallery_images',
      'snapshot_static_content',
      'published_snapshot',
      'session'
    ];

    let allTablesExist = true;
    const tableStats: { [key: string]: number } = {};

    for (const table of requiredTables) {
      const existsResult = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = $1
        );
      `, [table]);
      
      if (existsResult.rows[0].exists) {
        const countResult = await pool.query(`SELECT COUNT(*) FROM ${table}`);
        const count = parseInt(countResult.rows[0].count);
        tableStats[table] = count;
        console.log(`   ✅ ${table.padEnd(30)} ${count.toString().padStart(6)} records`);
      } else {
        console.log(`   ❌ ${table.padEnd(30)} MISSING`);
        allTablesExist = false;
      }
    }

    if (!allTablesExist) {
      console.log("\n❌ Some tables are missing! Database not fully initialized.");
      process.exit(1);
    }

    // Detailed data validation
    console.log("\n📊 Data Validation...");

    // Check categories
    if (tableStats['categories'] === 0) {
      console.log("   ⚠️  No categories found - database needs seeding");
    } else {
      const categories = await pool.query('SELECT name_de FROM categories ORDER BY "order"');
      console.log(`   ✅ Categories (${tableStats['categories']}): ${categories.rows.map(r => r.name_de).join(', ')}`);
    }

    // Check menu items
    if (tableStats['menu_items'] > 0) {
      const menuStats = await pool.query(`
        SELECT 
          has_size_options,
          is_custom_bowl,
          has_variants,
          COUNT(*) as count
        FROM menu_items 
        GROUP BY has_size_options, is_custom_bowl, has_variants
      `);
      console.log(`   ✅ Menu Items: ${tableStats['menu_items']} total`);
      menuStats.rows.forEach(stat => {
        const features = [];
        if (stat.has_size_options) features.push('size options');
        if (stat.is_custom_bowl) features.push('custom bowl');
        if (stat.has_variants) features.push('variants');
        console.log(`      - ${stat.count} items${features.length ? ' with ' + features.join(', ') : ''}`);
      });
    }

    // Check ingredients by type
    if (tableStats['ingredients'] > 0) {
      const ingredientTypes = await pool.query(`
        SELECT type, COUNT(*) as count 
        FROM ingredients 
        GROUP BY type 
        ORDER BY type
      `);
      console.log(`   ✅ Ingredients: ${tableStats['ingredients']} total`);
      ingredientTypes.rows.forEach(row => {
        console.log(`      - ${row.type.padEnd(15)} ${row.count.toString().padStart(3)} ingredients`);
      });

      // Check for any invalid types
      const invalidTypes = await pool.query(`
        SELECT type, COUNT(*) as count
        FROM ingredients
        WHERE type NOT IN ('protein', 'base', 'marinade', 'fresh', 'sauce', 'topping', 
                          'extra_protein', 'extra_fresh', 'extra_sauce', 'extra_topping')
        GROUP BY type
      `);
      if (invalidTypes.rows.length > 0) {
        console.log("   ⚠️  Invalid ingredient types found:");
        invalidTypes.rows.forEach(row => {
          console.log(`      - ${row.type}: ${row.count} ingredients`);
        });
      }
    }

    // Check admin users
    if (tableStats['admin_users'] === 0) {
      console.log("   ⚠️  No admin users found - run db:create-admin");
    } else {
      const admins = await pool.query('SELECT username FROM admin_users');
      console.log(`   ✅ Admin users: ${admins.rows.map(r => r.username).join(', ')}`);
    }

    // Check product variants
    if (tableStats['product_variants'] > 0) {
      const variants = await pool.query(`
        SELECT mi.name_de, COUNT(pv.id) as variant_count
        FROM menu_items mi
        JOIN product_variants pv ON pv.menu_item_id = mi.id
        GROUP BY mi.name_de
      `);
      console.log(`   ✅ Product variants defined for ${variants.rows.length} products:`);
      variants.rows.forEach(row => {
        console.log(`      - ${row.name_de}: ${row.variant_count} variants`);
      });
    }

    // Check app settings
    if (tableStats['app_settings'] > 0) {
      const settings = await pool.query('SELECT maintenance_mode FROM app_settings WHERE id = 1');
      if (settings.rows.length > 0) {
        const maintenanceMode = settings.rows[0].maintenance_mode;
        console.log(`   ✅ App settings: Maintenance mode ${maintenanceMode ? 'ON' : 'OFF'}`);
      }
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("✨ Database verification complete!");
    
    const criticalTables = ['categories', 'menu_items', 'ingredients', 'admin_users'];
    const allCriticalHaveData = criticalTables.every(t => tableStats[t] > 0);
    
    if (allCriticalHaveData) {
      console.log("✅ All critical tables have data - database is ready!");
    } else {
      console.log("⚠️  Some critical tables are empty - database may need seeding");
      criticalTables.forEach(t => {
        if (tableStats[t] === 0) {
          console.log(`   - ${t} is empty`);
        }
      });
    }

    console.log("=" .repeat(60) + "\n");

  } catch (error: any) {
    console.error("\n❌ Verification failed!");
    console.error("Error:", error.message);
    if (error.stack) {
      console.error("Stack:", error.stack);
    }
    process.exit(1);
  }

  process.exit(0);
}

verifyDatabase();
