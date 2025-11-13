import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "@shared/schema";
import { galleryImages as galleryTable } from "@shared/schema";
import ws from 'ws';

async function seedGallery() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not set");
    process.exit(1);
  }

  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool, schema });

  try {
    console.log("🖼️  Adding gallery images...\n");

    const galleryData = [
      { url: "/images/gallery-1.png", filename: "Gallery Image 1" },
      { url: "/images/gallery-2.png", filename: "Gallery Image 2" },
      { url: "/images/gallery-3.png", filename: "Gallery Image 3" },
    ];

    const created = await db.insert(galleryTable).values(galleryData).returning();
    console.log(`✅ Added ${created.length} gallery images\n`);

    console.log("✨ Gallery seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding gallery:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedGallery();
