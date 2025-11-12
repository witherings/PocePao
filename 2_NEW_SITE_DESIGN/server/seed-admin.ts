import { db } from "./db";
import { adminUsers } from "@shared/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function seedAdmin() {
  const username = process.env.ADMIN_USER || "admin";
  const password = process.env.ADMIN_PASS || "admin123";

  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if admin already exists
  const existing = await db.select().from(adminUsers).where(eq(adminUsers.username, username));

  if (existing.length > 0) {
    console.log(`✓ Admin user '${username}' already exists`);
    // Update password if it changed
    await db.update(adminUsers)
      .set({ password: hashedPassword })
      .where(eq(adminUsers.username, username));
    console.log(`✓ Admin password updated`);
  } else {
    await db.insert(adminUsers).values({
      username,
      password: hashedPassword,
    });
    console.log(`✓ Admin user '${username}' created`);
  }
}

seedAdmin()
  .then(() => {
    console.log("✅ Admin seeding complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  });
