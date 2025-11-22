import { getDb } from "./db";
import { categories, menuItems, ingredients, productVariants } from "@shared/schema";
import { categories as hardcodedCategories, createMenuItems } from "./data/menu";
import { createIngredients } from "./data/ingredients";
import { createBaseVariants, createFritzKolaVariants } from "./data/variants";
import { eq } from "drizzle-orm";
import path from "path";
import { access, constants } from "fs/promises";

// Normalize ingredient names (strip "Extra ", quantity qualifiers, parentheses)
function normalizeIngredientName(name: string): string {
  return name
    .replace(/^Extra\s+/i, "")  // Strip "Extra " prefix
    .replace(/\s*\([^)]*\)/g, "") // Remove parentheses and contents
    .trim();
}

// Deterministic slug generation
function createSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[äöüß]/g, (match) => {
      const map: Record<string, string> = { ä: "ae", ö: "oe", ü: "ue", ß: "ss" };
      return map[match] || match;
    })
    .replace(/\s+/g, "-")
    .replace(/[^\w\-\.]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Extract extension from path
function getExtension(filePath: string): string {
  const ext = path.extname(filePath);
  return ext || ".png";
}

// COMPLETE Getränke mapping with collision resolution
const GETRAENKE_IMAGE_MAP: Record<string, string> = {
  // Coffee & hot drinks
  "Kaffee": "kaffee.jpg",
  "Espresso": "espresso.jpg",
  "Cappuccino": "cappuccino.jpg",
  "Latte Macchiato": "latte-macchiato.jpg",
  
  // Water
  "Stilles Wasser": "stilles-wasser.jpg",
  "Sprudel Wasser": "sprudel-wasser.jpg",
  
  // Beers (different files needed)
  "Peroni Nastro Azzurro": "beer-peroni.jpg",
  "Beck's Blue": "beer-becks-blue.jpg",  // NEEDS NEW IMAGE
  "Heineken": "beer-heineken.jpg",        // NEEDS NEW IMAGE
  
  // Cocktails
  "Grüner Tropensturm": "gruener-tropensturm.jpg",
  "Goldene Paradieswelle": "goldene-paradieswelle.jpg",
  "Martini Eleganz": "martini-eleganz.jpg",
  
  // Smoothies (separate images required for conflicts)
  "Vitaminwunder": "vitaminwunder.jpg",
  "Lila Energieboost": "lila-energieboost.jpg",
  "Mandelmagie": "mandelmagie.jpg",  // NEEDS NEW IMAGE (currently conflicts with Lila Energieboost)
  
  // Fritz-Kola (needs separate image)
  "Fritz-Kola": "fritz-kola.jpg",  // NEEDS NEW IMAGE (currently uses espresso.jpg)
  
  // Teas
  "Teespezialitäten - Kokostraum": "tee-kokostraum.jpg",          // NEEDS NEW IMAGE
  "Teespezialitäten - Ingwer-Lemongras": "tee-ingwer-lemongras.jpg",  // NEEDS NEW IMAGE
};

// Enhanced image path transformation with category-first priority
async function updateImagePath(
  oldPath: string, 
  itemNameDE: string, 
  categoryNameDE: string, 
  ingredientType?: string
): Promise<{ newPath: string; exists: boolean; error?: string }> {
  if (!oldPath) return { newPath: oldPath, exists: true };
  if (oldPath.startsWith("/media/")) return { newPath: oldPath, exists: true };
  
  let newPath: string;
  
  // PRIORITY 1: Use ingredientType if provided (for ingredients)
  if (ingredientType) {
    // Normalize name: strip "Extra " prefix and qualifiers
    const normalizedName = normalizeIngredientName(itemNameDE);
    
    const ingredientMappings: Record<string, Record<string, string>> = {
      "protein": {
        "Tofu": "tofu.png", "Falafel": "falafel.png", "Hähnchen": "chicken.png",
        "Lachs": "salmon.png", "Garnelen": "shrimp.png", "Thunfisch": "tuna.png"
      },
      "extra_protein": {
        "Tofu": "tofu.png", "Falafel": "falafel.png", "Hähnchen": "chicken.png",
        "Lachs": "salmon.png", "Garnelen": "shrimp.png", "Thunfisch": "tuna.png"
      },
      "base": {
        "Reis": "rice.png", "Couscous": "couscous.png", "Quinoa": "quinoa.png",
        "Zucchini-Nudeln": "zucchini-noodles.png"
      },
      "marinade": {
        "Lanai": "Lanai (Marinade).png", "Gozo": "Gozo (Marinade).png",
        "Capri": "Capri (Marinade).png", "Maui": "Maui (Marinade).png"
      },
      "fresh": {
        "Edamame": "edamame.png", "Gurke": "cucumber.png", "Avocado": "avocado.png",
        "Mango": "mango.png", "Karotte": "carrot.png", "Kimchi": "kimchi.png",
        "Kirschtomaten": "cherry-tomatoes.png", "Spinat": "spinach.png",
        "Süßkartoffel": "sweet-potato.png", "süßer Kürbis": "pumpkin.png",
        "Zuckermais": "corn.png", "Rote Zwiebeln": "red-onion.png", "Rote Bete": "red-beet.png",
        "Wakame Salat": "wakame-salad.png", "Rettich eingelegt": "pickled-radish.png",
        "Ingwer eingelegt": "pickled-ginger.png"
      },
      "extra_fresh": {
        "Extra Edamame": "edamame.png", "Extra Gurke": "cucumber.png", "Extra Avocado": "avocado.png",
        "Extra Mango": "mango.png", "Extra Karotte": "carrot.png", "Extra süßes rotes Kimchi": "kimchi.png",
        "Extra Kirschtomaten": "cherry-tomatoes.png", "Extra Spinat": "spinach.png",
        "Extra Süßkartoffel": "sweet-potato.png", "Extra süßer Kürbis": "pumpkin.png",
        "Extra Zuckermais": "corn.png", "Extra rote Zwiebeln": "red-onion.png",
        "Extra rote Bete": "red-beet.png", "Extra Wakame Salat": "wakame-salad.png"
      },
      "sauce": {
        "Teriyaki-Sauce": "teriyaki.png", "Trüffel Fusion": "truffle-fusion.png",
        "Mango-Dill": "mango-dill.png", "Chili Mayo": "chili-mayo.png",
        "Kimchi Sriracha": "kimchi-sriracha.png", "Soja-Sesam": "soy-sesame.png",
        "Ingwer-Sauce": "ginger.png"
      },
      "topping": {
        "Sesam": "sesame.png", "Sonnenblumenkerne": "sunflower-seeds.png",
        "Nori": "nori.png", "Granatapfel": "pomegranate.png", "Frühlingszwiebe": "spring-onions.png",
        "Schwarze Oliven": "black-olives.png", "Kürbiskerne": "pumpkin-seeds.png",
        "Cashewkerne": "cashew-nuts.png", "Erdnüsse": "peanuts.png",
        "Kokoschips": "coconut-chips.png", "Geröstete Rote Bete Chips": "roasted-beetroot.png",
        "Bananenchips": "banana-chips.png", "Kapern": "capers.png", "Mandeln": "almonds.png",
        "Kokosraspeln": "coconut-flakes.png", "Ingwer eingelegt": "pickled-ginger.png"
      },
    };
    
    const typeFolder = ingredientType.replace("extra_", "");
    const filename = ingredientMappings[ingredientType]?.[normalizedName];
    
    if (filename) {
      newPath = `/media/ingredients/${typeFolder}/${filename}`;
    } else {
      const slug = createSlug(normalizedName);
      const ext = getExtension(oldPath);
      newPath = `/media/ingredients/${typeFolder}/${slug}${ext}`;
    }
    
  } else if (categoryNameDE) {
    // PRIORITY 2: Use categoryNameDE for menu items
    const categorySlug = createSlug(categoryNameDE);
    
    // Special handling for Getränke (has explicit mapping)
    if (categoryNameDE === "Getränke") {
      const mappedFilename = GETRAENKE_IMAGE_MAP[itemNameDE];
      if (mappedFilename) {
        newPath = `/media/categories/getraenke/items/${mappedFilename}`;
      } else {
        const error = `⚠️  Getränke item "${itemNameDE}" not in GETRAENKE_IMAGE_MAP - needs manual mapping`;
        console.error(error);
        const slug = createSlug(itemNameDE);
        const ext = getExtension(oldPath);
        newPath = `/media/categories/getraenke/items/${slug}${ext}`;
        return { newPath, exists: false, error };
      }
    } 
    // Special handling for Wunsch Bowl (single hero image)
    else if (categoryNameDE === "Wunsch Bowls") {
      newPath = "/media/categories/wunsch-bowls/items/wunsch-bowl.png";
    }
    // All other categories: deterministic slug generation
    else {
      const itemSlug = createSlug(itemNameDE);
      const ext = getExtension(oldPath);
      newPath = `/media/categories/${categorySlug}/items/${itemSlug}${ext}`;
    }
    
  } else {
    // FALLBACK: Legacy path patterns (should rarely hit this)
    console.warn(`⚠️  No category/type provided for: ${itemNameDE} - using legacy path logic`);
    newPath = oldPath;
  }
  
  // STEP 3: Verify file existence
  const fullPath = path.join(process.cwd(), "public", newPath);
  let exists = false;
  
  try {
    await access(fullPath, constants.F_OK);
    exists = true;
  } catch {
    exists = false;
  }
  
  return { newPath, exists };
}

async function migrateData() {
  try {
    console.log("🚀 Starting data migration v3 (production-ready with validation)...\n");
    
    const db = await getDb();
    const missingFiles: string[] = [];
    const conflictWarnings: string[] = [];
    
    // STEP 1: Migrate Categories (upsert by nameDE)
    console.log("📁 STEP 1: Migrating Categories...");
    
    for (const category of hardcodedCategories) {
      const existing = await db.select().from(categories).where(eq(categories.nameDE, category.nameDE)).limit(1);
      
      if (existing.length > 0) {
        await db.update(categories)
          .set({ name: category.name, icon: category.icon, order: category.order })
          .where(eq(categories.id, existing[0].id));
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
    
    console.log("✅ Categories migrated");
    
    // STEP 2: Migrate Menu Items with validation
    console.log("\n🍜 STEP 2: Migrating Menu Items...");
    const menuItemsData = createMenuItems(categoryMap);
    let insertedCount = 0;
    let updatedCount = 0;
    
    for (const item of menuItemsData) {
      const categoryNameDE = allCategories.find(c => c.id === item.categoryId)?.nameDE || "";
      const { newPath, exists, error } = await updateImagePath(item.image, item.nameDE, categoryNameDE);
      
      if (!exists) {
        missingFiles.push(`${item.nameDE} → ${newPath}`);
      }
      
      if (error) {
        conflictWarnings.push(error);
      }
      
      const existing = await db.select().from(menuItems)
        .where(eq(menuItems.nameDE, item.nameDE))
        .limit(1);
      
      if (existing.length > 0) {
        await db.update(menuItems)
          .set({ ...item, image: newPath, categoryId: item.categoryId })
          .where(eq(menuItems.id, existing[0].id));
        updatedCount++;
        console.log(`  ✅ Updated: ${item.nameDE} → ${newPath} ${exists ? "✓" : "⚠️  MISSING"}`);
      } else {
        const inserted = await db.insert(menuItems).values({ ...item, image: newPath }).returning();
        insertedCount++;
        console.log(`  ✅ Inserted: ${item.nameDE} → ${newPath} ${exists ? "✓" : "⚠️  MISSING"}`);
        
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
    
    // STEP 3: Migrate Ingredients with validation
    console.log("\n🥗 STEP 3: Migrating Ingredients (including extras)...");
    const ingredientsData = createIngredients();
    let ingInsertedCount = 0;
    let ingUpdatedCount = 0;
    
    for (const ingredient of ingredientsData) {
      const { newPath, exists } = await updateImagePath(
        ingredient.image || "", 
        ingredient.nameDE, 
        "", 
        ingredient.type
      );
      
      if (!exists && newPath !== ingredient.image) {
        missingFiles.push(`${ingredient.nameDE} (${ingredient.type}) → ${newPath}`);
      }
      
      const existing = await db.select().from(ingredients)
        .where(eq(ingredients.nameDE, ingredient.nameDE))
        .limit(1);
      
      if (existing.length > 0) {
        await db.update(ingredients)
          .set({ ...ingredient, image: newPath })
          .where(eq(ingredients.id, existing[0].id));
        ingUpdatedCount++;
      } else {
        await db.insert(ingredients).values({ ...ingredient, image: newPath });
        ingInsertedCount++;
        console.log(`  ✅ Inserted: ${ingredient.nameDE} (${ingredient.type}) → ${newPath} ${exists ? "✓" : "⚠️  MISSING"}`);
      }
    }
    
    console.log(`✅ Ingredients: ${ingInsertedCount} inserted, ${ingUpdatedCount} updated`);
    
    // STEP 4: Verification
    console.log("\n✅ STEP 4: Verification...");
    const finalCategories = await db.select().from(categories);
    const finalMenuItems = await db.select().from(menuItems);
    const finalIngredients = await db.select().from(ingredients);
    const finalVariants = await db.select().from(productVariants);
    
    const extraProteins = await db.select().from(ingredients).where(eq(ingredients.type, "extra_protein"));
    const extraFresh = await db.select().from(ingredients).where(eq(ingredients.type, "extra_fresh"));
    
    console.log(`\n📊 Final counts:`);
    console.log(`   Categories: ${finalCategories.length}`);
    console.log(`   Menu Items: ${finalMenuItems.length}`);
    console.log(`   Ingredients: ${finalIngredients.length}`);
    console.log(`     - Extra Proteins: ${extraProteins.length}`);
    console.log(`     - Extra Fresh: ${extraFresh.length}`);
    console.log(`   Product Variants: ${finalVariants.length}`);
    
    // Report issues
    if (missingFiles.length > 0) {
      console.log(`\n❌ MISSING FILES (${missingFiles.length}):`);
      missingFiles.forEach(msg => console.log(`   ${msg}`));
    }
    
    if (conflictWarnings.length > 0) {
      console.log(`\n⚠️  WARNINGS (${conflictWarnings.length}):`);
      conflictWarnings.forEach(msg => console.log(`   ${msg}`));
    }
    
    if (missingFiles.length === 0 && conflictWarnings.length === 0) {
      console.log(`\n✅ All image paths validated - migration ready for production!`);
    } else {
      console.log(`\n⚠️  Migration completed with issues - manual intervention required`);
    }
    
    console.log("\n🎉 Migration v3 completed!");
    
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
