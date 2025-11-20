import { 
  type Category, 
  type InsertCategory, 
  type MenuItem, 
  type InsertMenuItem,
  type Reservation,
  type InsertReservation,
  type GalleryImage,
  type InsertGalleryImage,
  type Ingredient,
  type InsertIngredient,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type StaticContent,
  type InsertStaticContent,
  type AppSettings,
  categories as categoriesTable,
  menuItems as menuItemsTable,
  reservations as reservationsTable,
  galleryImages as galleryImagesTable,
  ingredients as ingredientsTable,
  orders as ordersTable,
  orderItems as orderItemsTable,
  staticContent as staticContentTable,
  appSettings as appSettingsTable
} from "@shared/schema";
import { getDb } from "./db";
import { eq, asc, desc, and } from "drizzle-orm";

export interface IStorage {
  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;
  
  // Menu Items
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItemById(id: string): Promise<MenuItem | undefined>;
  getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, menuItem: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: string): Promise<boolean>;

  // Reservations
  getAllReservations(): Promise<Reservation[]>;
  getReservationById(id: string): Promise<Reservation | undefined>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  deleteReservation(id: string): Promise<boolean>;

  // Gallery Images
  getAllGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImageById(id: string): Promise<GalleryImage | undefined>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  deleteGalleryImage(id: string): Promise<GalleryImage | null>;

  // Ingredients
  getAllIngredients(): Promise<Ingredient[]>;
  getIngredientById(id: string): Promise<Ingredient | undefined>;
  getIngredientsByType(type: string): Promise<Ingredient[]>;
  createIngredient(ingredient: InsertIngredient): Promise<Ingredient>;
  updateIngredient(id: string, ingredient: Partial<InsertIngredient>): Promise<Ingredient | undefined>;
  deleteIngredient(id: string): Promise<boolean>;

  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Static Content
  getAllStaticContent(): Promise<StaticContent[]>;
  
  // App Settings
  getSettings(): Promise<{ maintenanceMode: number }>;
  updateSettings(settings: { maintenanceMode?: number }): Promise<{ maintenanceMode: number }>;
  getStaticContentByPage(page: string, locale?: string): Promise<StaticContent | undefined>;
  upsertStaticContent(content: InsertStaticContent): Promise<StaticContent>;
  deleteStaticContent(id: string): Promise<boolean>;
}

class DatabaseStorage implements IStorage {
  // Categories
  async getAllCategories(): Promise<Category[]> {
    const db = await getDb();
    return await db.select().from(categoriesTable).orderBy(asc(categoriesTable.order));
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    const db = await getDb();
    const results = await db.select().from(categoriesTable).where(eq(categoriesTable.id, id));
    return results[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const db = await getDb();
    const results = await db.insert(categoriesTable).values(category).returning();
    return results[0];
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const db = await getDb();
    const results = await db.update(categoriesTable)
      .set(category)
      .where(eq(categoriesTable.id, id))
      .returning();
    return results[0];
  }

  async deleteCategory(id: string): Promise<boolean> {
    const db = await getDb();
    const results = await db.delete(categoriesTable).where(eq(categoriesTable.id, id)).returning();
    return results.length > 0;
  }

  // Menu Items
  async getAllMenuItems(): Promise<MenuItem[]> {
    const db = await getDb();
    return await db.select().from(menuItemsTable).orderBy(asc(menuItemsTable.id));
  }

  async getMenuItemById(id: string): Promise<MenuItem | undefined> {
    const db = await getDb();
    const results = await db.select().from(menuItemsTable).where(eq(menuItemsTable.id, id));
    return results[0];
  }

  async getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    const db = await getDb();
    return await db.select().from(menuItemsTable).where(eq(menuItemsTable.categoryId, categoryId)).orderBy(asc(menuItemsTable.id));
  }

  async createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem> {
    const db = await getDb();
    const results = await db.insert(menuItemsTable).values(menuItem).returning();
    return results[0];
  }

  async updateMenuItem(id: string, menuItem: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const db = await getDb();
    const results = await db.update(menuItemsTable)
      .set(menuItem)
      .where(eq(menuItemsTable.id, id))
      .returning();
    return results[0];
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    const db = await getDb();
    const results = await db.delete(menuItemsTable).where(eq(menuItemsTable.id, id)).returning();
    return results.length > 0;
  }

  // Reservations
  async getAllReservations(): Promise<Reservation[]> {
    const db = await getDb();
    return await db.select().from(reservationsTable);
  }

  async getReservationById(id: string): Promise<Reservation | undefined> {
    const db = await getDb();
    const results = await db.select().from(reservationsTable).where(eq(reservationsTable.id, id));
    return results[0];
  }

  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const db = await getDb();
    const results = await db.insert(reservationsTable).values(reservation).returning();
    return results[0];
  }

  async deleteReservation(id: string): Promise<boolean> {
    const db = await getDb();
    const results = await db.delete(reservationsTable).where(eq(reservationsTable.id, id)).returning();
    return results.length > 0;
  }

  // Gallery Images
  async getAllGalleryImages(): Promise<GalleryImage[]> {
    const db = await getDb();
    return await db.select().from(galleryImagesTable).orderBy(desc(galleryImagesTable.uploadedAt));
  }

  async getGalleryImageById(id: string): Promise<GalleryImage | undefined> {
    const db = await getDb();
    const results = await db.select().from(galleryImagesTable).where(eq(galleryImagesTable.id, id));
    return results[0];
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const db = await getDb();
    const results = await db.insert(galleryImagesTable).values(image).returning();
    return results[0];
  }

  async deleteGalleryImage(id: string): Promise<GalleryImage | null> {
    const db = await getDb();
    const results = await db.delete(galleryImagesTable).where(eq(galleryImagesTable.id, id)).returning();
    return results.length > 0 ? results[0] : null;
  }

  // Ingredients
  async getAllIngredients(): Promise<Ingredient[]> {
    const db = await getDb();
    return await db.select().from(ingredientsTable).orderBy(asc(ingredientsTable.order));
  }

  async getIngredientById(id: string): Promise<Ingredient | undefined> {
    const db = await getDb();
    const results = await db.select().from(ingredientsTable).where(eq(ingredientsTable.id, id));
    return results[0];
  }

  async getIngredientsByType(type: string): Promise<Ingredient[]> {
    const db = await getDb();
    return await db.select()
      .from(ingredientsTable)
      .where(eq(ingredientsTable.type, type))
      .orderBy(asc(ingredientsTable.order));
  }

  async createIngredient(ingredient: InsertIngredient): Promise<Ingredient> {
    const db = await getDb();
    const results = await db.insert(ingredientsTable).values(ingredient).returning();
    return results[0];
  }

  async updateIngredient(id: string, ingredient: Partial<InsertIngredient>): Promise<Ingredient | undefined> {
    const db = await getDb();
    const results = await db.update(ingredientsTable)
      .set(ingredient)
      .where(eq(ingredientsTable.id, id))
      .returning();
    return results[0];
  }

  async deleteIngredient(id: string): Promise<boolean> {
    const db = await getDb();
    const results = await db.delete(ingredientsTable).where(eq(ingredientsTable.id, id)).returning();
    return results.length > 0;
  }

  // Orders
  async getAllOrders(): Promise<Order[]> {
    const db = await getDb();
    return await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const db = await getDb();
    const results = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    return results[0];
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const db = await getDb();
    const results = await db.insert(ordersTable).values(order).returning();
    return results[0];
  }

  async getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    const db = await getDb();
    return await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, orderId));
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const db = await getDb();
    const results = await db.insert(orderItemsTable).values(orderItem).returning();
    return results[0];
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const db = await getDb();
    const results = await db.update(ordersTable)
      .set({ status })
      .where(eq(ordersTable.id, id))
      .returning();
    return results[0];
  }

  // Static Content
  async getAllStaticContent(): Promise<StaticContent[]> {
    const db = await getDb();
    return await db.select().from(staticContentTable);
  }

  async getStaticContentByPage(page: string, locale: string = 'de'): Promise<StaticContent | undefined> {
    const db = await getDb();
    const results = await db.select()
      .from(staticContentTable)
      .where(and(
        eq(staticContentTable.page, page),
        eq(staticContentTable.locale, locale)
      ));
    return results[0];
  }

  async upsertStaticContent(content: InsertStaticContent): Promise<StaticContent> {
    const db = await getDb();
    
    // Check if content exists
    const existing = await this.getStaticContentByPage(content.page, content.locale || 'de');
    
    if (existing) {
      // Update existing
      const results = await db.update(staticContentTable)
        .set({ ...content, updatedAt: new Date() })
        .where(eq(staticContentTable.id, existing.id))
        .returning();
      return results[0];
    } else {
      // Insert new
      const results = await db.insert(staticContentTable).values(content).returning();
      return results[0];
    }
  }

  async deleteStaticContent(id: string): Promise<boolean> {
    const db = await getDb();
    const results = await db.delete(staticContentTable)
      .where(eq(staticContentTable.id, id))
      .returning();
    return results.length > 0;
  }

  // App Settings
  async getSettings(): Promise<{ maintenanceMode: number }> {
    const db = await getDb();
    const results = await db.select()
      .from(appSettingsTable)
      .where(eq(appSettingsTable.id, 1));
    
    // If no settings exist, create default
    if (results.length === 0) {
      const newSettings = await db.insert(appSettingsTable)
        .values({ id: 1, maintenanceMode: 0 })
        .returning();
      return { maintenanceMode: newSettings[0].maintenanceMode };
    }
    
    return { maintenanceMode: results[0].maintenanceMode };
  }

  async updateSettings(settings: { maintenanceMode?: number }): Promise<{ maintenanceMode: number }> {
    const db = await getDb();
    
    // Ensure settings exist
    await this.getSettings();
    
    const results = await db.update(appSettingsTable)
      .set({ ...settings, updatedAt: new Date() })
      .where(eq(appSettingsTable.id, 1))
      .returning();
    
    return { maintenanceMode: results[0].maintenanceMode };
  }
}

export const storage: IStorage = new DatabaseStorage();
