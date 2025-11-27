import type { Express } from "express";
import { ensureAuthenticated } from "./auth";
import { getDb } from "./db";
import { 
  snapshots, 
  snapshotMenuItems,
  snapshotCategories,
  snapshotIngredients,
  snapshotGalleryImages, 
  snapshotStaticContent,
  menuItems,
  categories,
  ingredients,
  galleryImages,
  insertSnapshotSchema,
  type Category,
  type MenuItem,
  type Ingredient,
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
        try {
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
        } catch (err: any) {
          console.error("Error saving snapshot categories:", err.message);
          // Continue even if categories snapshot fails
        }
      }
      
      // Copy current ingredients (ALL fields for perfect fidelity)
      const currentIngredients = await db.select().from(ingredients);
      if (currentIngredients.length > 0) {
        try {
          await db.insert(snapshotIngredients).values(
            currentIngredients.map((ing: Ingredient) => ({
              snapshotId: snapshot.id,
              name: ing.name,
              nameDE: ing.nameDE,
              ingredientType: ing.type,
              description: ing.description,
              descriptionDE: ing.descriptionDE,
              image: ing.image,
              price: ing.price,
              priceSmall: ing.priceSmall,
              priceStandard: ing.priceStandard,
              extraPrice: ing.extraPrice, // Save extra price for extras
              available: ing.available,
              order: ing.order || 0,
              originalIngredientId: ing.id,
            }))
          );
        } catch (err: any) {
          console.error("Error saving snapshot ingredients:", err.message);
          // Continue even if ingredients snapshot fails
        }
      }
      
      // Copy current menu items (capturing ALL fields for perfect fidelity)
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
            priceSmall: item.priceSmall, // CRITICAL: Klein price for dual pricing
            image: item.image,
            categoryId: item.categoryId,
            available: item.available,
            popular: item.popular,
            protein: item.protein,
            marinade: item.marinade,
            ingredients: item.ingredients, // Array - preserved as-is
            sauce: item.sauce,
            toppings: item.toppings, // Array - preserved as-is
            allergens: item.allergens, // Array - preserved as-is
            hasSizeOptions: item.hasSizeOptions, // CRITICAL: Flag for size selection
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
      
      // Store static content from actual database
      const { staticContent } = await import("@shared/schema");
      const currentStaticContent = await db.select().from(staticContent);
      
      if (currentStaticContent.length > 0) {
        await db.insert(snapshotStaticContent).values(
          currentStaticContent.map((content: any) => ({
            snapshotId: snapshot.id,
            page: content.page,
            // Save complete static content row as JSON
            content: JSON.stringify({
              locale: content.locale,
              title: content.title,
              subtitle: content.subtitle,
              content: content.content, // This is already a string (plain text or JSON string)
              image: content.image,
            }),
          }))
        );
      } else {
        // Fallback to empty if no static content exists
        await db.insert(snapshotStaticContent).values([
          {
            snapshotId: snapshot.id,
            page: "about",
            content: JSON.stringify({ locale: "de", title: "", subtitle: "", content: "", image: "" }),
          },
          {
            snapshotId: snapshot.id,
            page: "contact",
            content: JSON.stringify({ locale: "de", title: "", subtitle: "", content: "", image: "" }),
          },
        ]);
      }
      
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
      
      const snapshotIngs = await db
        .select()
        .from(snapshotIngredients)
        .where(eq(snapshotIngredients.snapshotId, snapshotId));
      
      const snapshotItems = await db
        .select()
        .from(snapshotMenuItems)
        .where(eq(snapshotMenuItems.snapshotId, snapshotId));
      
      const snapshotGallery = await db
        .select()
        .from(snapshotGalleryImages)
        .where(eq(snapshotGalleryImages.snapshotId, snapshotId));
      
      const snapshotStatic = await db
        .select()
        .from(snapshotStaticContent)
        .where(eq(snapshotStaticContent.snapshotId, snapshotId));
      
      console.log(`Loaded snapshot data: ${snapshotCats.length} categories, ${snapshotIngs.length} ingredients, ${snapshotItems.length} items, ${snapshotGallery.length} gallery images, ${snapshotStatic.length} static pages`);
      
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
        const { staticContent } = await import("@shared/schema");
        
        // STEP 1: Delete all current live data
        // NOTE: order_items are preserved (they have ON DELETE SET NULL FK)
        // When menu items are deleted, order_items.menuItemId is set to NULL automatically
        await tx.delete(menuItems);
        await tx.delete(categories);
        await tx.delete(ingredients);
        await tx.delete(galleryImages);
        await tx.delete(staticContent);
        console.log("Cleared live tables (in transaction, orders preserved)");
        
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
        
        // STEP 2B: Copy ingredients to live (preserving original IDs)
        if (snapshotIngs.length > 0) {
          await tx.insert(ingredients).values(
            snapshotIngs.map((ing: any) => ({
              id: ing.originalIngredientId, // Use original ID to maintain references
              name: ing.name,
              nameDE: ing.nameDE,
              type: ing.ingredientType, // FIXED: Use ingredientType from snapshot
              description: ing.description,
              descriptionDE: ing.descriptionDE,
              image: ing.image,
              price: ing.price,
              priceSmall: ing.priceSmall,
              priceStandard: ing.priceStandard,
              extraPrice: ing.extraPrice, // Restore extra price for extras
              available: ing.available,
              order: ing.order || 0, // Add order field if missing
            }))
          );
          console.log(`Restored ${snapshotIngs.length} ingredients`);
        }
        
        // STEP 3: Copy menu items to live (restoring ALL fields with perfect fidelity)
        if (snapshotItems.length > 0) {
          await tx.insert(menuItems).values(
            snapshotItems.map((item: any) => ({
              name: item.name,
              nameDE: item.nameDE,
              description: item.description,
              descriptionDE: item.descriptionDE,
              price: item.price,
              priceSmall: item.priceSmall, // CRITICAL: Klein price restored
              image: item.image,
              categoryId: item.categoryId,
              available: item.available,
              popular: item.popular,
              protein: item.protein,
              marinade: item.marinade,
              ingredients: item.ingredients, // Arrays restored as-is
              sauce: item.sauce,
              toppings: item.toppings, // Arrays restored as-is
              allergens: item.allergens, // Arrays restored as-is
              hasSizeOptions: item.hasSizeOptions, // CRITICAL: Size options flag restored
              isCustomBowl: item.isCustomBowl,
            }))
          );
          console.log(`Restored ${snapshotItems.length} menu items with complete data`);
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
        
        // STEP 5: Restore static content (About/Contact pages)
        if (snapshotStatic.length > 0) {
          for (const staticItem of snapshotStatic) {
            const parsedContent = JSON.parse(staticItem.content);
            await tx.insert(staticContent).values({
              page: staticItem.page,
              locale: parsedContent.locale || 'de',
              title: parsedContent.title || null,
              subtitle: parsedContent.subtitle || null,
              content: parsedContent.content || '', // This is the original content value (string)
              image: parsedContent.image || null,
            });
          }
          console.log("Restored static content");
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

  // Download snapshot as ZIP with DB dump and media files
  app.get("/api/admin/snapshots/:id/download", ensureAuthenticated, async (req, res) => {
    try {
      const archiver = await import("archiver");
      const fs = await import("fs");
      const path = await import("path");
      
      const db = await getDb();
      const snapshotId = req.params.id;
      
      // Verify snapshot exists
      const [snapshot] = await db
        .select()
        .from(snapshots)
        .where(eq(snapshots.id, snapshotId))
        .limit(1);
      
      if (!snapshot) {
        return res.status(404).json({ error: "Snapshot not found" });
      }
      
      // Create ZIP archive
      const archive = archiver.default("zip", { zlib: { level: 9 } });
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", `attachment; filename="pokepao-snapshot-${snapshotId}.zip"`);
      
      archive.pipe(res);
      
      // Add database dump
      try {
        const snapshotCats = await db
          .select()
          .from(snapshotCategories)
          .where(eq(snapshotCategories.snapshotId, snapshotId));
        
        const snapshotIngs = await db
          .select()
          .from(snapshotIngredients)
          .where(eq(snapshotIngredients.snapshotId, snapshotId));
        
        const snapshotItems = await db
          .select()
          .from(snapshotMenuItems)
          .where(eq(snapshotMenuItems.snapshotId, snapshotId));
        
        const snapshotGallery = await db
          .select()
          .from(snapshotGalleryImages)
          .where(eq(snapshotGalleryImages.snapshotId, snapshotId));
        
        const snapshotStatic = await db
          .select()
          .from(snapshotStaticContent)
          .where(eq(snapshotStaticContent.snapshotId, snapshotId));
        
        // Generate SQL dump
        let sqlDump = "-- PokePao Snapshot Export\n";
        sqlDump += `-- Created: ${new Date().toISOString()}\n\n`;
        
        if (snapshotCats.length > 0) {
          sqlDump += "-- Categories\n";
          snapshotCats.forEach((cat: any) => {
            sqlDump += `INSERT INTO categories (id, name, name_de, icon, \`order\`) VALUES ('${cat.originalCategoryId}', '${cat.name}', '${cat.nameDE}', '${cat.icon}', ${cat.order});\n`;
          });
          sqlDump += "\n";
        }
        
        if (snapshotIngs.length > 0) {
          sqlDump += "-- Ingredients\n";
          snapshotIngs.forEach((ing: any) => {
            const price = ing.price ? parseFloat(String(ing.price)) : 0;
            const extraPrice = ing.extraPrice ? parseFloat(String(ing.extraPrice)) : 0;
            sqlDump += `INSERT INTO ingredients (id, name, name_de, type, price, extra_price) VALUES ('${ing.originalIngredientId}', '${ing.name}', '${ing.nameDE}', '${ing.ingredientType}', ${price}, ${extraPrice});\n`;
          });
          sqlDump += "\n";
        }
        
        archive.append(sqlDump, { name: "db_dump.sql" });
      } catch (err) {
        console.warn("Could not generate SQL dump:", err);
      }
      
      // Add media files from public/media
      const mediaPath = path.resolve(process.cwd(), "public", "media");
      if (fs.existsSync(mediaPath)) {
        archive.directory(mediaPath, "media");
      }
      
      // Add menu images from public/images
      const imagesPath = path.resolve(process.cwd(), "public", "images");
      if (fs.existsSync(imagesPath)) {
        archive.directory(imagesPath, "images");
      }
      
      archive.finalize();
      
    } catch (error: any) {
      console.error("Error downloading snapshot:", error);
      res.status(500).json({ error: "Failed to download snapshot" });
    }
  });
