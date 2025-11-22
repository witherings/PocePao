import { getDb } from "./db";
import { categories, menuItems, ingredients, productVariants } from "@shared/schema";
import { categories as hardcodedCategories, createMenuItems } from "./data/menu";
import { createIngredients } from "./data/ingredients";
import { createBaseVariants, createFritzKolaVariants } from "./data/variants";
import { eq, or } from "drizzle-orm";
import path from "path";

// Deterministic slug generation from filename
function createSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[äöüß]/g, (match) => {
      const map: Record<string, string> = { ä: "ae", ö: "oe", ü: "ue", ß: "ss" };
      return map[match] || match;
    })
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]/g, "")
    .replace(/--+/g, "-")
    .trim();
}

// Extract extension from path
function getExtension(filePath: string): string {
  const ext = path.extname(filePath);
  return ext || ".png";
}

// Deterministic image path transformation
function updateImagePath(oldPath: string, itemNameDE?: string, categoryNameDE?: string, ingredientType?: string): string {
  if (!oldPath || oldPath.startsWith("/media/")) return oldPath;
  
  // Pattern matching for different categories
  if (oldPath.includes("/images/categories/Wunsch Bowls/main/")) {
    return "/media/categories/wunsch-bowls/items/wunsch-bowl.png";
  }
  
  if (oldPath.includes("/images/categories/Poke Bowls/")) {
    if (itemNameDE) {
      const slug = createSlug(itemNameDE);
      const ext = getExtension(oldPath);
      return `/media/categories/poke-bowls/items/${slug}${ext}`;
    }
  }
  
  if (oldPath.includes("/images/categories/Wraps/")) {
    if (itemNameDE) {
      const slug = createSlug(itemNameDE);
      const ext = getExtension(oldPath);
      return `/media/categories/wraps/items/${slug}${ext}`;
    }
  }
  
  if (oldPath.includes("/images/categories/Vorspeisen/")) {
    if (itemNameDE) {
      const slug = createSlug(itemNameDE);
      const ext = getExtension(oldPath);
      return `/media/categories/vorspeisen/items/${slug}${ext}`;
    }
  }
  
  if (oldPath.includes("/images/categories/Desserts/")) {
    if (itemNameDE) {
      const slug = createSlug(itemNameDE);
      const ext = getExtension(oldPath);
      return `/media/categories/desserts/items/${slug}${ext}`;
    }
  }
  
  if (oldPath.includes("/images/categories/Getränke/") || oldPath.includes("/images/categories/Getr")) {
    // Getränke с timestamp filenames - нужно manual mapping
    const getrankeMappings: Record<string, string> = {
      "beer-peroni.jpg": "beer-peroni.jpg",
      "10517032025182015_1760608171391.jpg": "kaffee.jpg",
      "15817032025182220_1760608171391.jpg": "espresso.jpg",
      "22417032025184355_1760608213786.jpg": "cappuccino.jpg",
      "33918032025134434_1760608213788.jpg": "latte-macchiato.jpg",
      "42817032025180237_1760608056886.jpg": "stilles-wasser.jpg",
      "59417032025182607_1760608171390.jpg": "martini-eleganz.jpg",
      "69717032025175940_1760608042517.jpg": "gruener-tropensturm.jpg",
      "69917032025183322_1760608213787.jpg": "goldene-paradieswelle.jpg",
      "56117032025181608_1760608102257.jpg": "vitaminwunder.jpg", // CONFLICT - also sprudel-wasser
      "67217032025165311_1760608014573.jpg": "lila-energieboost.jpg", // CONFLICT - also mandelmagie
    };
    
    const filename = path.basename(oldPath);
    if (getrankeMappings[filename]) {
      return `/media/categories/getraenke/items/${getrankeMappings[filename]}`;
    }
    
    // Fallback for unmapped Getränke
    if (itemNameDE) {
      const slug = createSlug(itemNameDE);
      const ext = getExtension(oldPath);
      return `/media/categories/getraenke/items/${slug}${ext}`;
    }
  }
  
  // Ingredients - both regular and extras use same images
  if (oldPath.includes("/zutaten/protein/") || oldPath.includes("/zutaten extra/extra protein/")) {
    const proteinMappings: Record<string, string> = {
      "tofu cubes.png": "tofu.png",
      "falafel balls.png": "falafel.png",
      "chicken slices.png": "chicken.png",
      "salmon slices .png": "salmon.png",
      "shrimp.png": "shrimp.png",
      "tuna slices.png": "tuna.png",
    };
    const filename = path.basename(oldPath);
    if (proteinMappings[filename]) {
      return `/media/ingredients/protein/${proteinMappings[filename]}`;
    }
  }
  
  if (oldPath.includes("/zutaten/base/")) {
    const baseMappings: Record<string, string> = {
      "white rice.png": "rice.png",
      "cooked couscous.png": "couscous.png",
      "cooked quinoa.png": "quinoa.png",
      "zucchini spaghetti.png": "zucchini-noodles.png",
    };
    const filename = path.basename(oldPath);
    if (baseMappings[filename]) {
      return `/media/ingredients/base/${baseMappings[filename]}`;
    }
  }
  
  if (oldPath.includes("/zutaten/marinade/")) {
    const filename = path.basename(oldPath);
    return `/media/ingredients/marinade/${filename}`;
  }
  
  if (oldPath.includes("/zutaten/fresh/")) {
    const freshMappings: Record<string, string> = {
      "Edamame.png": "edamame.png",
      "Gurke (Cucumber).png": "cucumber.png",
      "avokado.png": "avocado.png",
      "diced mango.png": "mango.png",
      "marinated carrot.png": "carrot.png",
      "Haus-Kimchi (Top).png": "kimchi.png",
      "fresh tomato cubes.png": "cherry-tomatoes.png",
      "fresh spinach leaves.png": "spinach.png",
      "cubed sweet potato.png": "sweet-potato.png",
      "sweet pumpkin.png": "pumpkin.png",
      "sweet corn kernels.png": "corn.png",
      "marinated red onions.png": "red-onion.png",
      "sliced beetroot.png": "red-beet.png",
      "Wakame seaweed salad.png": "wakame-salad.png",
      "pickled radish.png": "pickled-radish.png",
      "pickled white.png": "pickled-ginger.png",
    };
    const filename = path.basename(oldPath);
    if (freshMappings[filename]) {
      return `/media/ingredients/fresh/${freshMappings[filename]}`;
    }
  }
  
  if (oldPath.includes("/zutaten/sauce/")) {
    const sauceMappings: Record<string, string> = {
      "Teriyaki Sauce .png": "teriyaki.png",
      "Trüffel Fusion Sauce.png": "truffle-fusion.png",
      "Mango-Dill Sauce.png": "mango-dill.png",
      "Chili Mayo.png": "chili-mayo.png",
      "Kimchi Sriracha.png": "kimchi-sriracha.png",
      "Soy-Sesame Sauce.png": "soy-sesame.png",
      "Ginger Sauce.png": "ginger.png",
    };
    const filename = path.basename(oldPath);
    if (sauceMappings[filename]) {
      return `/media/ingredients/sauce/${sauceMappings[filename]}`;
    }
  }
  
  if (oldPath.includes("/zutaten/topping/")) {
    const toppingMappings: Record<string, string> = {
      "sesame seeds.png": "sesame.png",
      "sunflower seeds.png": "sunflower-seeds.png",
      "Nori strips.png": "nori.png",
      "pomegranate seeds.png": "pomegranate.png",
      "spring onions.png": "spring-onions.png",
      "black olives.png": "black-olives.png",
      "pumpkin seeds.png": "pumpkin-seeds.png",
      "cashew nuts.png": "cashew-nuts.png",
      "peanuts .png": "peanuts.png",
      "coconut chips.png": "coconut-chips.png",
      "oasted beetroot.png": "roasted-beetroot.png",
      "banana chips.png": "banana-chips.png",
      "capers.png": "capers.png",
      "almonds.png": "almonds.png",
    };
    const filename = path.basename(oldPath);
    if (toppingMappings[filename]) {
      return `/media/ingredients/topping/${toppingMappings[filename]}`;
    }
  }
  
  // Fallback: keep original path if no match
  console.warn(`⚠️  No mapping found for: ${oldPath}`);
  return oldPath;
}

async function migrateData() {
  try {
    console.log("🚀 Starting data migration v2 (with deterministic paths & extras)...\n");
    
    const db = await getDb();
    
    // STEP 1: Migrate Categories (upsert by name)
    console.log("📁 STEP 1: Migrating Categories...");
    
    for (const category of hardcodedCategories) {
      const existing = await db.select().from(categories).where(eq(categories.nameDE, category.nameDE)).limit(1);
      
      if (existing.length > 0) {
        await db.update(categories)
          .set({ name: category.name, icon: category.icon, order: category.order })
          .where(eq(categories.id, existing[0].id));
        console.log(`  ✅ Updated category: ${category.nameDE}`);
      } else {
        await db.insert(categories).values(category);
        console.log(`  ✅ Inserted category: ${category.nameDE}`);
      }
    }
    
    // Get category IDs for menu items
    const allCategories = await db.select().from(categories);
    const categoryMap = {
      customBowls: allCategories.find(c => c.nameDE === "Wunsch Bowls")!.id,
      bowls: allCategories.find(c => c.nameDE === "Poke Bowls")!.id,
      wraps: allCategories.find(c => c.nameDE === "Wraps")!.id,
      appetizers: allCategories.find(c => c.nameDE === "Vorspeisen")!.id,
      desserts: allCategories.find(c => c.nameDE === "Desserts")!.id,
      drinks: allCategories.find(c => c.nameDE === "Getränke")!.id,
    };
    
    // STEP 2: Migrate Menu Items (upsert by nameDE)
    console.log("\n🍜 STEP 2: Migrating Menu Items...");
    const menuItemsData = createMenuItems(categoryMap);
    let insertedCount = 0;
    let updatedCount = 0;
    
    for (const item of menuItemsData) {
      const categoryNameDE = allCategories.find(c => c.id === item.categoryId)?.nameDE || "";
      const newImagePath = updateImagePath(item.image, item.nameDE, categoryNameDE);
      
      const existing = await db.select().from(menuItems)
        .where(eq(menuItems.nameDE, item.nameDE))
        .limit(1);
      
      if (existing.length > 0) {
        await db.update(menuItems)
          .set({ ...item, image: newImagePath, categoryId: item.categoryId })
          .where(eq(menuItems.id, existing[0].id));
        updatedCount++;
        console.log(`  ✅ Updated: ${item.nameDE} → ${newImagePath}`);
      } else {
        const inserted = await db.insert(menuItems).values({ ...item, image: newImagePath }).returning();
        insertedCount++;
        console.log(`  ✅ Inserted: ${item.nameDE} → ${newImagePath}`);
        
        // Create variants for new items
        if (item.hasVariants === 1 && item.variantType === "base") {
          const baseVariants = createBaseVariants(inserted[0].id);
          await db.insert(productVariants).values(baseVariants);
        } else if (item.hasVariants === 1 && item.variantType === "flavor") {
          const flavorVariants = createFritzKolaVariants(inserted[0].id);
          await db.insert(productVariants).values(flavorVariants);
        }
      }
    }
    
    console.log(`✅ Menu items: ${insertedCount} inserted, ${updatedCount} updated`);
    
    // STEP 3: Migrate Ingredients (upsert by nameDE + type)
    console.log("\n🥗 STEP 3: Migrating Ingredients (including extras)...");
    const ingredientsData = createIngredients(); // This now includes ALL ingredients including extras
    let ingInsertedCount = 0;
    let ingUpdatedCount = 0;
    
    for (const ingredient of ingredientsData) {
      const newImagePath = updateImagePath(ingredient.image || "", ingredient.nameDE, "", ingredient.type);
      
      const existing = await db.select().from(ingredients)
        .where(
          eq(ingredients.nameDE, ingredient.nameDE)
        )
        .limit(1);
      
      if (existing.length > 0) {
        await db.update(ingredients)
          .set({ ...ingredient, image: newImagePath })
          .where(eq(ingredients.id, existing[0].id));
        ingUpdatedCount++;
        if (ingredient.image && newImagePath !== ingredient.image) {
          console.log(`  ✅ Updated: ${ingredient.nameDE} (${ingredient.type}) → ${newImagePath}`);
        }
      } else {
        await db.insert(ingredients).values({ ...ingredient, image: newImagePath });
        ingInsertedCount++;
        console.log(`  ✅ Inserted: ${ingredient.nameDE} (${ingredient.type}) → ${newImagePath}`);
      }
    }
    
    console.log(`✅ Ingredients: ${ingInsertedCount} inserted, ${ingUpdatedCount} updated`);
    
    // STEP 4: Verification
    console.log("\n✅ STEP 4: Verification...");
    const finalCategories = await db.select().from(categories);
    const finalMenuItems = await db.select().from(menuItems);
    const finalIngredients = await db.select().from(ingredients);
    const finalVariants = await db.select().from(productVariants);
    
    // Count extras
    const extraProteins = await db.select().from(ingredients).where(eq(ingredients.type, "extra_protein"));
    const extraFresh = await db.select().from(ingredients).where(eq(ingredients.type, "extra_fresh"));
    
    console.log(`\n📊 Final counts:`);
    console.log(`   Categories: ${finalCategories.length}`);
    console.log(`   Menu Items: ${finalMenuItems.length}`);
    console.log(`   Ingredients: ${finalIngredients.length}`);
    console.log(`     - Extra Proteins: ${extraProteins.length}`);
    console.log(`     - Extra Fresh: ${extraFresh.length}`);
    console.log(`   Product Variants: ${finalVariants.length}`);
    
    // Check for unmapped /images/ paths
    const unmappedItems = await db.select().from(menuItems).where(eq(menuItems.image, ""));
    const unmappedIngredients = await db.select().from(ingredients);
    const stillOldPaths = unmappedIngredients.filter(ing => ing.image && ing.image.includes("/images/"));
    
    if (stillOldPaths.length > 0) {
      console.log(`\n⚠️  WARNING: ${stillOldPaths.length} ingredients still have /images/ paths:`);
      stillOldPaths.forEach(ing => console.log(`   - ${ing.nameDE}: ${ing.image}`));
    } else {
      console.log(`\n✅ All image paths successfully migrated to /media/`);
    }
    
    console.log("\n🎉 Migration v2 completed successfully!");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run migration
migrateData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
