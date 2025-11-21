import { getDb } from "./db";
import { categories as seedCategories, createMenuItems } from "./data/menu";
import { createIngredients } from "./data/ingredients";
import { createBaseVariants, createFritzKolaVariants } from "./data/variants";
import { 
  categories as categoriesTable,
  menuItems as menuItemsTable,
  ingredients as ingredientsTable,
  productVariants as productVariantsTable,
  pageImages as pageImagesTable
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

    console.log("🎯 Seeding product variants...");
    const variantsData = [];
    
    // Add base variants for bowls with enableBaseSelection
    const bowlsWithBaseSelection = createdMenuItems.filter(item => item.enableBaseSelection === 1);
    for (const bowl of bowlsWithBaseSelection) {
      variantsData.push(...createBaseVariants(bowl.id));
    }
    console.log(`   - Adding base variants for ${bowlsWithBaseSelection.length} bowls`);
    
    // Add flavor variants for Fritz-Kola
    const fritzKola = createdMenuItems.find(item => item.nameDE === "Fritz-Kola");
    if (fritzKola) {
      variantsData.push(...createFritzKolaVariants(fritzKola.id));
      console.log(`   - Adding flavor variants for Fritz-Kola`);
    }
    
    const createdVariants = await db.insert(productVariantsTable).values(variantsData).returning();
    console.log(`✅ Created ${createdVariants.length} product variants\n`);

    console.log("📸 Seeding page images (header sliders)...");
    const sliderImages = [
      {
        page: "startseite",
        url: "/images/pages/Startseite/slider-1.jpg",
        filename: "slider-1.jpg",
        order: 1,
      },
      {
        page: "startseite",
        url: "/images/pages/Startseite/slider-2.jpg",
        filename: "slider-2.jpg",
        order: 2,
      },
      {
        page: "startseite",
        url: "/images/pages/Startseite/slider-3.jpg",
        filename: "slider-3.jpg",
        order: 3,
      },
    ];
    const createdSliders = await db.insert(pageImagesTable).values(sliderImages).returning();
    console.log(`✅ Created ${createdSliders.length} header sliders\n`);

    console.log("✨ Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Menu Items: ${createdMenuItems.length}`);
    console.log(`   - Ingredients: ${createdIngredients.length}`);
    console.log(`   - Product Variants: ${createdVariants.length}`);
    console.log(`   - Header Sliders: ${createdSliders.length}`);
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
