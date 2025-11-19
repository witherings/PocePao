import type { Express } from "express";
import { passport, ensureAuthenticated } from "./auth";
import { storage } from "./storage";
import { insertCategorySchema, insertMenuItemSchema, insertIngredientSchema } from "@shared/schema";

export function registerAdminRoutes(app: Express) {
  // Login endpoint
  app.post("/api/admin/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || "Invalid credentials" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Login failed" });
        }
        return res.json({ 
          success: true, 
          user: { 
            id: user.id, 
            username: user.username 
          } 
        });
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/admin/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Check auth status
  app.get("/api/admin/me", ensureAuthenticated, (req, res) => {
    const user = req.user as any;
    res.json({ 
      id: user.id, 
      username: user.username 
    });
  });

  // === CATEGORIES CRUD ===
  
  // Get all categories (admin)
  app.get("/api/admin/categories", ensureAuthenticated, async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Create category
  app.post("/api/admin/categories", ensureAuthenticated, async (req, res) => {
    try {
      const data = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(data);
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create category" });
    }
  });

  // Update category
  app.put("/api/admin/categories/:id", ensureAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertCategorySchema.parse(req.body);
      const category = await storage.updateCategory(id, data);
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to update category" });
    }
  });

  // Delete category
  app.delete("/api/admin/categories/:id", ensureAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCategory(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to delete category" });
    }
  });

  // === MENU ITEMS CRUD ===

  // Get all menu items (admin)
  app.get("/api/admin/menu-items", ensureAuthenticated, async (req, res) => {
    try {
      const menuItems = await storage.getAllMenuItems();
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  // Create menu item
  app.post("/api/admin/menu-items", ensureAuthenticated, async (req, res) => {
    try {
      const data = insertMenuItemSchema.parse(req.body);
      const menuItem = await storage.createMenuItem(data);
      res.json(menuItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create menu item" });
    }
  });

  // Update menu item
  app.put("/api/admin/menu-items/:id", ensureAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertMenuItemSchema.parse(req.body);
      const menuItem = await storage.updateMenuItem(id, data);
      res.json(menuItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to update menu item" });
    }
  });

  // Delete menu item
  app.delete("/api/admin/menu-items/:id", ensureAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteMenuItem(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to delete menu item" });
    }
  });

  // === INGREDIENTS CRUD ===

  // Get all ingredients (admin)
  app.get("/api/admin/ingredients", ensureAuthenticated, async (req, res) => {
    try {
      const ingredients = await storage.getAllIngredients();
      res.json(ingredients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ingredients" });
    }
  });

  // Create ingredient
  app.post("/api/admin/ingredients", ensureAuthenticated, async (req, res) => {
    try {
      const data = insertIngredientSchema.parse(req.body);
      const ingredient = await storage.createIngredient(data);
      res.json(ingredient);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create ingredient" });
    }
  });

  // Update ingredient
  app.put("/api/admin/ingredients/:id", ensureAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertIngredientSchema.parse(req.body);
      const ingredient = await storage.updateIngredient(id, data);
      res.json(ingredient);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to update ingredient" });
    }
  });

  // Delete ingredient
  app.delete("/api/admin/ingredients/:id", ensureAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteIngredient(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to delete ingredient" });
    }
  });

  // === ORDERS & RESERVATIONS (READ ONLY) ===

  // Get all orders
  app.get("/api/admin/orders", ensureAuthenticated, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Get all reservations
  app.get("/api/admin/reservations", ensureAuthenticated, async (req, res) => {
    try {
      const reservations = await storage.getAllReservations();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reservations" });
    }
  });

  // Delete reservation
  app.delete("/api/admin/reservations/:id", ensureAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteReservation(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Reservation not found" });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to delete reservation" });
    }
  });

  // Get all gallery images
  app.get("/api/admin/gallery", ensureAuthenticated, async (req, res) => {
    try {
      const images = await storage.getAllGalleryImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gallery images" });
    }
  });

  // Delete gallery image
  app.delete("/api/admin/gallery/:id", ensureAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteGalleryImage(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to delete gallery image" });
    }
  });
}
