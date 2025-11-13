import { db } from "./db";
import { categories as seedCategories, createMenuItems } from "./data/menu";
import { createIngredients } from "./data/ingredients";
import { 
  categories as categoriesTable,
  menuItems as menuItemsTable,
  ingredients as ingredientsTable,
  adminUsers
} from "@shared/schema";
import bcrypt from 'bcryptjs';

/**
 * Automatically initialize database on server start
 * - Seeds menu data if categories table is empty
 * - Creates admin user if no admin exists
 * Safe to run multiple times (idempotent)
 * Reuses the existing database pool from server/db.ts
 * Uses transactions to ensure atomic operations
 */
export async function initializeDatabase() {
  if (!db) {
    console.log("⚠️  Database not configured. Skipping initialization.");
    return;
  }

  try {
    console.log("\n🔍 Checking database initialization status...");

    // Check if database needs seeding - check if any categories exist
    // Select only id column for efficiency
    const existingCategories = await db.select({ id: categoriesTable.id }).from(categoriesTable).limit(1);
    
    if (existingCategories.length === 0) {
      console.log("📦 Database is empty. Starting automatic seeding...\n");
      
      // Wrap all seeding operations in a transaction for atomicity
      await db.transaction(async (tx) => {
        // Seed categories
        console.log("📁 Creating categories...");
        const createdCategories = await tx.insert(categoriesTable).values(seedCategories).returning();
        console.log(`✅ Created ${createdCategories.length} categories`);

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
        console.log("🍱 Creating menu items...");
        const menuItemsData = createMenuItems(categoryIds);
        const createdMenuItems = await tx.insert(menuItemsTable).values(menuItemsData).returning();
        console.log(`✅ Created ${createdMenuItems.length} menu items`);

        // Seed ingredients
        console.log("🥗 Creating ingredients...");
        const ingredientsData = createIngredients();
        const createdIngredients = await tx.insert(ingredientsTable).values(ingredientsData).returning();
        console.log(`✅ Created ${createdIngredients.length} ingredients`);
      });

      console.log("\n✨ Database seeded successfully!");
    } else {
      console.log(`✅ Database already seeded (categories exist)`);
    }

    // Check if admin user needs to be created
    const existingAdmins = await db.select({ id: adminUsers.id }).from(adminUsers).limit(1);
    
    if (existingAdmins.length === 0) {
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (adminPassword) {
        console.log("🔐 Creating admin user...");
        
        // Hash password and insert in transaction for atomicity
        await db.transaction(async (tx) => {
          const hashedPassword = await bcrypt.hash(adminPassword, 10);
          await tx.insert(adminUsers).values({
            username: adminUsername,
            password: hashedPassword,
          });
        });

        console.log(`✅ Admin user created: ${adminUsername}`);
      } else {
        console.log("⚠️  ADMIN_PASSWORD not set. Skipping admin creation.");
        console.log("   Set ADMIN_PASSWORD environment variable to create admin automatically.");
      }
    } else {
      console.log(`✅ Admin user already exists`);
    }

    console.log("✅ Database initialization complete!\n");

  } catch (error) {
    console.error("❌ Error during database initialization:", error);
    console.error("   Server will continue, but database may not be properly initialized.");
    console.error("   Check DATABASE_URL and database connection settings.");
  }
}
