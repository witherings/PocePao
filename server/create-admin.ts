import { getDb } from "./db";
import { adminUsers } from "@shared/schema";
import bcrypt from 'bcryptjs';

async function createAdmin() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not set. Make sure the database is provisioned.");
    process.exit(1);
  }

  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("❌ ADMIN_PASSWORD not set. Please provide a password for the admin user.");
    console.error("   Usage: ADMIN_PASSWORD=your_secure_password npm run db:create-admin");
    process.exit(1);
  }

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
    console.log("\n🔒 Please save your credentials securely and delete this message from your terminal history.");
    
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }

  process.exit(0);
}

createAdmin();
