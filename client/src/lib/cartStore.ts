import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@shared/schema";

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItem: (id: string, updates: Partial<Omit<CartItem, "id" | "quantity">>) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        // For custom bowls, always create a new item (unique ID for each customization)
        // For regular items, composite ID (itemId-size-base) uniquely identifies the cart entry
        const existingItem = item.customization 
          ? null 
          : get().items.find((i) => i.id === item.id && !i.customization);
        
        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.id === existingItem.id
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            ),
          });
        } else {
          // For custom bowls, generate unique ID with timestamp
          // For regular items, use the composite ID passed from caller (itemId-size-base)
          const finalId = item.customization 
            ? `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            : item.id;  // Preserve the composite ID for deduplication
          
          set({
            items: [...get().items, { ...item, id: finalId, quantity: item.quantity || 1 }],
          });
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },
      
      updateItem: (id, updates) => {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotal: () => {
        return get().items.reduce((total, item) => {
          return total + parseFloat(item.price) * item.quantity;
        }, 0);
      },
    }),
    {
      name: "pokepao-cart",
    }
  )
);
