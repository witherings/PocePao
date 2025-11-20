import { useState, useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useCustomBowlPrices } from "@/hooks/useCustomBowlPrices";
import type { MenuItem, Category } from "@shared/schema";

const defaultBowlImage = "/images/vitamins-bowl.png";

interface MobileMenuViewProps {
  categories: Category[];
  items: MenuItem[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onCardClick: (item: MenuItem) => void;
  onAddButtonClick: (e: React.MouseEvent, item: MenuItem) => void;
}

// Category gradient mapping - icons come from database
const categoryGradients: Record<string, string> = {
  "⭐": "from-sunset to-orange-600", // Wunsch Bowls
  "🥗": "from-ocean to-ocean-dark", // Poke Bowls
  "🌯": "from-amber-400 to-amber-600", // Wraps
  "🥟": "from-green-400 to-green-600", // Vorspeisen
  "🍰": "from-pink-400 to-pink-600", // Desserts
  "🥤": "from-blue-400 to-blue-600", // Getränke
};

export function MobileMenuView({
  categories,
  items,
  selectedCategory,
  onCategoryChange,
  onCardClick,
  onAddButtonClick,
}: MobileMenuViewProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    skipSnaps: false,
    dragFree: true,
  });
  const [canScrollNext, setCanScrollNext] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Get custom bowl price range from shared hook
  const customBowlPriceRange = useCustomBowlPrices();

  // Helper function to get max price for sorting
  const getMaxPrice = (item: MenuItem): number => {
    return Math.max(parseFloat(item.price || "0"), parseFloat(item.priceSmall || "0"));
  };

  // Filter and sort items by category
  // Popular items first (⭐Beliebt), then all items sorted by price (high to low)
  const filteredItems = items
    .filter(item => item.categoryId === selectedCategory)
    .sort((a, b) => {
      // Popular items always come first
      if (a.popular === 1 && b.popular !== 1) return -1;
      if (a.popular !== 1 && b.popular === 1) return 1;
      
      // Sort by price (high to low)
      const maxPriceA = getMaxPrice(a);
      const maxPriceB = getMaxPrice(b);
      return maxPriceB - maxPriceA;
    });

  // Check if category carousel can scroll
  const checkCanScroll = useCallback(() => {
    if (!emblaApi) return;
    const scrollSnapList = emblaApi.scrollSnapList();
    const selectedIndex = emblaApi.selectedScrollSnap();
    setCanScrollNext(selectedIndex < scrollSnapList.length - 1);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", checkCanScroll);
    checkCanScroll();
    
    return () => {
      emblaApi.off("select", checkCanScroll);
    };
  }, [emblaApi, checkCanScroll]);

  // Reinitialize carousel but don't scroll to top when category changes
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    checkCanScroll();
  }, [selectedCategory, emblaApi, checkCanScroll]);

  // Get category name for display
  const getCurrentCategoryName = () => {
    const category = categories.find(c => c.id === selectedCategory);
    return category?.nameDE || "Kategorie";
  };

  return (
    <div className="space-y-4">
      {/* Category Carousel - with scroll indicator */}
      <div className="relative">
        <div className="embla overflow-hidden rounded-lg" ref={emblaRef}>
          <div className="embla__container flex gap-2">
            {categories.map((category) => {
              const gradient = categoryGradients[category.icon] || "from-ocean to-ocean-dark";
              const isSelected = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`embla__slide flex-[0_0_auto] transition-all duration-300 ${
                    isSelected
                      ? `bg-gradient-to-br ${gradient} text-white shadow-lg`
                      : "bg-card text-foreground shadow-sm hover:shadow-md"
                  } rounded-lg px-4 py-2.5 font-poppins font-semibold text-sm whitespace-nowrap flex items-center gap-2`}
                  data-testid={`button-mobile-category-${category.id}`}
                >
                  <span className="text-lg">{category.icon}</span>
                  {category.nameDE}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Scroll indicator for categories */}
        {canScrollNext && (
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="bg-gradient-to-l from-white/80 to-transparent pl-8 pr-2 py-2">
              <ChevronDown className="w-5 h-5 text-ocean rotate-90" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Category Name */}
      {filteredItems.length > 0 && (
        <div className="text-center">
          <h2 className="font-poppins font-bold text-base text-ocean" data-testid="text-mobile-category-name">
            {getCurrentCategoryName()}
          </h2>
        </div>
      )}

      {/* Items Vertical Scroll */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="font-poppins text-lg text-muted-foreground" data-testid="text-mobile-no-items">
            Keine Produkte in dieser Kategorie
          </p>
        </div>
      ) : (
        <div 
          ref={scrollContainerRef}
          className="space-y-3 max-h-[60vh] overflow-y-auto pb-4 scrollbar-hide"
        >
          {/* Scroll indicator at top */}
          <motion.div
            className="text-center flex justify-center opacity-50"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-4 h-4 text-ocean" />
          </motion.div>

          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="overflow-hidden hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all duration-200 group cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-ocean/40 bg-card shadow-md"
                data-testid={`card-mobile-menu-item-${item.id}`}
                onClick={() => onCardClick(item)}
              >
                <div className="flex gap-3">
                  {/* Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-r-2 border-gray-200 dark:border-gray-700">
                    <img
                      src={item.image || defaultBowlImage}
                      alt={item.nameDE}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      data-testid={`img-mobile-menu-item-${item.id}`}
                    />
                    {item.popular === 1 && (
                      <div className="absolute top-1 right-1" data-testid={`badge-mobile-popular-${item.id}`}>
                        <div className="relative backdrop-blur-sm bg-gradient-to-br from-yellow-400/90 via-orange-500/90 to-red-500/90 text-white text-xs font-poppins font-bold px-1.5 py-0.5 rounded-full shadow-lg border border-white/30">
                          ⭐ Beliebt
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-2.5 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="font-poppins font-bold text-sm text-foreground line-clamp-2" data-testid={`text-mobile-menu-item-name-${item.id}`}>
                        {item.nameDE}
                      </h3>
                      {item.protein && (
                        <Badge variant="secondary" className="mt-1 font-lato text-xs" data-testid={`badge-mobile-protein-${item.id}`}>
                          {item.protein}
                        </Badge>
                      )}
                    </div>

                    {/* Price and Button */}
                    <div className="flex items-center justify-between gap-2 mt-2">
                      <div>
                        {item.isCustomBowl === 1 && item.hasSizeOptions === 1 ? (
                          <div className="flex flex-col">
                            <span className="font-poppins text-xs font-bold text-ocean" data-testid={`text-mobile-menu-item-price-${item.id}`}>
                              €{customBowlPriceRange.kleinMin}-{customBowlPriceRange.kleinMax}
                            </span>
                            <span className="font-poppins text-xs text-muted-foreground">
                              Klein/Std
                            </span>
                          </div>
                        ) : (
                          <span className="font-poppins text-sm font-bold text-ocean" data-testid={`text-mobile-menu-item-price-${item.id}`}>
                            {item.hasSizeOptions === 1 && "ab "}€{item.priceSmall || item.price}
                          </span>
                        )}
                      </div>

                      <Button
                        onClick={(e) => onAddButtonClick(e, item)}
                        disabled={item.available === 0}
                        size="sm"
                        className="bg-sunset hover:bg-sunset-dark text-white font-poppins font-semibold rounded-full px-2 py-1 text-xs shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        data-testid={`button-mobile-add-to-cart-${item.id}`}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {/* Scroll indicator at bottom */}
          <motion.div
            className="text-center flex justify-center opacity-50 pt-2"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-4 h-4 text-ocean rotate-180" />
          </motion.div>
        </div>
      )}
    </div>
  );
}
