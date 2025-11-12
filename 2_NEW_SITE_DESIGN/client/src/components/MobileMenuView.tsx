import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
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

const ITEMS_PER_PAGE = 2;

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
    dragFree: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Filter items by category
  const filteredItems = items.filter(item => item.categoryId === selectedCategory);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const pages = Array.from({ length: totalPages }, (_, i) => {
    const start = i * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
    
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Reinitialize carousel and reset to first page when category changes or items change
  useEffect(() => {
    if (!emblaApi) return;
    
    // Reinitialize to update slide count and snap points
    emblaApi.reInit();
    
    // Update scroll snaps after reinit
    setScrollSnaps(emblaApi.scrollSnapList());
    
    // Reset to first page
    emblaApi.scrollTo(0);
    
    // Ensure selected index doesn't exceed new total pages
    setSelectedIndex(0);
  }, [selectedCategory, filteredItems.length, emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const canScrollPrev = selectedIndex > 0;
  const canScrollNext = selectedIndex < totalPages - 1;

  // Get category name for display
  const getCurrentCategoryName = () => {
    const category = categories.find(c => c.id === selectedCategory);
    return category?.nameDE || "Kategorie";
  };

  return (
    <div className="space-y-2">
      {/* Category Horizontal Scroll - Ultra Compact */}
      <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
        <div className="flex gap-2 pb-2">
          {categories.map((category) => {
            const gradient = categoryGradients[category.icon] || "from-ocean to-ocean-dark";
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex-shrink-0 rounded-lg px-3 py-1.5 transition-all duration-300 ${
                  isSelected
                    ? `bg-gradient-to-br ${gradient} text-white shadow-lg`
                    : "bg-card text-foreground shadow-sm"
                }`}
                data-testid={`button-mobile-category-${category.id}`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-poppins font-semibold text-xs whitespace-nowrap">
                    {category.nameDE}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Category & Page Indicator */}
      {filteredItems.length > 0 && (
        <div className="text-center">
          <p className="font-poppins font-bold text-xs text-ocean" data-testid="text-mobile-category-indicator">
            {getCurrentCategoryName()} • {selectedIndex + 1} / {totalPages}
          </p>
        </div>
      )}

      {/* Items Carousel */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="font-poppins text-lg text-muted-foreground" data-testid="text-mobile-no-items">
            Keine Produkte in dieser Kategorie
          </p>
        </div>
      ) : (
        <>
          <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex">
              {pages.map((pageItems, pageIndex) => (
                <div key={pageIndex} className="embla__slide flex-[0_0_100%] min-w-0 px-0.5">
                  <div className="space-y-2">
                    {pageItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card
                          className="overflow-hidden hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all duration-200 group cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-ocean/40 bg-card shadow-md"
                          data-testid={`card-mobile-menu-item-${item.id}`}
                          onClick={() => onCardClick(item)}
                        >
                          <div className="relative aspect-[3/2] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
                            <img
                              src={item.image || defaultBowlImage}
                              alt={item.nameDE}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              data-testid={`img-mobile-menu-item-${item.id}`}
                            />
                            {item.popular === 1 && (
                              <div className="absolute top-1.5 right-1.5" data-testid={`badge-mobile-popular-${item.id}`}>
                                <div className="relative backdrop-blur-sm bg-gradient-to-br from-yellow-400/90 via-orange-500/90 to-red-500/90 text-white text-xs font-poppins font-bold px-2 py-1 rounded-full shadow-lg border-2 border-white/30">
                                  <span className="relative flex items-center gap-0.5">
                                    <span className="text-xs">⭐</span>
                                    <span className="font-extrabold text-xs">Beliebt</span>
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="p-2.5">
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-poppins font-bold text-sm text-foreground line-clamp-1" data-testid={`text-mobile-menu-item-name-${item.id}`}>
                                  {item.nameDE}
                                </h3>
                                {item.protein && (
                                  <Badge variant="secondary" className="mt-0.5 font-lato text-xs" data-testid={`badge-mobile-protein-${item.id}`}>
                                    {item.protein}
                                  </Badge>
                                )}
                              </div>
                              <Button
                                onClick={(e) => onAddButtonClick(e, item)}
                                disabled={item.available === 0}
                                size="sm"
                                className="bg-sunset hover:bg-sunset-dark text-white font-poppins font-semibold rounded-full px-2.5 py-1 text-xs shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                data-testid={`button-mobile-add-to-cart-${item.id}`}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-poppins text-base font-bold text-ocean" data-testid={`text-mobile-menu-item-price-${item.id}`}>
                                {item.hasSizeOptions === 1 && "ab "}€{item.priceSmall || item.price}
                              </span>
                              {item.hasSizeOptions === 1 && (
                                <span className="text-xs text-muted-foreground">Klein/Standard</span>
                              )}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Controls - Compact */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-1">
              <Button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                variant="outline"
                size="sm"
                className="rounded-full disabled:opacity-30 h-8 w-8 p-0"
                data-testid="button-mobile-prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              {/* Dot Indicators */}
              <div className="flex gap-1.5">
                {scrollSnaps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      index === selectedIndex
                        ? "bg-ocean w-5"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    data-testid={`button-mobile-dot-${index}`}
                  />
                ))}
              </div>
              
              <Button
                onClick={scrollNext}
                disabled={!canScrollNext}
                variant="outline"
                size="sm"
                className="rounded-full disabled:opacity-30 h-8 w-8 p-0"
                data-testid="button-mobile-next"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
