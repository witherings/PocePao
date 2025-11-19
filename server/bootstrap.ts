import { getDb } from "./db";
import { adminUsers } from "@shared/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

const FIXED_ADMIN_USERNAME = "admin";
const FIXED_ADMIN_PASSWORD = "mk509918";

export async function ensureAdminExists() {
  try {
    const db = await getDb();
    const existingAdmins = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, FIXED_ADMIN_USERNAME))
      .limit(1);

    if (existingAdmins.length > 0) {
      console.log("✅ Admin user already exists");
      return;
    }

    console.log("🔐 Creating default admin user...");
    const hashedPassword = await bcrypt.hash(FIXED_ADMIN_PASSWORD, 10);

    await db.insert(adminUsers).values({
      username: FIXED_ADMIN_USERNAME,
      password: hashedPassword,
    });

    console.log("✅ Admin user created successfully!");
    console.log(`   Username: ${FIXED_ADMIN_USERNAME}`);
    console.log("   Password: ********");
  } catch (error) {
    console.error("❌ Error ensuring admin exists:", error);
  }
}
