import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "@shared/schema";
import { categories as seedCategories, createMenuItems } from "./data/menu";
import { createIngredients } from "./data/ingredients";
import { 
  categories as categoriesTable,
  menuItems as menuItemsTable,
  ingredients as ingredientsTable
} from "@shared/schema";
import ws from 'ws';

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not set. Make sure the database is provisioned.");
    process.exit(1);
  }

  // Configure WebSocket for Neon
  neonConfig.webSocketConstructor = ws;

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool, schema });

  try {
    console.log("🌱 Starting database seeding...\n");

    // Check if data already exists (production safety)
    const existingCategories = await db.select().from(categoriesTable);
    if (existingCategories.length > 0) {
      console.log("⚠️  Database already has data. Skipping seed to preserve existing data.");
      console.log(`   Found ${existingCategories.length} categories.`);
      console.log("\n💡 To force re-seed, manually clear the database first.");
      process.exit(0);
    }

    console.log("📝 Database is empty. Proceeding with seed...\n");

    // Seed categories
    console.log("📁 Seeding categories...");
    const createdCategories = await db.insert(categoriesTable).values(seedCategories).returning();
    console.log(`✅ Created ${createdCategories.length} categories\n`);

    // Map category IDs
    const categoryIds = {
      customBowls: createdCategories.find(c => c.nameDE === "Wunsch Bowls")?.id || "",
      bowls: createdCategories.find(c => c.nameDE === "Poke Bowls")?.id || "",
      wraps: createdCategories.find(c => c.nameDE === "Wraps")?.id || "",
      appetizers: createdCategories.find(c => c.nameDE === "Vorspeisen")?.id || "",
      desserts: createdCategories.find(c => c.nameDE === "Desserts")?.id || "",
      drinks: createdCategories.find(c => c.nameDE === "Getränke")?.id || "",
    };

    // Seed menu items
    console.log("🍱 Seeding menu items...");
    const menuItemsData = createMenuItems(categoryIds);
    const createdMenuItems = await db.insert(menuItemsTable).values(menuItemsData).returning();
    console.log(`✅ Created ${createdMenuItems.length} menu items\n`);

    // Seed ingredients
    console.log("🥗 Seeding ingredients...");
    const ingredientsData = createIngredients();
    const createdIngredients = await db.insert(ingredientsTable).values(ingredientsData).returning();
    console.log(`✅ Created ${createdIngredients.length} ingredients\n`);

    console.log("✨ Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Menu Items: ${createdMenuItems.length}`);
    console.log(`   - Ingredients: ${createdIngredients.length}`);
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
