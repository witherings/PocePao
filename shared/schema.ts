import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Menu Categories
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameDE: text("name_de").notNull(),
  order: integer("order").notNull().default(0),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

// Menu Items
export const menuItems = pgTable("menu_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameDE: text("name_de").notNull(),
  description: text("description").notNull(),
  descriptionDE: text("description_de").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  priceSmall: decimal("price_small", { precision: 10, scale: 2 }),
  priceLarge: decimal("price_large", { precision: 10, scale: 2 }),
  image: text("image").notNull(),
  categoryId: varchar("category_id").notNull().references(() => categories.id),
  available: integer("available").notNull().default(1), // 1 = available, 0 = not available
  popular: integer("popular").notNull().default(0), // 1 = popular item
  protein: text("protein"),
  marinade: text("marinade"),
  ingredients: text("ingredients").array(),
  sauce: text("sauce"),
  toppings: text("toppings").array(),
  allergens: text("allergens").array(),
  hasSizeOptions: integer("has_size_options").notNull().default(0), // 1 = has size options
  isCustomBowl: integer("is_custom_bowl").notNull().default(0), // 1 = Wunsch Bowl
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

// Ingredient Types
export enum IngredientType {
  PROTEIN = "protein",
  BASE = "base",
  MARINADE = "marinade",
  FRESH = "fresh",
  SAUCE = "sauce",
  TOPPING = "topping"
}

// Ingredients for Custom Bowls
export const ingredients = pgTable("ingredients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameDE: text("name_de").notNull(),
  type: text("type").notNull(), // protein, base, marinade, fresh, sauce, topping
  description: text("description"),
  descriptionDE: text("description_de"),
  image: text("image").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }), // price for protein type
  available: integer("available").notNull().default(1),
  order: integer("order").notNull().default(0),
});

export const insertIngredientSchema = createInsertSchema(ingredients).omit({
  id: true,
});

export type Ingredient = typeof ingredients.$inferSelect;
export type InsertIngredient = z.infer<typeof insertIngredientSchema>;

// Orders
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  pickupTime: text("pickup_time"), // When the customer wants to pick up (required for pickup orders)
  tableNumber: text("table_number"), // For dine-in orders (required for dinein orders)
  serviceType: text("service_type").notNull(), // "pickup" or "dinein"
  comment: text("comment"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, ready, completed, cancelled
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertOrderSchema = createInsertSchema(orders)
  .omit({
    id: true,
    status: true,
    createdAt: true,
  })
  .refine(
    (data) => {
      // For pickup orders, pickupTime is required
      if (data.serviceType === "pickup" && !data.pickupTime) {
        return false;
      }
      // For dinein orders, tableNumber is required
      if (data.serviceType === "dinein" && !data.tableNumber) {
        return false;
      }
      return true;
    },
    {
      message: "Pickup orders require pickupTime, dinein orders require tableNumber",
    }
  );

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

// Order Items
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  menuItemId: varchar("menu_item_id").references(() => menuItems.id),
  name: text("name").notNull(),
  nameDE: text("name_de").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  size: text("size"), // klein or standard
  customization: text("customization"), // JSON string for custom bowl selections
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

// Cart Items (client-side only, stored in memory)
export const customBowlSelectionSchema = z.object({
  protein: z.string().optional(),
  base: z.string().optional(),
  marinade: z.string().optional(),
  freshIngredients: z.array(z.string()).optional(),
  sauce: z.string().optional(),
  toppings: z.array(z.string()).optional(),
  extraProtein: z.array(z.string()).optional(),
  extraFreshIngredients: z.array(z.string()).optional(),
  extraSauces: z.array(z.string()).optional(),
  extraToppings: z.array(z.string()).optional(),
});

export type CustomBowlSelection = z.infer<typeof customBowlSelectionSchema>;

export const cartItemSchema = z.object({
  id: z.string(),
  menuItemId: z.string(),
  name: z.string(),
  nameDE: z.string(),
  price: z.string(),
  image: z.string(),
  quantity: z.number().int().positive(),
  size: z.enum(["klein", "standard"]).optional(),
  customization: customBowlSelectionSchema.optional(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

// Cart
export const cartSchema = z.object({
  items: z.array(cartItemSchema),
  total: z.string(),
});

export type Cart = z.infer<typeof cartSchema>;

// Reservations
export const reservations = pgTable("reservations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  guests: integer("guests").notNull(),
  phone: text("phone").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
});

export const insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
});

export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = z.infer<typeof insertReservationSchema>;

// Gallery Images
export const galleryImages = pgTable("gallery_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  url: text("url").notNull(),
  filename: text("filename").notNull(),
  uploadedAt: text("uploaded_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertGalleryImageSchema = createInsertSchema(galleryImages).omit({
  id: true,
  uploadedAt: true,
});

export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
