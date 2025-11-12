import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
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
import { useCartStore } from "@/lib/cartStore";
import { useIsMobile } from "@/hooks/use-mobile";
import type { MenuItem, Category, CustomBowlSelection } from "@shared/schema";

const defaultBowlImage = "/images/vitamins-bowl.png";

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [bowlBuilderOpen, setBowlBuilderOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const { addItem, items: cartItems, updateItem } = useCartStore();
  const isMobile = useIsMobile();

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch menu items
  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  // Filter menu items by category
  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.categoryId === selectedCategory);

  const handleAddToCart = (item: MenuItem, size?: "klein" | "standard", customization?: CustomBowlSelection, customPrice?: string) => {
    // Use custom price if provided (for bowl builder with dynamic protein pricing)
    // Otherwise determine the correct price based on size
    let finalPrice = customPrice || item.price;
    if (!customPrice && size && item.hasSizeOptions === 1) {
      if (size === "klein" && item.priceSmall) {
        finalPrice = item.priceSmall;
      } else if (size === "standard" && item.priceLarge) {
        finalPrice = item.priceLarge;
      }
    }

    // If editing, update existing item
    if (editingItemId) {
      updateItem(editingItemId, {
        price: finalPrice,
        size: size,
        customization: customization,
      });
      setEditingItemId(null);
    } else {
      // Create unique cart ID per size to allow both sizes in cart simultaneously
      const cartItemId = size ? `${item.id}-${size}` : item.id;

      addItem({
        id: cartItemId,
        menuItemId: item.id,
        name: item.name,
        nameDE: item.nameDE,
        price: finalPrice,
        image: item.image,
        size: size,
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

  return (
    <div>
      {/* Breadcrumb / Page Header */}
      <div className="bg-gradient-to-r from-ocean to-ocean-dark text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-poppins text-4xl md:text-5xl font-bold mb-4" data-testid="text-page-title">
            Speisekarte
          </h1>
          <p className="font-lato text-lg md:text-xl opacity-90" data-testid="text-page-subtitle">
            Entdecke unsere köstlichen Poke Bowls
          </p>
        </div>
      </div>

      {/* Menu Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {/* Category Navigation */}
          <div className="mb-12">
            {isMobile ? (
              // Mobile: Dropdown Select
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full bg-card font-poppins font-semibold" data-testid="select-category-mobile">
                  <SelectValue placeholder="Kategorie wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" data-testid="option-category-all">Alle</SelectItem>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id}
                      data-testid={`option-category-${category.id}`}
                    >
                      {category.nameDE}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              // Desktop: Horizontal Tabs
              <div className="overflow-x-auto">
                <div className="flex gap-3 pb-4 min-w-max">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-6 py-3 rounded-full font-poppins font-semibold transition-all whitespace-nowrap ${
                      selectedCategory === "all"
                        ? "bg-ocean text-white shadow-lg"
                        : "bg-card text-foreground hover:bg-accent"
                    }`}
                    data-testid="button-category-all"
                  >
                    Alle
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-6 py-3 rounded-full font-poppins font-semibold transition-all whitespace-nowrap ${
                        selectedCategory === category.id
                          ? "bg-ocean text-white shadow-lg"
                          : "bg-card text-foreground hover:bg-accent"
                      }`}
                      data-testid={`button-category-${category.id}`}
                    >
                      {category.nameDE}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Menu Items Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="aspect-[16/9] bg-muted" />
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
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer border-2 hover:border-ocean/20"
                    data-testid={`card-menu-item-${item.id}`}
                    onClick={() => {
                      setSelectedItem(item);
                      // Open Bowl Builder for customizable items
                      if (item.isCustomBowl === 1) {
                        setBowlBuilderOpen(true);
                      } else {
                        setItemDialogOpen(true);
                      }
                    }}
                  >
                  <div className="relative aspect-[16/9] overflow-hidden bg-white">
                    <img
                      src={item.image || defaultBowlImage}
                      alt={item.nameDE}
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
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
                  <div className="p-6">
                    <h3 className="font-poppins font-bold text-xl text-foreground mb-2" data-testid={`text-menu-item-name-${item.id}`}>
                      {item.nameDE}
                    </h3>
                    {item.protein && (
                      <Badge variant="secondary" className="mb-2 font-lato" data-testid={`badge-protein-${item.id}`}>
                        {item.protein}
                      </Badge>
                    )}
                    <p className="font-lato text-sm text-muted-foreground mb-4 line-clamp-2" data-testid={`text-menu-item-desc-${item.id}`}>
                      {item.descriptionDE}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-poppins text-2xl font-bold text-ocean" data-testid={`text-menu-item-price-${item.id}`}>
                          {item.hasSizeOptions === 1 && "ab "}€{item.priceSmall || item.price}
                        </span>
                        {item.hasSizeOptions === 1 && (
                          <p className="text-xs text-muted-foreground mt-1">Klein/Standard</p>
                        )}
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Open Bowl Builder for customizable items
                          if (item.isCustomBowl === 1) {
                            setSelectedItem(item);
                            setBowlBuilderOpen(true);
                          } 
                          // If item has size options, open dialog instead
                          else if (item.hasSizeOptions === 1) {
                            setSelectedItem(item);
                            setItemDialogOpen(true);
                          } else {
                            handleAddToCart(item);
                          }
                        }}
                        disabled={item.available === 0}
                        className="bg-sunset hover:bg-sunset-dark text-white font-poppins font-bold rounded-full px-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                        data-testid={`button-add-to-cart-${item.id}`}
                      >
                        <Plus className="w-5 h-5 mr-1 group-hover:rotate-90 transition-transform duration-200" />
                        {item.isCustomBowl === 1 ? "Jetzt gestalten" : "Hinzufügen"}
                      </Button>
                    </div>
                    {item.available === 0 && (
                      <p className="mt-2 text-sm text-destructive font-semibold" data-testid={`text-unavailable-${item.id}`}>
                        Derzeit nicht verfügbar
                      </p>
                    )}
                  </div>
                  </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cart Widget & Modal */}
      <CartWidget onOpen={() => setCartModalOpen(true)} />
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
    </div>
  );
}
