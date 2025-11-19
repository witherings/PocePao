import { getDb } from "./db";
import { categories as seedCategories, createMenuItems } from "./data/menu";
import { createIngredients } from "./data/ingredients";
import { 
  categories as categoriesTable,
  menuItems as menuItemsTable,
  ingredients as ingredientsTable
} from "@shared/schema";

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not set. Make sure the database is provisioned.");
    process.exit(1);
  }

  try {
    console.log("🌱 Starting database seeding...\n");

    const db = await getDb();
    const existingCategories = await db.select().from(categoriesTable);
    if (existingCategories.length > 0) {
      console.log("⚠️  Database already has data. Skipping seed to preserve existing data.");
      console.log(`   Found ${existingCategories.length} categories.`);
      process.exit(0);
    }

    console.log("📝 Database is empty. Proceeding with seed...\n");

    console.log("📁 Seeding categories...");
    const createdCategories = await db.insert(categoriesTable).values(seedCategories).returning();
    console.log(`✅ Created ${createdCategories.length} categories\n`);

    const categoryIds = {
      customBowls: createdCategories.find(c => c.nameDE === "Wunsch Bowls")?.id || "",
      bowls: createdCategories.find(c => c.nameDE === "Poke Bowls")?.id || "",
      wraps: createdCategories.find(c => c.nameDE === "Wraps")?.id || "",
      appetizers: createdCategories.find(c => c.nameDE === "Vorspeisen")?.id || "",
      desserts: createdCategories.find(c => c.nameDE === "Desserts")?.id || "",
      drinks: createdCategories.find(c => c.nameDE === "Getränke")?.id || "",
    };

    console.log("🍱 Seeding menu items...");
    const menuItemsData = createMenuItems(categoryIds);
    const createdMenuItems = await db.insert(menuItemsTable).values(menuItemsData).returning();
    console.log(`✅ Created ${createdMenuItems.length} menu items\n`);

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
