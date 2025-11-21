import { getPool } from "./db";

async function resetDatabase() {
  const pool = await getPool();
  
  console.log("🗑️  Dropping all tables...");
  await pool.query(`
    DROP TABLE IF EXISTS product_variants, order_items, orders, ingredients, 
    menu_items, categories, snapshots, snapshot_ingredients, app_settings CASCADE
  `);
  
  console.log("✅ All tables dropped successfully");
  process.exit(0);
}

resetDatabase();
