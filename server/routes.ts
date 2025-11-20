import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReservationSchema, insertGalleryImageSchema, insertOrderSchema, insertOrderItemSchema, insertIngredientSchema, insertCategorySchema, insertMenuItemSchema } from "@shared/schema";
import { notificationService } from "./notifications";
import { registerAdminRoutes } from "./admin-routes";
import { registerSnapshotRoutes } from "./snapshot-routes";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  // For Railway production: use persistent volume mounted at /data or UPLOAD_DIR env variable
  // Development: falls back to local uploads directory
  const uploadDir = process.env.UPLOAD_DIR || 
                    (process.env.NODE_ENV === 'production' ? '/data/uploads' : path.join(process.cwd(), "uploads"));
  
  // Ensure upload directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  const upload = multer({
    storage: multer.diskStorage({
      destination: uploadDir,
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      }
      cb(new Error("Only image files are allowed"));
    },
  });

  // Categories CRUD
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error: any) {
      console.error("❌ Error fetching categories:", error);
      console.error("Stack:", error.stack);
      res.status(500).json({ error: "Failed to fetch categories", details: error.message });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const data = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(data);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create category" });
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, data);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteCategory(id);
      if (!deleted) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to delete category" });
    }
  });

  // Menu Items CRUD
  app.get("/api/menu-items", async (req, res) => {
    try {
      const menuItems = await storage.getAllMenuItems();
      res.json(menuItems);
    } catch (error: any) {
      console.error("❌ Error fetching menu items:", error);
      console.error("Stack:", error.stack);
      res.status(500).json({ error: "Failed to fetch menu items", details: error.message });
    }
  });

  app.get("/api/menu-items/category/:categoryId", async (req, res) => {
    try {
      const { categoryId } = req.params;
      const menuItems = await storage.getMenuItemsByCategory(categoryId);
      res.json(menuItems);
    } catch (error: any) {
      console.error("❌ Error fetching menu items by category:", error);
      console.error("Stack:", error.stack);
      res.status(500).json({ error: "Failed to fetch menu items", details: error.message });
    }
  });

  app.get("/api/menu-items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const menuItem = await storage.getMenuItemById(id);
      
      if (!menuItem) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      
      res.json(menuItem);
    } catch (error: any) {
      console.error("❌ Error fetching menu item:", error);
      console.error("Stack:", error.stack);
      res.status(500).json({ error: "Failed to fetch menu item", details: error.message });
    }
  });

  app.post("/api/menu-items", async (req, res) => {
    try {
      const data = insertMenuItemSchema.parse(req.body);
      const menuItem = await storage.createMenuItem(data);
      res.status(201).json(menuItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create menu item" });
    }
  });

  app.put("/api/menu-items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertMenuItemSchema.partial().parse(req.body);
      const menuItem = await storage.updateMenuItem(id, data);
      if (!menuItem) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(menuItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to update menu item" });
    }
  });

  app.delete("/api/menu-items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteMenuItem(id);
      if (!deleted) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to delete menu item" });
    }
  });

  // Reservations
  app.get("/api/reservations", async (req, res) => {
    try {
      const reservations = await storage.getAllReservations();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reservations" });
    }
  });

  app.post("/api/reservations", async (req, res) => {
    try {
      const validatedData = insertReservationSchema.parse(req.body);
      const reservation = await storage.createReservation(validatedData);
      
      // Send notification to restaurant (non-blocking - don't fail reservation if notification fails)
      try {
        await notificationService.sendReservationNotification(reservation);
      } catch (notificationError) {
        console.error('⚠️  Telegram notification failed, but reservation was created:', notificationError);
        // Reservation is still created successfully even if notification fails
      }
      
      res.status(201).json(reservation);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid reservation data" });
      }
      res.status(500).json({ error: "Failed to create reservation" });
    }
  });

  // General image upload endpoint
  app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      res.status(200).json({
        url: `/uploads/${req.file.filename}`,
        filename: req.file.originalname,
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // Gallery Images
  app.get("/api/gallery", async (req, res) => {
    try {
      const images = await storage.getAllGalleryImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gallery images" });
    }
  });

  app.post("/api/gallery", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const imageData = {
        url: `/uploads/${req.file.filename}`,
        filename: req.body.filename || req.file.originalname,
      };

      const validatedData = insertGalleryImageSchema.parse(imageData);
      const image = await storage.createGalleryImage(validatedData);
      res.status(201).json(image);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid gallery image data" });
      }
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  app.delete("/api/gallery/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedImage = await storage.deleteGalleryImage(id);
      
      if (!deletedImage) {
        return res.status(404).json({ error: "Image not found" });
      }

      // Delete the file from disk if it exists
      if (deletedImage.url.startsWith('/images/') || deletedImage.url.startsWith('/uploads/')) {
        const filePath = path.join(process.cwd(), 'public', deletedImage.url);
        try {
          await fs.unlink(filePath);
          console.log(`🗑️ Deleted file: ${filePath}`);
        } catch (err) {
          console.warn(`⚠️ Could not delete file ${filePath}:`, err);
        }
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete image" });
    }
  });

  // Static Content (for About, Contact pages)
  app.get("/api/static-content", async (req, res) => {
    try {
      const contents = await storage.getAllStaticContent();
      res.json(contents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch static content" });
    }
  });

  app.get("/api/static-content/:page", async (req, res) => {
    try {
      const { page } = req.params;
      const locale = (req.query.locale as string) || 'de';
      const content = await storage.getStaticContentByPage(page, locale);
      
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch static content" });
    }
  });

  app.put("/api/static-content/:page", upload.single("image"), async (req, res) => {
    try {
      const { page } = req.params;
      let imageUrl = req.body.image;
      
      // If a new image was uploaded, use its URL
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }
      
      const contentData = { ...req.body, page, image: imageUrl };
      const content = await storage.upsertStaticContent(contentData);
      res.json(content);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to save static content" });
    }
  });

  app.delete("/api/static-content/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteStaticContent(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to delete static content" });
    }
  });

  // Ingredients
  app.get("/api/ingredients", async (req, res) => {
    try {
      const ingredients = await storage.getAllIngredients();
      res.json(ingredients);
    } catch (error: any) {
      console.error("❌ Error fetching ingredients:", error);
      console.error("Stack:", error.stack);
      res.status(500).json({ error: "Failed to fetch ingredients", details: error.message });
    }
  });

  app.get("/api/ingredients/type/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const ingredients = await storage.getIngredientsByType(type);
      res.json(ingredients);
    } catch (error: any) {
      console.error("❌ Error fetching ingredients by type:", error);
      console.error("Stack:", error.stack);
      res.status(500).json({ error: "Failed to fetch ingredients by type", details: error.message });
    }
  });

  app.post("/api/ingredients", async (req, res) => {
    try {
      const data = insertIngredientSchema.parse(req.body);
      const ingredient = await storage.createIngredient(data);
      res.status(201).json(ingredient);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create ingredient" });
    }
  });

  app.put("/api/ingredients/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertIngredientSchema.partial().parse(req.body);
      const ingredient = await storage.updateIngredient(id, data);
      if (!ingredient) {
        return res.status(404).json({ error: "Ingredient not found" });
      }
      res.json(ingredient);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to update ingredient" });
    }
  });

  app.delete("/api/ingredients/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteIngredient(id);
      if (!deleted) {
        return res.status(404).json({ error: "Ingredient not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to delete ingredient" });
    }
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrderById(id);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      const orderItems = await storage.getOrderItemsByOrderId(id);
      res.json({ ...order, items: orderItems });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const { items, ...orderData } = req.body;
      
      // Validate order data
      const validatedOrderData = insertOrderSchema.parse(orderData);
      
      // Create order
      const order = await storage.createOrder(validatedOrderData);
      
      // Create order items
      const createdItems = [];
      if (items && Array.isArray(items)) {
        for (const item of items) {
          const validatedItem = insertOrderItemSchema.parse({
            ...item,
            orderId: order.id,
          });
          const createdItem = await storage.createOrderItem(validatedItem);
          createdItems.push(createdItem);
        }
      }
      
      // Send notification to restaurant (non-blocking - don't fail order if notification fails)
      try {
        await notificationService.sendOrderNotification(order, createdItems);
      } catch (notificationError) {
        console.error('⚠️  Telegram notification failed, but order was created:', notificationError);
        // Order is still created successfully even if notification fails
      }
      
      res.status(201).json(order);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid order data", details: error.errors });
      }
      console.error('Order creation error:', error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // App Settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error: any) {
      console.error("❌ Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const settings = await storage.updateSettings(req.body);
      res.json(settings);
    } catch (error: any) {
      console.error("❌ Error updating settings:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Register admin routes
  registerAdminRoutes(app);
  
  // Register snapshot routes
  registerSnapshotRoutes(app);

  const httpServer = createServer(app);

  return httpServer;
}
