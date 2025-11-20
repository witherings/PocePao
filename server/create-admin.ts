import { getDb } from "./db";
import { adminUsers } from "@shared/schema";
import bcrypt from 'bcryptjs';

async function createAdmin() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not set. Make sure the database is provisioned.");
    process.exit(1);
  }

  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';  // Default password for Railway
  
  const isDefaultPassword = !process.env.ADMIN_PASSWORD;

  try {
    console.log("🔐 Creating admin user...\n");

    const db = await getDb();
    const existingAdmins = await db.select().from(adminUsers);
    
    if (existingAdmins.length > 0) {
      console.log("⚠️  Admin user already exists. Skipping admin creation.");
      console.log("   Username:", existingAdmins[0].username);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await db.insert(adminUsers).values({
      username: adminUsername,
      password: hashedPassword,
    });

    console.log("✅ Admin user created successfully!");
    console.log(`   Username: ${adminUsername}`);
    console.log(`   Password: ${adminPassword.replace(/./g, '*')}`);
    
    if (isDefaultPassword) {
      console.log("\n⚠️  WARNING: Using default password 'admin123'");
      console.log("   🔒 PLEASE CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN!");
      console.log("   To set a custom password, add ADMIN_PASSWORD environment variable.");
    } else {
      console.log("\n🔒 Please save your credentials securely and delete this message from your terminal history.");
    }
    
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }

  process.exit(0);
}

createAdmin();
