import { getDb } from "./db";
import { categories, menuItems, ingredients, productVariants } from "@shared/schema";
import { categories as hardcodedCategories, createMenuItems } from "./data/menu";
import { createIngredients } from "./data/ingredients";
import { createBaseVariants, createFritzKolaVariants } from "./data/variants";
import { eq } from "drizzle-orm";

// Функция для обновления путей изображений
function updateImagePath(oldPath: string): string {
  if (!oldPath) return oldPath;
  
  // Маппинг старых путей на новые
  const mappings: Record<string, string> = {
    // Categories
    "/images/categories/Wunsch Bowls/main/Gemini_Generated_Image_4oapkm4oapkm4oap.png": "/media/categories/wunsch-bowls/items/wunsch-bowl.png",
    "/images/categories/Poke Bowls/thunfisch-traum-reis.webp": "/media/categories/poke-bowls/items/thunfisch-traum.webp",
    "/images/categories/Poke Bowls/thunfisch-traum-quinoa.png": "/media/categories/poke-bowls/items/thunfisch-traum.webp",
    "/images/categories/Poke Bowls/haehnchen-harmonie-reis.png": "/media/categories/poke-bowls/items/haehnchen-harmonie.png",
    "/images/categories/Poke Bowls/haehnchen-harmonie-quinoa.png": "/media/categories/poke-bowls/items/haehnchen-harmonie.png",
    "/images/categories/Poke Bowls/lachs-lust-quinoa.png": "/media/categories/poke-bowls/items/lachs-lust.png",
    "/images/categories/Poke Bowls/lachs-lust-reis.png": "/media/categories/poke-bowls/items/lachs-lust.png",
    "/images/categories/Poke Bowls/falafel-freude-quinoa.webp": "/media/categories/poke-bowls/items/falafel-freude.webp",
    "/images/categories/Poke Bowls/falafel-freude-reis.webp": "/media/categories/poke-bowls/items/falafel-freude.webp",
    "/images/categories/Poke Bowls/garnelen-genuss-reis.png": "/media/categories/poke-bowls/items/garnelen-genuss.png",
    "/images/categories/Poke Bowls/garnelen-genuss-quinoa.png": "/media/categories/poke-bowls/items/garnelen-genuss.png",
    "/images/categories/Poke Bowls/tofu-triumph-reis.webp": "/media/categories/poke-bowls/items/tofu-triumph.webp",
    "/images/categories/Poke Bowls/mittags-bowl-haehnchen.png": "/media/categories/poke-bowls/items/mittags-bowl-haehnchen.png",
    "/images/categories/Poke Bowls/mittags-bowl-tofu.webp": "/media/categories/poke-bowls/items/mittags-bowl-tofu.webp",
    "/images/categories/Poke Bowls/vitamins-bowl.png": "/media/categories/poke-bowls/items/vitamins-bowl.png",
    "/images/categories/Wraps/wrap-haehnchen.webp": "/media/categories/wraps/items/wrap-haehnchen.webp",
    "/images/categories/Wraps/wrap-lachs.webp": "/media/categories/wraps/items/wrap-lachs.webp",
    "/images/categories/Wraps/wrap-falafel.webp": "/media/categories/wraps/items/wrap-falafel.webp",
    "/images/categories/Desserts/acai-bowl.webp": "/media/categories/desserts/items/acai-bowl.webp",
    "/images/categories/Vorspeisen/fruehlingsrollen.webp": "/media/categories/vorspeisen/items/fruehlingsrollen.webp",
    "/images/categories/Vorspeisen/green-salat.webp": "/media/categories/vorspeisen/items/green-salat.webp",
    "/images/categories/Vorspeisen/tofu-salat.webp": "/media/categories/vorspeisen/items/tofu-salat.webp",
    "/images/categories/Vorspeisen/haehnchen-salat.webp": "/media/categories/vorspeisen/items/haehnchen-salat.webp",
    "/images/categories/Vorspeisen/haehnchenstreifen.webp": "/media/categories/vorspeisen/items/haehnchenstreifen.webp",
    "/images/categories/Vorspeisen/wakame-salat.webp": "/media/categories/vorspeisen/items/wakame-salat.webp",
    "/images/categories/Desserts/mandeln-weisse-schokolade.webp": "/media/categories/desserts/items/mandeln-weisse-schokolade.webp",
    "/images/categories/Desserts/kokosnuss-vollmilchschokolade.webp": "/media/categories/desserts/items/kokosnuss-vollmilchschokolade.webp",
    "/images/categories/Desserts/kokoskugel-deluxe.webp": "/media/categories/desserts/items/kokoskugel-deluxe.webp",
    
    // Getränke - mapped files
    "/images/categories/Getränke/beer-peroni.jpg": "/media/categories/getraenke/items/beer-peroni.jpg",
    "/images/categories/Getränke/10517032025182015_1760608171391.jpg": "/media/categories/getraenke/items/kaffee.jpg",
    "/images/categories/Getränke/15817032025182220_1760608171391.jpg": "/media/categories/getraenke/items/espresso.jpg",
    "/images/categories/Getränke/22417032025184355_1760608213786.jpg": "/media/categories/getraenke/items/cappuccino.jpg",
    "/images/categories/Getränke/33918032025134434_1760608213788.jpg": "/media/categories/getraenke/items/latte-macchiato.jpg",
    "/images/categories/Getränke/42817032025180237_1760608056886.jpg": "/media/categories/getraenke/items/stilles-wasser.jpg",
    "/images/categories/Getränke/59417032025182607_1760608171390.jpg": "/media/categories/getraenke/items/martini-eleganz.jpg",
    "/images/categories/Getränke/69717032025175940_1760608042517.jpg": "/media/categories/getraenke/items/gruener-tropensturm.jpg",
    "/images/categories/Getränke/69917032025183322_1760608213787.jpg": "/media/categories/getraenke/items/goldene-paradieswelle.jpg",
    
    // Ingredients - Proteins
    "/images/categories/Wunsch Bowls/zutaten/protein/tofu cubes.png": "/media/ingredients/protein/tofu.png",
    "/images/categories/Wunsch Bowls/zutaten/protein/falafel balls.png": "/media/ingredients/protein/falafel.png",
    "/images/categories/Wunsch Bowls/zutaten/protein/chicken slices.png": "/media/ingredients/protein/chicken.png",
    "/images/categories/Wunsch Bowls/zutaten/protein/salmon slices .png": "/media/ingredients/protein/salmon.png",
    "/images/categories/Wunsch Bowls/zutaten/protein/shrimp.png": "/media/ingredients/protein/shrimp.png",
    "/images/categories/Wunsch Bowls/zutaten/protein/tuna slices.png": "/media/ingredients/protein/tuna.png",
    
    // Ingredients - Bases
    "/images/categories/Wunsch Bowls/zutaten/base/white rice.png": "/media/ingredients/base/rice.png",
    "/images/categories/Wunsch Bowls/zutaten/base/cooked couscous.png": "/media/ingredients/base/couscous.png",
    "/images/categories/Wunsch Bowls/zutaten/base/cooked quinoa.png": "/media/ingredients/base/quinoa.png",
    "/images/categories/Wunsch Bowls/zutaten/base/zucchini spaghetti.png": "/media/ingredients/base/zucchini-noodles.png",
    
    // Ingredients - Marinades
    "/images/categories/Wunsch Bowls/zutaten/marinade/Lanai (Marinade).png": "/media/ingredients/marinade/Lanai (Marinade).png",
    "/images/categories/Wunsch Bowls/zutaten/marinade/Gozo (Marinade).png": "/media/ingredients/marinade/Gozo (Marinade).png",
    "/images/categories/Wunsch Bowls/zutaten/marinade/Capri (Marinade).png": "/media/ingredients/marinade/Capri (Marinade).png",
    "/images/categories/Wunsch Bowls/zutaten/marinade/Maui (Marinade).png": "/media/ingredients/marinade/Maui (Marinade).png",
    
    // Ingredients - Fresh
    "/images/categories/Wunsch Bowls/zutaten/fresh/Edamame.png": "/media/ingredients/fresh/edamame.png",
    "/images/categories/Wunsch Bowls/zutaten/fresh/Gurke (Cucumber).png": "/media/ingredients/fresh/cucumber.png",
    "/images/categories/Wunsch Bowls/zutaten/fresh/avokado.png": "/media/ingredients/fresh/avocado.png",
    "/images/categories/Wunsch Bowls/zutaten/fresh/diced mango.png": "/media/ingredients/fresh/mango.png",
    "/images/categories/Wunsch Bowls/zutaten/fresh/marinated carrot.png": "/media/ingredients/fresh/carrot.png",
    "/images/categories/Wunsch Bowls/zutaten/fresh/Haus-Kimchi (Top).png": "/media/ingredients/fresh/kimchi.png",
    "/images/categories/Wunsch Bowls/zutaten/fresh/fresh tomato cubes.png": "/media/ingredients/fresh/cherry-tomatoes.png",
    "/images/categories/Wunsch Bowls/zutaten/fresh/fresh spinach leaves.png": "/media/ingredients/fresh/spinach.png",
    "/images/categories/Wunsch Bowls/zutaten/fresh/cubed sweet potato.png": "/media/ingredients/fresh/sweet-potato.png",
    "/images/categories/Wunsch Bowls/zutaten/fresh/sweet pumpkin.png": "/media/ingredients/fresh/pumpkin.png",
    "/images/categories/Wunsch Bowls/zutaten/fresh/sweet corn kernels.png": "/media/ingredients/fresh/corn.png",
    "/images/categories/Wunsch Bowls/zutaten/fresh/marinated red onions.png": "/media/ingredients/fresh/red-onion.png",
    "/images/categories/Wunsch Bowls/zutaten/fresh/sliced beetroot.png": "/media/ingredients/fresh/red-beet.png",
    "/images/categories/Wunsch Bowls/zutaten/fresh/Wakame seaweed salad.png": "/media/ingredients/fresh/wakame-salad.png",
    "/images/categories/Wunsch Bowls/zutaten/fresh/pickled radish.png": "/media/ingredients/fresh/pickled-radish.png",
    "/images/categories/Wunsch Bowls/zutaten/fresh/pickled white.png": "/media/ingredients/fresh/pickled-ginger.png",
    
    // Ingredients - Sauces
    "/images/categories/Wunsch Bowls/zutaten/sauce/Teriyaki Sauce .png": "/media/ingredients/sauce/teriyaki.png",
    "/images/categories/Wunsch Bowls/zutaten/sauce/Trüffel Fusion Sauce.png": "/media/ingredients/sauce/truffle-fusion.png",
    "/images/categories/Wunsch Bowls/zutaten/sauce/Mango-Dill Sauce.png": "/media/ingredients/sauce/mango-dill.png",
    "/images/categories/Wunsch Bowls/zutaten/sauce/Chili Mayo.png": "/media/ingredients/sauce/chili-mayo.png",
    "/images/categories/Wunsch Bowls/zutaten/sauce/Kimchi Sriracha.png": "/media/ingredients/sauce/kimchi-sriracha.png",
    "/images/categories/Wunsch Bowls/zutaten/sauce/Soy-Sesame Sauce.png": "/media/ingredients/sauce/soy-sesame.png",
    "/images/categories/Wunsch Bowls/zutaten/sauce/Ginger Sauce.png": "/media/ingredients/sauce/ginger.png",
    
    // Ingredients - Toppings
    "/images/categories/Wunsch Bowls/zutaten/topping/sesame seeds.png": "/media/ingredients/topping/sesame.png",
    "/images/categories/Wunsch Bowls/zutaten/topping/sunflower seeds.png": "/media/ingredients/topping/sunflower-seeds.png",
    "/images/categories/Wunsch Bowls/zutaten/topping/Nori strips.png": "/media/ingredients/topping/nori.png",
    "/images/categories/Wunsch Bowls/zutaten/topping/pomegranate seeds.png": "/media/ingredients/topping/pomegranate.png",
    "/images/categories/Wunsch Bowls/zutaten/topping/spring onions.png": "/media/ingredients/topping/spring-onions.png",
    "/images/categories/Wunsch Bowls/zutaten/topping/black olives.png": "/media/ingredients/topping/black-olives.png",
    "/images/categories/Wunsch Bowls/zutaten/topping/pumpkin seeds.png": "/media/ingredients/topping/pumpkin-seeds.png",
    "/images/categories/Wunsch Bowls/zutaten/topping/cashew nuts.png": "/media/ingredients/topping/cashew-nuts.png",
    "/images/categories/Wunsch Bowls/zutaten/topping/peanuts .png": "/media/ingredients/topping/peanuts.png",
    "/images/categories/Wunsch Bowls/zutaten/topping/coconut chips.png": "/media/ingredients/topping/coconut-chips.png",
    "/images/categories/Wunsch Bowls/zutaten/topping/oasted beetroot.png": "/media/ingredients/topping/roasted-beetroot.png",
    "/images/categories/Wunsch Bowls/zutaten/topping/banana chips.png": "/media/ingredients/topping/banana-chips.png",
    "/images/categories/Wunsch Bowls/zutaten/topping/capers.png": "/media/ingredients/topping/capers.png",
    "/images/categories/Wunsch Bowls/zutaten/topping/almonds.png": "/media/ingredients/topping/almonds.png",
    
    // Extra ingredients - используют те же изображения
    "/images/categories/Wunsch Bowls/zutaten extra/extra protein/tofu cubes.png": "/media/ingredients/protein/tofu.png",
    "/images/categories/Wunsch Bowls/zutaten extra/extra protein/falafel balls.png": "/media/ingredients/protein/falafel.png",
    "/images/categories/Wunsch Bowls/zutaten extra/extra protein/chicken slices.png": "/media/ingredients/protein/chicken.png",
    "/images/categories/Wunsch Bowls/zutaten extra/extra protein/salmon slices .png": "/media/ingredients/protein/salmon.png",
    "/images/categories/Wunsch Bowls/zutaten extra/extra protein/shrimp.png": "/media/ingredients/protein/shrimp.png",
    "/images/categories/Wunsch Bowls/zutaten extra/extra protein/tuna slices.png": "/media/ingredients/protein/tuna.png",
  };
  
  return mappings[oldPath] || oldPath;
}

async function migrateData() {
  try {
    console.log("🚀 Starting data migration from hardcoded files to PostgreSQL...\n");
    
    const db = await getDb();
    
    // STEP 1: Migrate Categories
    console.log("📁 STEP 1: Migrating Categories...");
    const existingCategories = await db.select().from(categories);
    
    if (existingCategories.length > 0) {
      console.log(`⚠️  Found ${existingCategories.length} existing categories. Skipping category migration.`);
    } else {
      const insertedCategories = await db.insert(categories).values(hardcodedCategories).returning();
      console.log(`✅ Inserted ${insertedCategories.length} categories`);
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
    
    // STEP 2: Migrate Menu Items
    console.log("\n🍜 STEP 2: Migrating Menu Items...");
    const existingMenuItems = await db.select().from(menuItems);
    
    if (existingMenuItems.length > 0) {
      console.log(`⚠️  Found ${existingMenuItems.length} existing menu items. Updating image paths...`);
      
      // Update image paths for existing items
      for (const item of existingMenuItems) {
        const newImagePath = updateImagePath(item.image);
        if (newImagePath !== item.image) {
          await db.update(menuItems)
            .set({ image: newImagePath })
            .where(eq(menuItems.id, item.id));
          console.log(`  ✅ Updated image path for "${item.nameDE}": ${item.image} → ${newImagePath}`);
        }
      }
    } else {
      const menuItemsData = createMenuItems(categoryMap);
      const menuItemsWithUpdatedPaths = menuItemsData.map(item => ({
        ...item,
        image: updateImagePath(item.image),
      }));
      
      const insertedMenuItems = await db.insert(menuItems).values(menuItemsWithUpdatedPaths).returning();
      console.log(`✅ Inserted ${insertedMenuItems.length} menu items with updated image paths`);
      
      // Create variants for items that need them
      console.log("\n🔀 Creating product variants...");
      let variantCount = 0;
      
      for (const item of insertedMenuItems) {
        if (item.hasVariants === 1 && item.variantType === "base") {
          const baseVariants = createBaseVariants(item.id);
          await db.insert(productVariants).values(baseVariants);
          variantCount += baseVariants.length;
        } else if (item.hasVariants === 1 && item.variantType === "flavor") {
          const flavorVariants = createFritzKolaVariants(item.id);
          await db.insert(productVariants).values(flavorVariants);
          variantCount += flavorVariants.length;
        }
      }
      
      console.log(`✅ Created ${variantCount} product variants`);
    }
    
    // STEP 3: Migrate Ingredients
    console.log("\n🥗 STEP 3: Migrating Ingredients...");
    const existingIngredients = await db.select().from(ingredients);
    
    if (existingIngredients.length > 0) {
      console.log(`⚠️  Found ${existingIngredients.length} existing ingredients. Updating image paths...`);
      
      // Update image paths for existing ingredients
      for (const ingredient of existingIngredients) {
        if (ingredient.image) {
          const newImagePath = updateImagePath(ingredient.image);
          if (newImagePath !== ingredient.image) {
            await db.update(ingredients)
              .set({ image: newImagePath })
              .where(eq(ingredients.id, ingredient.id));
            console.log(`  ✅ Updated image path for "${ingredient.nameDE}": ${ingredient.image} → ${newImagePath}`);
          }
        }
      }
    } else {
      const ingredientsData = createIngredients();
      const ingredientsWithUpdatedPaths = ingredientsData.map(ingredient => ({
        ...ingredient,
        image: ingredient.image ? updateImagePath(ingredient.image) : ingredient.image,
      }));
      
      const insertedIngredients = await db.insert(ingredients).values(ingredientsWithUpdatedPaths).returning();
      console.log(`✅ Inserted ${insertedIngredients.length} ingredients with updated image paths`);
    }
    
    // STEP 4: Verification
    console.log("\n✅ STEP 4: Verification...");
    const finalCategories = await db.select().from(categories);
    const finalMenuItems = await db.select().from(menuItems);
    const finalIngredients = await db.select().from(ingredients);
    const finalVariants = await db.select().from(productVariants);
    
    console.log(`\n📊 Final counts:`);
    console.log(`   Categories: ${finalCategories.length}`);
    console.log(`   Menu Items: ${finalMenuItems.length}`);
    console.log(`   Ingredients: ${finalIngredients.length}`);
    console.log(`   Product Variants: ${finalVariants.length}`);
    
    console.log("\n🎉 Migration completed successfully!");
    
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
