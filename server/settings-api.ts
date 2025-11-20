import { Express } from "express";
import { db } from "./db";
import { appSettings } from "@shared/schema";
import { eq } from "drizzle-orm";

export function registerSettingsRoutes(app: Express) {
  // Get settings
  app.get("/api/settings", async (req, res) => {
    const settings = await db.select().from(appSettings).limit(1);
    if (settings.length === 0) {
      // Create default settings if none exist
      const [newSettings] = await db.insert(appSettings).values({ maintenanceMode: 0 }).returning();
      return res.json(newSettings);
    }
    res.json(settings[0]);
  });

  // Update settings (admin only)
  app.put("/api/admin/settings", async (req, res) => {
    const { maintenanceMode } = req.body;
    
    const settings = await db.select().from(appSettings).limit(1);
    if (settings.length === 0) {
      const [newSettings] = await db.insert(appSettings).values({ maintenanceMode }).returning();
      return res.json(newSettings);
    }
    
    const [updated] = await db.update(appSettings).set({ maintenanceMode }).where(eq(appSettings.id, 1)).returning();
    res.json(updated);
  });
}
