import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CartWidget } from "@/components/CartWidget";
import { CartModal } from "@/components/CartModal";
import { MenuItemDialog } from "@/components/MenuItemDialog";
import { BowlBuilderDialog } from "@/components/BowlBuilderDialog";
import { BowlInfoDialog } from "@/components/BowlInfoDialog";
import { MobileMenuView } from "@/components/MobileMenuView";
import { VariantSelectionDialog } from "@/components/VariantSelectionDialog";
import { useCartStore } from "@/lib/cartStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCustomBowlPrices } from "@/hooks/useCustomBowlPrices";
import { motion } from "framer-motion";
import type { MenuItem, Category, CustomBowlSelection } from "@shared/schema";

const defaultBowlImage = "/images/vitamins-bowl.png";

// Category gradient mapping - icons come from database
const categoryGradients: Record<string, string> = {
  "⭐": "from-sunset to-orange-600", // Wunsch Bowls
  "🥗": "from-ocean to-ocean-dark", // Poke Bowls
  "🌯": "from-amber-400 to-amber-600", // Wraps
  "🥟": "from-green-400 to-green-600", // Vorspeisen
  "🍰": "from-pink-400 to-pink-600", // Desserts
  "🥤": "from-blue-400 to-blue-600", // Getränke
};

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [bowlBuilderOpen, setBowlBuilderOpen] = useState(false);
  const [bowlInfoOpen, setBowlInfoOpen] = useState(false);
  const [variantDialogOpen, setVariantDialogOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const { addItem, items: cartItems, updateItem } = useCartStore();
  const isMobile = useIsMobile();

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Set first category as default when categories load
  if (categories.length > 0 && !selectedCategory) {
    setSelectedCategory(categories[0].id);
  }

  // Fetch menu items
  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  // Get custom bowl price range from shared hook
  const customBowlPriceRange = useCustomBowlPrices();

  // Helper function to get max price for sorting
  const getMaxPrice = (item: MenuItem): number => {
    return Math.max(parseFloat(item.price || "0"), parseFloat(item.priceSmall || "0"));
  };

  // Filter and sort menu items by category
  // Popular items first (⭐Beliebt), then all items sorted by price (high to low)
  const filteredItems = menuItems
    .filter((item) => item.categoryId === selectedCategory)
    .sort((a, b) => {
      // Popular items always come first
      if (a.popular === 1 && b.popular !== 1) return -1;
      if (a.popular !== 1 && b.popular === 1) return 1;
      
      // Sort by price (high to low)
      const maxPriceA = getMaxPrice(a);
      const maxPriceB = getMaxPrice(b);
      return maxPriceB - maxPriceA;
    });

  const handleAddToCart = (item: MenuItem, size?: "klein" | "standard", selectedBase?: string, customization?: CustomBowlSelection, customPrice?: string, selectedVariant?: string, selectedVariantName?: string) => {
    // Use custom price if provided (for bowl builder with dynamic protein pricing)
    // Otherwise determine the correct price based on size
    let finalPrice = customPrice || item.price;
    if (!customPrice && size && item.hasSizeOptions === 1) {
      if (size === "klein" && item.priceSmall) {
        finalPrice = item.priceSmall;
      } else if (size === "standard") {
        // Standard size always uses the main price
        finalPrice = item.price;
      }
    }

    // If editing, update existing item
    if (editingItemId) {
      updateItem(editingItemId, {
        price: finalPrice,
        size: size,
        selectedBase: selectedBase,
        selectedVariant: selectedVariant,
        selectedVariantName: selectedVariantName,
        customization: customization,
      });
      setEditingItemId(null);
    } else {
      // Create unique cart ID per size, base, and variant to allow different combinations in cart simultaneously
      let cartItemId = item.id;
      if (size) {
        cartItemId = `${item.id}-${size}`;
      }
      if (selectedBase) {
        cartItemId = `${cartItemId}-${selectedBase.toLowerCase().replace(/\s+/g, '-')}`;
      }
      if (selectedVariant) {
        cartItemId = `${cartItemId}-${selectedVariant}`;
      }

      addItem({
        id: cartItemId,
        menuItemId: item.id,
        name: item.name,
        nameDE: item.nameDE,
        price: finalPrice,
        image: item.image,
        size: size,
        selectedBase: selectedBase,
        selectedVariant: selectedVariant,
        selectedVariantName: selectedVariantName,
        customization: customization,
      });
    }
  };

  const handleEditItem = (itemId: string) => {
    const cartItem = cartItems.find(i => i.id === itemId);
    if (!cartItem || !cartItem.customization) return;

    // Find the menu item for this cart item
    const menuItem = menuItems.find(mi => mi.id === cartItem.menuItemId);
    if (!menuItem) return;

    setEditingItemId(itemId);
    setSelectedItem(menuItem);
    setBowlBuilderOpen(true);
    setCartModalOpen(false);
  };

  const handleCardClick = (item: MenuItem) => {
    setSelectedItem(item);
    if (item.isCustomBowl === 1) {
      setBowlInfoOpen(true);
    } else {
      setItemDialogOpen(true);
    }
  };

  const handleAddButtonClick = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    if (item.isCustomBowl === 1) {
      setSelectedItem(item);
      setBowlInfoOpen(true);
    } else {
      // Open ItemDialog for all regular items
      setSelectedItem(item);
      setItemDialogOpen(true);
    }
  };

  const handleVariantSelection = (item: MenuItem, variantId: string, variantName: string) => {
    handleAddToCart(item, undefined, undefined, undefined, undefined, variantId, variantName);
  };

  return (
    <div>
      {/* Breadcrumb / Page Header */}
      <div className="bg-gradient-to-r from-ocean to-ocean-dark text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-poppins text-2xl md:text-3xl font-bold mb-2" data-testid="text-page-title">
            Speisekarte
          </h1>
          <p className="font-lato text-sm md:text-base opacity-90" data-testid="text-page-subtitle">
            Entdecke unsere köstlichen Poke Bowls
          </p>
        </div>
      </div>

      {/* Menu Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {isMobile ? (
            // Mobile: Custom Card-based Menu View with Swipe Pagination
            <MobileMenuView
              categories={categories}
              items={menuItems}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onCardClick={handleCardClick}
              onAddButtonClick={handleAddButtonClick}
            />
          ) : (
            <>
              {/* Desktop: Category Navigation with Scroll Snap */}
              <div className="mb-12">
                <div className="overflow-x-auto snap-x snap-mandatory flex gap-3 pb-4 min-w-max">
                  {categories.map((category) => {
                    const gradient = categoryGradients[category.icon] || "from-ocean to-ocean-dark";
                    const isSelected = selectedCategory === category.id;
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`transition-all duration-300 rounded-lg px-6 py-3 font-poppins font-semibold text-base whitespace-nowrap snap-center flex items-center gap-2 ${
                          isSelected
                            ? `bg-gradient-to-br ${gradient} text-white shadow-lg`
                            : "bg-card text-foreground shadow-sm hover:shadow-md"
                        }`}
                        data-testid={`button-category-${category.id}`}
                      >
                        <span className="text-xl">{category.icon}</span>
                        {category.nameDE}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Desktop: Menu Items Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="overflow-hidden animate-pulse">
                      <div className="aspect-[4/3] bg-muted" />
                      <div className="p-6 space-y-3">
                        <div className="h-6 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-4 bg-muted rounded w-2/3" />
                        <div className="h-10 bg-muted rounded" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-poppins text-xl text-muted-foreground" data-testid="text-no-items">
                    Keine Produkte in dieser Kategorie
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.05,
                        ease: "easeOut"
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className="overflow-hidden hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-200 group cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-ocean/40 bg-card shadow-md h-full flex flex-col"
                        data-testid={`card-menu-item-${item.id}`}
                        onClick={() => handleCardClick(item)}
                      >
                      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
                        <img
                          src={item.image || defaultBowlImage}
                          alt={item.nameDE}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          data-testid={`img-menu-item-${item.id}`}
                        />
                        {item.popular === 1 && (
                          <div className="absolute top-3 right-3 group/badge" data-testid={`badge-popular-${item.id}`}>
                            <div className="relative backdrop-blur-sm bg-gradient-to-br from-yellow-400/90 via-orange-500/90 to-red-500/90 text-white text-xs font-poppins font-bold px-4 py-2 rounded-full shadow-lg border-2 border-white/30 hover:scale-105 transition-all duration-300">
                              <div className="absolute inset-0 bg-gradient-gold-shimmer bg-[length:200%_100%] opacity-30 rounded-full animate-shimmer"></div>
                              <span className="relative flex items-center gap-1.5">
                                <span className="animate-pulse-glow inline-block">⭐</span>
                                <span className="font-extrabold tracking-wide">Beliebt</span>
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-poppins font-bold text-lg text-foreground mb-1" data-testid={`text-menu-item-name-${item.id}`}>
                          {item.nameDE}
                        </h3>
                        {item.protein && (
                          <Badge variant="secondary" className="mb-2 font-lato w-fit" data-testid={`badge-protein-${item.id}`}>
                            {item.protein}
                          </Badge>
                        )}
                        <p className="font-lato text-sm text-muted-foreground mb-3 line-clamp-2 flex-grow" data-testid={`text-menu-item-desc-${item.id}`}>
                          {item.descriptionDE}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <div>
                            {item.isCustomBowl === 1 ? (
                              <span className="font-poppins text-xl font-bold text-ocean" data-testid={`text-menu-item-price-${item.id}`}>
                                ab €9.50
                              </span>
                            ) : item.hasSizeOptions === 1 && item.priceSmall ? (
                              <>
                                <span className="font-poppins text-base font-bold text-ocean block" data-testid={`text-menu-item-price-${item.id}`}>
                                  Klein €{item.priceSmall}
                                </span>
                                <span className="font-poppins text-base font-semibold text-muted-foreground">
                                  Standard €{item.price}
                                </span>
                              </>
                            ) : (
                              <span className="font-poppins text-xl font-bold text-ocean" data-testid={`text-menu-item-price-${item.id}`}>
                                €{item.price}
                              </span>
                            )}
                          </div>
                          <Button
                            onClick={(e) => handleAddButtonClick(e, item)}
                            disabled={item.available === 0}
                            className="bg-sunset hover:bg-sunset-dark text-white font-poppins font-semibold rounded-full px-5 py-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                            data-testid={`button-add-to-cart-${item.id}`}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            {item.isCustomBowl === 1 ? "Gestalten" : "Hinzufügen"}
                          </Button>
                        </div>
                      </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Cart Widget & Modal */}
      <CartWidget 
        onOpen={() => setCartModalOpen(true)} 
        isHidden={bowlBuilderOpen || cartModalOpen}
      />
      
      
      <CartModal 
        isOpen={cartModalOpen} 
        onClose={() => setCartModalOpen(false)} 
        onEditItem={handleEditItem}
      />
      
      {/* Menu Item Detail Dialog */}
      <MenuItemDialog
        item={selectedItem}
        isOpen={itemDialogOpen}
        onClose={() => setItemDialogOpen(false)}
        onAddToCart={handleAddToCart}
      />
      
      {/* Bowl Info Dialog */}
      <BowlInfoDialog
        item={selectedItem}
        isOpen={bowlInfoOpen}
        onClose={() => setBowlInfoOpen(false)}
        onStartBuilder={() => setBowlBuilderOpen(true)}
      />

      {/* Bowl Builder Dialog */}
      <BowlBuilderDialog
        item={selectedItem}
        isOpen={bowlBuilderOpen}
        onClose={() => {
          setBowlBuilderOpen(false);
          setEditingItemId(null);
        }}
        onAddToCart={handleAddToCart}
        editingCartItemId={editingItemId}
      />

      {/* Variant Selection Dialog */}
      <VariantSelectionDialog
        item={selectedItem}
        isOpen={variantDialogOpen}
        onClose={() => setVariantDialogOpen(false)}
        onAddToCart={handleVariantSelection}
      />
    </div>
  );
}
