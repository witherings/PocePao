import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "@shared/schema";
import { staticContent as staticContentTable } from "@shared/schema";
import ws from 'ws';

async function seedStaticContent() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not set");
    process.exit(1);
  }

  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool, schema });

  try {
    console.log("📄 Adding static content...\n");

    const aboutContent = `Bei PokePao bringen wir die authentische hawaiianische Poke Bowl-Kultur nach Hamburg. Unsere Reise begann mit der Leidenschaft für frische, gesunde und unglaublich leckere Bowls.

Jede Bowl wird mit Liebe und Sorgfalt zubereitet. Wir verwenden nur die frischesten Zutaten und folgen traditionellen Rezepten, die wir mit modernen Geschmacksnoten verfeinern.

Heute sind wir stolz darauf, als eine der besten Poke Bowl Restaurants in Deutschland anerkannt zu sein. Aber für uns zählt vor allem eins: dass jeder Gast mit einem Lächeln unser Restaurant verlässt.`;

    const contactContent = JSON.stringify({
      phone: "040 36939098",
      address: "Fuhlsbüttler Straße 328, Hamburg",
      hours: "Mo-So: 11:15 - 21:00"
    });

    const contentData = [
      {
        page: "about",
        locale: "de",
        title: "Über Uns",
        subtitle: "Unsere Geschichte und Leidenschaft",
        content: aboutContent,
        image: "/images/vitamins-bowl.png"
      },
      {
        page: "contact",
        locale: "de",
        title: "Kontakt",
        subtitle: "Wir freuen uns auf deinen Besuch!",
        content: contactContent,
        image: null
      }
    ];

    for (const content of contentData) {
      await db.insert(staticContentTable).values(content).onConflictDoNothing();
    }

    console.log(`✅ Added ${contentData.length} static content pages\n`);
    console.log("✨ Static content seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding static content:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedStaticContent();
