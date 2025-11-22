import { getDb } from "./db";
import { categories, menuItems, ingredients, adminUsers } from "@shared/schema";
import bcrypt from "bcryptjs";

async function seedDatabase() {
  try {
    const db = await getDb();
    console.log("🌱 Starting database seeding...");

    // Create admin user first
    console.log("👤 Creating admin user...");
    const hashedPassword = await bcrypt.hash("mk509918", 10);
    
    const existingAdmin = await db.select().from(adminUsers).limit(1);
    if (existingAdmin.length === 0) {
      await db.insert(adminUsers).values({
        username: "admin",
        password: hashedPassword,
      });
      console.log("✅ Admin user created (username: admin, password: mk509918)");
    } else {
      console.log("✅ Admin user already exists");
    }

    // Check if data already exists
    const existingCategories = await db.select().from(categories).limit(1);
    if (existingCategories.length > 0) {
      console.log("⚠️ Database already has data. Skipping seed.");
      process.exit(0);
    }

    // Seed Categories
    console.log("📁 Creating categories...");
    const [pokeBowls, signatures, drinks, extras] = await db.insert(categories).values([
      { name: "Poke Bowls", nameDE: "Poke Bowls", icon: "🥗", order: 1 },
      { name: "Signature Bowls", nameDE: "Signature Bowls", icon: "⭐", order: 2 },
      { name: "Drinks", nameDE: "Getränke", icon: "🥤", order: 3 },
      { name: "Extras", nameDE: "Extras", icon: "🍱", order: 4 },
    ]).returning();

    console.log("✅ Categories created");

    // Seed Menu Items
    console.log("🍜 Creating menu items...");
    
    await db.insert(menuItems).values([
      // Signature Bowls
      {
        name: "Classic Hawaiian",
        nameDE: "Klassisch Hawaiianisch",
        description: "Traditional poke bowl with fresh salmon, sushi rice, edamame, cucumber, avocado",
        descriptionDE: "Traditionelle Poke Bowl mit frischem Lachs, Sushi-Reis, Edamame, Gurke, Avocado",
        price: "12.90",
        image: "/media/poke-1.jpg",
        categoryId: signatures.id,
        available: 1,
        popular: 1,
        protein: "Salmon",
        ingredients: ["Sushi Rice", "Edamame", "Cucumber", "Avocado", "Seaweed"],
        sauce: "Soy Sauce",
        toppings: ["Sesame Seeds", "Green Onion"],
        allergens: ["Fish", "Soy", "Sesame"],
      },
      {
        name: "Spicy Tuna",
        nameDE: "Scharfer Thunfisch",
        description: "Spicy tuna with brown rice, mango, jalapeño, red cabbage, crispy onions",
        descriptionDE: "Scharfer Thunfisch mit braunem Reis, Mango, Jalapeño, Rotkohl, knusprigen Zwiebeln",
        price: "13.90",
        image: "/media/poke-2.jpg",
        categoryId: signatures.id,
        available: 1,
        popular: 1,
        protein: "Tuna",
        marinade: "Spicy Mayo",
        ingredients: ["Brown Rice", "Mango", "Jalapeño", "Red Cabbage"],
        sauce: "Spicy Mayo",
        toppings: ["Crispy Onions", "Chili Flakes"],
        allergens: ["Fish", "Soy", "Gluten"],
      },
      {
        name: "Vegan Paradise",
        nameDE: "Veganes Paradies",
        description: "Plant-based bowl with tofu, quinoa, sweet potato, kale, cherry tomatoes",
        descriptionDE: "Pflanzliche Bowl mit Tofu, Quinoa, Süßkartoffel, Grünkohl, Kirschtomaten",
        price: "11.90",
        image: "/media/poke-3.jpg",
        categoryId: signatures.id,
        available: 1,
        popular: 0,
        protein: "Tofu",
        ingredients: ["Quinoa", "Sweet Potato", "Kale", "Cherry Tomatoes", "Chickpeas"],
        sauce: "Tahini Dressing",
        toppings: ["Pumpkin Seeds", "Nutritional Yeast"],
        allergens: ["Soy", "Sesame"],
      },
      {
        name: "Build Your Own Bowl",
        nameDE: "Wunsch Bowl",
        description: "Create your perfect poke bowl - choose your base, protein, toppings and sauce",
        descriptionDE: "Kreiere deine perfekte Poke Bowl - wähle deine Basis, Protein, Toppings und Sauce",
        price: "14.75", // Standard price
        priceSmall: "9.90", // Klein price (optional)
        image: "/media/custom-bowl.jpg",
        categoryId: pokeBowls.id,
        available: 1,
        popular: 1,
        hasSizeOptions: 1,
        isCustomBowl: 1,
      },
      
      // Drinks
      {
        name: "Fresh Orange Juice",
        nameDE: "Frischer Orangensaft",
        description: "Freshly squeezed orange juice",
        descriptionDE: "Frisch gepresster Orangensaft",
        price: "4.50",
        image: "/media/orange-juice.jpg",
        categoryId: drinks.id,
        available: 1,
      },
      {
        name: "Green Smoothie",
        nameDE: "Grüner Smoothie",
        description: "Spinach, banana, mango, coconut water",
        descriptionDE: "Spinat, Banane, Mango, Kokoswasser",
        price: "5.90",
        image: "/media/green-smoothie.jpg",
        categoryId: drinks.id,
        available: 1,
      },
      {
        name: "Sparkling Water",
        nameDE: "Sprudelwasser",
        description: "500ml bottle",
        descriptionDE: "500ml Flasche",
        price: "2.50",
        image: "/media/water.jpg",
        categoryId: drinks.id,
        available: 1,
      },
      
      // Extras
      {
        name: "Extra Salmon",
        nameDE: "Extra Lachs",
        description: "Additional portion of fresh salmon",
        descriptionDE: "Zusätzliche Portion frischer Lachs",
        price: "4.00",
        image: "/media/salmon.jpg",
        categoryId: extras.id,
        available: 1,
        allergens: ["Fish"],
      },
      {
        name: "Avocado",
        nameDE: "Avocado",
        description: "Fresh sliced avocado",
        descriptionDE: "Frisch geschnittene Avocado",
        price: "2.50",
        image: "/media/avocado.jpg",
        categoryId: extras.id,
        available: 1,
      },
    ]);

    console.log("✅ Menu items created");

    // Seed Ingredients for Custom Bowls
    console.log("🥘 Creating ingredients...");
    
    await db.insert(ingredients).values([
      // Proteins
      { name: "Salmon", nameDE: "Lachs", type: "protein", image: "/media/ing-salmon.jpg", price: "4.00", order: 1 },
      { name: "Tuna", nameDE: "Thunfisch", type: "protein", image: "/media/ing-tuna.jpg", price: "4.50", order: 2 },
      { name: "Shrimp", nameDE: "Garnelen", type: "protein", image: "/media/ing-shrimp.jpg", price: "5.00", order: 3 },
      { name: "Tofu", nameDE: "Tofu", type: "protein", image: "/media/ing-tofu.jpg", price: "3.00", order: 4 },
      
      // Bases
      { name: "Sushi Rice", nameDE: "Sushi Reis", type: "base", image: "/media/ing-sushi-rice.jpg", order: 1 },
      { name: "Brown Rice", nameDE: "Brauner Reis", type: "base", image: "/media/ing-brown-rice.jpg", order: 2 },
      { name: "Quinoa", nameDE: "Quinoa", type: "base", image: "/media/ing-quinoa.jpg", order: 3 },
      { name: "Mixed Greens", nameDE: "Gemischter Salat", type: "base", image: "/media/ing-greens.jpg", order: 4 },
      
      // Marinades
      { name: "Classic Soy", nameDE: "Klassische Soja", type: "marinade", image: "/media/ing-soy.jpg", order: 1 },
      { name: "Spicy Mayo", nameDE: "Scharfe Mayo", type: "marinade", image: "/media/ing-spicy-mayo.jpg", order: 2 },
      { name: "Sesame Oil", nameDE: "Sesamöl", type: "marinade", image: "/media/ing-sesame.jpg", order: 3 },
      
      // Fresh Ingredients
      { name: "Edamame", nameDE: "Edamame", type: "fresh", image: "/media/ing-edamame.jpg", order: 1 },
      { name: "Cucumber", nameDE: "Gurke", type: "fresh", image: "/media/ing-cucumber.jpg", order: 2 },
      { name: "Avocado", nameDE: "Avocado", type: "fresh", image: "/media/ing-avocado.jpg", order: 3 },
      { name: "Mango", nameDE: "Mango", type: "fresh", image: "/media/ing-mango.jpg", order: 4 },
      { name: "Seaweed", nameDE: "Seetang", type: "fresh", image: "/media/ing-seaweed.jpg", order: 5 },
      { name: "Cherry Tomatoes", nameDE: "Kirschtomaten", type: "fresh", image: "/media/ing-tomatoes.jpg", order: 6 },
      
      // Sauces
      { name: "Soy Sauce", nameDE: "Sojasauce", type: "sauce", image: "/media/ing-soy-sauce.jpg", order: 1 },
      { name: "Ponzu", nameDE: "Ponzu", type: "sauce", image: "/media/ing-ponzu.jpg", order: 2 },
      { name: "Tahini", nameDE: "Tahini", type: "sauce", image: "/media/ing-tahini.jpg", order: 3 },
      
      // Toppings
      { name: "Sesame Seeds", nameDE: "Sesamsamen", type: "topping", image: "/media/ing-sesame-seeds.jpg", order: 1 },
      { name: "Green Onion", nameDE: "Frühlingszwiebel", type: "topping", image: "/media/ing-green-onion.jpg", order: 2 },
      { name: "Crispy Onions", nameDE: "Knusprige Zwiebeln", type: "topping", image: "/media/ing-crispy-onion.jpg", order: 3 },
      { name: "Nori Strips", nameDE: "Nori Streifen", type: "topping", image: "/media/ing-nori.jpg", order: 4 },
    ]);

    console.log("✅ Ingredients created");
    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log("   - Admin user: ✓");
    console.log("   - Categories: 4");
    console.log("   - Menu items: 9");
    console.log("   - Ingredients: 23");
    console.log("\n🔐 Admin login:");
    console.log("   Username: admin");
    console.log("   Password: mk509918");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
