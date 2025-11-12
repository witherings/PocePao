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
  categories as categoriesTable,
  menuItems as menuItemsTable,
  reservations as reservationsTable,
  galleryImages as galleryImagesTable,
  ingredients as ingredientsTable,
  orders as ordersTable,
  orderItems as orderItemsTable
} from "@shared/schema";
// import { db } from "./db";  // Commented out since we're using MemStorage
import { eq, asc, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { categories as seedCategories, createMenuItems } from "./data/menu";
import { createIngredients } from "./data/ingredients";

// In-memory storage for when DATABASE_URL is not set
class MemStorage implements IStorage {
  private categories: Map<string, Category>;
  private menuItems: Map<string, MenuItem>;
  private reservations: Map<string, Reservation>;
  private galleryImages: Map<string, GalleryImage>;
  private ingredients: Map<string, Ingredient>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;

  constructor() {
    this.categories = new Map();
    this.menuItems = new Map();
    this.reservations = new Map();
    this.galleryImages = new Map();
    this.ingredients = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.initializeData();
  }

  private initializeData() {
    const createdCategories = seedCategories.map(cat => this.createCategorySync(cat));
    
    const categoryIds = {
      customBowls: createdCategories[0].id,
      bowls: createdCategories[1].id,
      wraps: createdCategories[2].id,
      appetizers: createdCategories[3].id,
      desserts: createdCategories[4].id,
      drinks: createdCategories[5].id,
    };

    const menuItemsData = createMenuItems(categoryIds);
    menuItemsData.forEach(item => this.createMenuItemSync(item));
    
    const ingredientsData = createIngredients();
    ingredientsData.forEach((ing: InsertIngredient) => this.createIngredientSync(ing));
  }

  private createCategorySync(category: InsertCategory): Category {
    const id = randomUUID();
    const cat: Category = { ...category, id, icon: category.icon ?? "🥗", order: category.order ?? 0 };
    this.categories.set(id, cat);
    return cat;
  }

  private createMenuItemSync(menuItem: InsertMenuItem): MenuItem {
    const id = randomUUID();
    const item: MenuItem = { 
      ...menuItem, 
      id,
      available: menuItem.available ?? 1,
      popular: menuItem.popular ?? 0,
      priceSmall: menuItem.priceSmall ?? null,
      priceLarge: menuItem.priceLarge ?? null,
      protein: menuItem.protein ?? null,
      marinade: menuItem.marinade ?? null,
      ingredients: menuItem.ingredients ?? null,
      sauce: menuItem.sauce ?? null,
      toppings: menuItem.toppings ?? null,
      allergens: menuItem.allergens ?? null,
      hasSizeOptions: menuItem.hasSizeOptions ?? 0,
      isCustomBowl: menuItem.isCustomBowl ?? 0,
    };
    this.menuItems.set(id, item);
    return item;
  }

  private createIngredientSync(ingredient: InsertIngredient): Ingredient {
    const id = randomUUID();
    const ing: Ingredient = {
      ...ingredient,
      id,
      description: ingredient.description ?? null,
      descriptionDE: ingredient.descriptionDE ?? null,
      price: ingredient.price ?? null,
      available: ingredient.available ?? 1,
      order: ingredient.order ?? 0,
    };
    this.ingredients.set(id, ing);
    return ing;
  }

  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort((a, b) => a.order - b.order);
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const cat: Category = { ...category, id, icon: category.icon ?? "🥗", order: category.order ?? 0 };
    this.categories.set(id, cat);
    return cat;
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemById(id: string): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(
      (item) => item.categoryId === categoryId
    );
  }

  async createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem> {
    const id = randomUUID();
    const item: MenuItem = { 
      ...menuItem, 
      id,
      available: menuItem.available ?? 1,
      popular: menuItem.popular ?? 0,
      priceSmall: menuItem.priceSmall ?? null,
      priceLarge: menuItem.priceLarge ?? null,
      protein: menuItem.protein ?? null,
      marinade: menuItem.marinade ?? null,
      ingredients: menuItem.ingredients ?? null,
      sauce: menuItem.sauce ?? null,
      toppings: menuItem.toppings ?? null,
      allergens: menuItem.allergens ?? null,
      hasSizeOptions: menuItem.hasSizeOptions ?? 0,
      isCustomBowl: menuItem.isCustomBowl ?? 0,
    };
    this.menuItems.set(id, item);
    return item;
  }

  async getAllReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values());
  }

  async getReservationById(id: string): Promise<Reservation | undefined> {
    return this.reservations.get(id);
  }

  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const id = randomUUID();
    const res: Reservation = { ...reservation, id };
    this.reservations.set(id, res);
    return res;
  }

  async getAllGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values()).sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  async getGalleryImageById(id: string): Promise<GalleryImage | undefined> {
    return this.galleryImages.get(id);
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const id = randomUUID();
    const img: GalleryImage = { ...image, id, uploadedAt: new Date().toISOString() };
    this.galleryImages.set(id, img);
    return img;
  }

  async deleteGalleryImage(id: string): Promise<boolean> {
    return this.galleryImages.delete(id);
  }

  async getAllIngredients(): Promise<Ingredient[]> {
    return Array.from(this.ingredients.values()).sort((a, b) => a.order - b.order);
  }

  async getIngredientById(id: string): Promise<Ingredient | undefined> {
    return this.ingredients.get(id);
  }

  async getIngredientsByType(type: string): Promise<Ingredient[]> {
    return Array.from(this.ingredients.values())
      .filter(ing => ing.type === type && ing.available === 1)
      .sort((a, b) => a.order - b.order);
  }

  async createIngredient(ingredient: InsertIngredient): Promise<Ingredient> {
    const id = randomUUID();
    const ing: Ingredient = {
      ...ingredient,
      id,
      description: ingredient.description ?? null,
      descriptionDE: ingredient.descriptionDE ?? null,
      price: ingredient.price ?? null,
      available: ingredient.available ?? 1,
      order: ingredient.order ?? 0,
    };
    this.ingredients.set(id, ing);
    return ing;
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const ord: Order = {
      ...order,
      id,
      pickupTime: order.pickupTime ?? null,
      tableNumber: order.tableNumber ?? null,
      comment: order.comment ?? null,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.orders.set(id, ord);
    return ord;
  }

  async getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const item: OrderItem = {
      ...orderItem,
      id,
      menuItemId: orderItem.menuItemId ?? null,
      size: orderItem.size ?? null,
      customization: orderItem.customization ?? null,
    };
    this.orderItems.set(id, item);
    return item;
  }
}

export interface IStorage {
  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Menu Items
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItemById(id: string): Promise<MenuItem | undefined>;
  getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;

  // Reservations
  getAllReservations(): Promise<Reservation[]>;
  getReservationById(id: string): Promise<Reservation | undefined>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;

  // Gallery Images
  getAllGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImageById(id: string): Promise<GalleryImage | undefined>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  deleteGalleryImage(id: string): Promise<boolean>;

  // Ingredients
  getAllIngredients(): Promise<Ingredient[]>;
  getIngredientById(id: string): Promise<Ingredient | undefined>;
  getIngredientsByType(type: string): Promise<Ingredient[]>;
  createIngredient(ingredient: InsertIngredient): Promise<Ingredient>;

  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
}

// DatabaseStorage stub - not used in this project
class DatabaseStorage implements IStorage {
  private notAvailable(): never {
    throw new Error('DatabaseStorage is not available - using MemStorage');
  }

  async getAllCategories(): Promise<Category[]> { return this.notAvailable(); }
  async getCategoryById(_id: string): Promise<Category | undefined> { return this.notAvailable(); }
  async createCategory(_category: InsertCategory): Promise<Category> { return this.notAvailable(); }
  async getAllMenuItems(): Promise<MenuItem[]> { return this.notAvailable(); }
  async getMenuItemById(_id: string): Promise<MenuItem | undefined> { return this.notAvailable(); }
  async getMenuItemsByCategory(_categoryId: string): Promise<MenuItem[]> { return this.notAvailable(); }
  async createMenuItem(_menuItem: InsertMenuItem): Promise<MenuItem> { return this.notAvailable(); }
  async getAllReservations(): Promise<Reservation[]> { return this.notAvailable(); }
  async getReservationById(_id: string): Promise<Reservation | undefined> { return this.notAvailable(); }
  async createReservation(_reservation: InsertReservation): Promise<Reservation> { return this.notAvailable(); }
  async getAllGalleryImages(): Promise<GalleryImage[]> { return this.notAvailable(); }
  async getGalleryImageById(_id: string): Promise<GalleryImage | undefined> { return this.notAvailable(); }
  async createGalleryImage(_image: InsertGalleryImage): Promise<GalleryImage> { return this.notAvailable(); }
  async deleteGalleryImage(_id: string): Promise<boolean> { return this.notAvailable(); }
  async getAllIngredients(): Promise<Ingredient[]> { return this.notAvailable(); }
  async getIngredientById(_id: string): Promise<Ingredient | undefined> { return this.notAvailable(); }
  async getIngredientsByType(_type: string): Promise<Ingredient[]> { return this.notAvailable(); }
  async createIngredient(_ingredient: InsertIngredient): Promise<Ingredient> { return this.notAvailable(); }
  async getAllOrders(): Promise<Order[]> { return this.notAvailable(); }
  async getOrderById(_id: string): Promise<Order | undefined> { return this.notAvailable(); }
  async createOrder(_order: InsertOrder): Promise<Order> { return this.notAvailable(); }
  async getOrderItemsByOrderId(_orderId: string): Promise<OrderItem[]> { return this.notAvailable(); }
  async createOrderItem(_orderItem: InsertOrderItem): Promise<OrderItem> { return this.notAvailable(); }
}

// Use MemStorage for this project
export const storage: IStorage = new MemStorage();

// MemStorage initializes data in constructor - no seeding needed
