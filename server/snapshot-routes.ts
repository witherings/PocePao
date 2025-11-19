import type { Express } from "express";
import { ensureAuthenticated } from "./auth";
import { getDb } from "./db";
import { 
  snapshots, 
  snapshotMenuItems,
  snapshotCategories,
  snapshotGalleryImages, 
  snapshotStaticContent,
  menuItems,
  categories,
  galleryImages,
  insertSnapshotSchema,
  type Category,
  type MenuItem,
  type GalleryImage,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export function registerSnapshotRoutes(app: Express) {
  
  // Get all snapshots
  app.get("/api/admin/snapshots", ensureAuthenticated, async (req, res) => {
    try {
      const db = await getDb();
      
      const allSnapshots = await db
        .select()
        .from(snapshots)
        .orderBy(desc(snapshots.createdAt));
      
      res.json(allSnapshots);
    } catch (error: any) {
      console.error("Error fetching snapshots:", error);
      res.status(500).json({ error: "Failed to fetch snapshots" });
    }
  });

  // Create new snapshot (save current state)
  app.post("/api/admin/snapshots", ensureAuthenticated, async (req, res) => {
    try {
      const db = await getDb();
      
      const data = insertSnapshotSchema.parse(req.body);
      const user = req.user as any;
      
      // Create snapshot
      const [snapshot] = await db
        .insert(snapshots)
        .values({
          name: data.name,
          description: data.description,
          createdBy: user.id,
        })
        .returning();
      
      // Copy current categories
      const currentCategories = await db.select().from(categories);
      if (currentCategories.length > 0) {
        await db.insert(snapshotCategories).values(
          currentCategories.map((cat: Category) => ({
            snapshotId: snapshot.id,
            name: cat.name,
            nameDE: cat.nameDE,
            icon: cat.icon,
            order: cat.order,
            originalCategoryId: cat.id,
          }))
        );
      }
      
      // Copy current menu items
      const currentMenuItems = await db.select().from(menuItems);
      if (currentMenuItems.length > 0) {
        await db.insert(snapshotMenuItems).values(
          currentMenuItems.map((item: MenuItem) => ({
            snapshotId: snapshot.id,
            name: item.name,
            nameDE: item.nameDE,
            description: item.description,
            descriptionDE: item.descriptionDE,
            price: item.price,
            priceSmall: item.priceSmall,
            priceLarge: item.priceLarge,
            image: item.image,
            categoryId: item.categoryId,
            available: item.available,
            popular: item.popular,
            protein: item.protein,
            marinade: item.marinade,
            ingredients: item.ingredients,
            sauce: item.sauce,
            toppings: item.toppings,
            allergens: item.allergens,
            hasSizeOptions: item.hasSizeOptions,
            isCustomBowl: item.isCustomBowl,
          }))
        );
      }
      
      // Copy current gallery images
      const currentGalleryImages = await db.select().from(galleryImages);
      if (currentGalleryImages.length > 0) {
        await db.insert(snapshotGalleryImages).values(
          currentGalleryImages.map((img: GalleryImage) => ({
            snapshotId: snapshot.id,
            url: img.url,
            filename: img.filename,
            caption: null,
          }))
        );
      }
      
      // Store static content (placeholder - you can expand this later)
      await db.insert(snapshotStaticContent).values([
        {
          snapshotId: snapshot.id,
          page: "about",
          content: JSON.stringify({ text: "", heroImage: "" }),
        },
        {
          snapshotId: snapshot.id,
          page: "contact",
          content: JSON.stringify({ address: "", phone: "", hours: "" }),
        },
      ]);
      
      res.json(snapshot);
    } catch (error: any) {
      console.error("Error creating snapshot:", error);
      res.status(400).json({ error: error.message || "Failed to create snapshot" });
    }
  });

  // Restore a snapshot (restore live tables from snapshot data)
  // CRITICAL: Uses transaction to prevent data loss
  app.post("/api/admin/snapshots/:id/restore", ensureAuthenticated, async (req, res) => {
    try {
      const db = await getDb();
      
      const snapshotId = req.params.id;
      
      // Verify snapshot exists BEFORE starting transaction
      const snapshot = await db
        .select()
        .from(snapshots)
        .where(eq(snapshots.id, snapshotId))
        .limit(1);
      
      if (snapshot.length === 0) {
        return res.status(404).json({ error: "Snapshot not found" });
      }
      
      console.log(`Restoring snapshot ${snapshotId}...`);
      
      // Load snapshot data BEFORE starting transaction to validate it exists
      const snapshotCats = await db
        .select()
        .from(snapshotCategories)
        .where(eq(snapshotCategories.snapshotId, snapshotId));
      
      const snapshotItems = await db
        .select()
        .from(snapshotMenuItems)
        .where(eq(snapshotMenuItems.snapshotId, snapshotId));
      
      const snapshotGallery = await db
        .select()
        .from(snapshotGalleryImages)
        .where(eq(snapshotGalleryImages.snapshotId, snapshotId));
      
      console.log(`Loaded snapshot data: ${snapshotCats.length} categories, ${snapshotItems.length} items, ${snapshotGallery.length} gallery images`);
      
      // CRITICAL VALIDATION: Ensure snapshot data integrity BEFORE transaction
      if (snapshotCats.length === 0) {
        return res.status(400).json({ error: "Snapshot has no categories - cannot publish incomplete snapshot" });
      }
      
      // Validate all menu items reference existing categories in this snapshot
      const categoryIds = new Set(snapshotCats.map((cat: any) => cat.originalCategoryId));
      const invalidItems = snapshotItems.filter((item: any) => !categoryIds.has(item.categoryId));
      
      if (invalidItems.length > 0) {
        console.error(`Found ${invalidItems.length} menu items with invalid category references:`, 
          invalidItems.map((item: any) => ({ name: item.name, categoryId: item.categoryId }))
        );
        return res.status(400).json({ 
          error: `Snapshot contains ${invalidItems.length} menu items with invalid category references - cannot publish corrupted snapshot` 
        });
      }
      
      console.log("✓ Snapshot validation passed - all references are valid")
      
      // Execute publish in a TRANSACTION - all-or-nothing atomicity
      await db.transaction(async (tx: any) => {
        // STEP 1: Delete all current live data
        await tx.delete(menuItems);
        await tx.delete(categories);
        await tx.delete(galleryImages);
        console.log("Cleared live tables (in transaction)");
        
        // STEP 2: Copy categories to live (preserving original IDs)
        await tx.insert(categories).values(
          snapshotCats.map((cat: any) => ({
            id: cat.originalCategoryId, // Use original ID to maintain references
            name: cat.name,
            nameDE: cat.nameDE,
            icon: cat.icon,
            order: cat.order,
          }))
        );
        console.log("Restored categories");
        
        // STEP 3: Copy menu items to live
        if (snapshotItems.length > 0) {
          await tx.insert(menuItems).values(
            snapshotItems.map((item: any) => ({
              name: item.name,
              nameDE: item.nameDE,
              description: item.description,
              descriptionDE: item.descriptionDE,
              price: item.price,
              priceSmall: item.priceSmall,
              priceLarge: item.priceLarge,
              image: item.image,
              categoryId: item.categoryId,
              available: item.available,
              popular: item.popular,
              protein: item.protein,
              marinade: item.marinade,
              ingredients: item.ingredients,
              sauce: item.sauce,
              toppings: item.toppings,
              allergens: item.allergens,
              hasSizeOptions: item.hasSizeOptions,
              isCustomBowl: item.isCustomBowl,
            }))
          );
          console.log("Restored menu items");
        }
        
        // STEP 4: Copy gallery to live (note: galleryImages schema doesn't have caption field in live table)
        if (snapshotGallery.length > 0) {
          await tx.insert(galleryImages).values(
            snapshotGallery.map((img: any) => ({
              url: img.url,
              filename: img.filename,
            }))
          );
          console.log("Restored gallery images");
        }
        
      });
      
      console.log(`✅ Snapshot ${snapshotId} restored successfully (transaction committed)`);
      res.json({ success: true, snapshotId });
    } catch (error: any) {
      console.error("❌ Error restoring snapshot (transaction rolled back):", error);
      res.status(500).json({ error: "Failed to restore snapshot: " + error.message });
    }
  });

  // Get snapshot details with all content
  app.get("/api/admin/snapshots/:id", ensureAuthenticated, async (req, res) => {
    try {
      const db = await getDb();
      
      const snapshotId = req.params.id;
      
      const [snapshot] = await db
        .select()
        .from(snapshots)
        .where(eq(snapshots.id, snapshotId))
        .limit(1);
      
      if (!snapshot) {
        return res.status(404).json({ error: "Snapshot not found" });
      }
      
      // Get all content for this snapshot
      const menuItemsData = await db
        .select()
        .from(snapshotMenuItems)
        .where(eq(snapshotMenuItems.snapshotId, snapshotId));
      
      const galleryData = await db
        .select()
        .from(snapshotGalleryImages)
        .where(eq(snapshotGalleryImages.snapshotId, snapshotId));
      
      const staticContentData = await db
        .select()
        .from(snapshotStaticContent)
        .where(eq(snapshotStaticContent.snapshotId, snapshotId));
      
      res.json({
        snapshot,
        menuItems: menuItemsData,
        gallery: galleryData,
        staticContent: staticContentData,
      });
    } catch (error: any) {
      console.error("Error fetching snapshot details:", error);
      res.status(500).json({ error: "Failed to fetch snapshot details" });
    }
  });

  // Delete a snapshot
  app.delete("/api/admin/snapshots/:id", ensureAuthenticated, async (req, res) => {
    try {
      const db = await getDb();
      
      const snapshotId = req.params.id;
      
      // Delete snapshot (cascade will delete related items)
      await db
        .delete(snapshots)
        .where(eq(snapshots.id, snapshotId));
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting snapshot:", error);
      res.status(500).json({ error: "Failed to delete snapshot" });
    }
  });
}
