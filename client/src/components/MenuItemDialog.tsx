import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronLeft } from "lucide-react";
import type { MenuItem } from "@shared/schema";
import { useState, useEffect, useRef } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface MenuItemDialogProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, size?: "klein" | "standard", selectedBase?: string) => void;
}

export function MenuItemDialog({ item, isOpen, onClose, onAddToCart }: MenuItemDialogProps) {
  const [selectedSize, setSelectedSize] = useState<"klein" | "standard">("standard");
  const [selectedBase, setSelectedBase] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: 'auto' });
      }, 0);
      
      if (item?.hasSizeOptions === 1) {
        setSelectedSize("standard");
      }
      setSelectedBase("");
    }
  }, [item, isOpen]);

  if (!item) return null;

  const getDisplayPrice = () => {
    if (item.hasSizeOptions === 1 || item.priceSmall) {
      if (selectedSize === "klein" && item.priceSmall) {
        return item.priceSmall;
      } else if (selectedSize === "standard") {
        return item.price;
      }
    }
    return item.price;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent ref={contentRef} className="w-[95dvw] h-[95dvh] max-w-6xl max-h-[95dvh] p-0 overflow-hidden border border-gray-300 dark:border-gray-600 shadow-2xl" data-testid="dialog-menu-item">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full overflow-hidden">
          {/* LEFT: Image */}
          <div className="hidden lg:flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <img
              src={item.image || "/images/default-dish.png"}
              alt={item.nameDE}
              loading="lazy"
              className="w-full h-full object-cover"
              data-testid="img-dialog-item"
            />
            {item.popular === 1 && (
              <div className="absolute top-6 right-6">
                <div className="relative backdrop-blur-sm bg-gradient-to-br from-yellow-400/90 via-orange-500/90 to-red-500/90 text-white text-xs font-poppins font-bold px-4 py-2 rounded-full shadow-lg border-2 border-white/30">
                  <span className="flex items-center gap-1.5">
                    <span>⭐</span>
                    <span>Beliebt</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Content (scrollable) */}
          <div className="flex flex-col overflow-y-auto lg:overflow-y-auto h-full p-6">
            {/* Mobile Image */}
            <div className="lg:hidden relative aspect-[4/3] rounded-lg overflow-hidden mb-4 flex-shrink-0">
              <img
                src={item.image || "/images/default-dish.png"}
                alt={item.nameDE}
                loading="lazy"
                className="w-full h-full object-cover"
                data-testid="img-dialog-item-mobile"
              />
              {item.popular === 1 && (
                <div className="absolute top-3 right-3">
                  <div className="relative backdrop-blur-sm bg-gradient-to-br from-yellow-400/90 via-orange-500/90 to-red-500/90 text-white text-xs font-poppins font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/30">
                    <span className="flex items-center gap-1">
                      <span>⭐</span>
                      <span>Beliebt</span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Title */}
            <h2 className="font-poppins text-2xl font-bold text-foreground mb-2" data-testid="text-dialog-title">
              {item.nameDE}
            </h2>

            {/* Description */}
            {item.descriptionDE && (
              <p className="font-lato text-sm text-muted-foreground mb-4" data-testid="text-dialog-description">
                {item.descriptionDE}
              </p>
            )}

            <div className="space-y-4 flex-grow overflow-y-auto">
              {/* Size Selection */}
              {(item.hasSizeOptions === 1 || item.priceSmall) && (
                <div>
                  <h4 className="font-poppins font-semibold text-sm mb-2 text-foreground">Größe wählen</h4>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedSize === "klein" ? "default" : "outline"}
                      onClick={() => setSelectedSize("klein")}
                      className={`flex-1 font-poppins font-semibold min-h-[48px] ${
                        selectedSize === "klein" 
                          ? "bg-ocean hover:bg-ocean/90 text-white" 
                          : ""
                      }`}
                      data-testid="button-size-klein"
                    >
                      <div className="text-center text-sm">
                        <div>Klein</div>
                        {item.priceSmall && (
                          <div className="text-xs font-normal">€{item.priceSmall}</div>
                        )}
                      </div>
                    </Button>
                    <Button
                      variant={selectedSize === "standard" ? "default" : "outline"}
                      onClick={() => setSelectedSize("standard")}
                      className={`flex-1 font-poppins font-semibold min-h-[48px] ${
                        selectedSize === "standard" 
                          ? "bg-ocean hover:bg-ocean/90 text-white" 
                          : ""
                      }`}
                      data-testid="button-size-standard"
                    >
                      <div className="text-center text-sm">
                        <div>Standard</div>
                        {item.price && (
                          <div className="text-xs font-normal">€{item.price}</div>
                        )}
                      </div>
                    </Button>
                  </div>
                </div>
              )}

              {/* Base Selection */}
              {item.enableBaseSelection === 1 && (
                <div>
                  <h4 className="font-poppins font-semibold text-sm mb-2 text-foreground">Base wählen *</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {["Reis", "Quinoa", "Zucchini-Nudeln", "Couscous"].map((base) => (
                      <Button
                        key={base}
                        variant={selectedBase === base ? "default" : "outline"}
                        onClick={() => setSelectedBase(base)}
                        className={`font-poppins font-semibold min-h-[44px] text-sm ${
                          selectedBase === base 
                            ? "bg-ocean hover:bg-ocean/90 text-white" 
                            : ""
                        }`}
                        data-testid={`button-base-${base}`}
                      >
                        {base}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Protein */}
              {item.protein && (
                <div>
                  <h4 className="font-poppins font-semibold text-sm mb-2 text-foreground">Protein</h4>
                  <Badge variant="secondary" className="font-lato text-xs" data-testid="badge-protein">
                    {item.protein}
                  </Badge>
                </div>
              )}

              {/* Marinade */}
              {item.marinade && (
                <div>
                  <h4 className="font-poppins font-semibold text-sm mb-2 text-foreground">Marinade</h4>
                  <div className="border-2 border-ocean/30 rounded-lg p-3 bg-ocean/5">
                    <p className="font-lato text-xs font-medium text-foreground" data-testid="text-marinade">
                      {item.marinade}
                    </p>
                  </div>
                </div>
              )}

              {/* Ingredients */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div>
                  <h4 className="font-poppins font-semibold text-sm mb-2 text-foreground">Frische Zutaten</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.ingredients.map((ingredient, idx) => (
                      <Badge key={idx} variant="outline" className="font-lato text-xs" data-testid={`badge-ingredient-${idx}`}>
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Sauce */}
              {item.sauce && (
                <div>
                  <h4 className="font-poppins font-semibold text-sm mb-2 text-foreground">Sauce</h4>
                  <div className="border-2 border-sunset/30 rounded-lg p-3 bg-sunset/5">
                    <p className="font-lato text-xs font-medium text-foreground" data-testid="text-sauce">
                      {item.sauce}
                    </p>
                  </div>
                </div>
              )}

              {/* Toppings */}
              {item.toppings && item.toppings.length > 0 && (
                <div>
                  <h4 className="font-poppins font-semibold text-sm mb-2 text-foreground">Toppings</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.toppings.map((topping, idx) => (
                      <Badge key={idx} variant="outline" className="font-lato text-xs" data-testid={`badge-topping-${idx}`}>
                        {topping}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergens */}
              {item.allergens && item.allergens.length > 0 && (
                <div>
                  <h4 className="font-poppins font-semibold text-sm mb-2 text-destructive">Allergene</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.allergens.map((allergen, idx) => (
                      <Badge key={idx} variant="destructive" className="font-lato text-xs" data-testid={`badge-allergen-${idx}`}>
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Unavailable message */}
            {item.available === 0 && (
              <p className="text-center text-sm text-destructive font-semibold mt-4" data-testid="text-dialog-unavailable">
                Derzeit nicht verfügbar
              </p>
            )}

            {/* Footer: Price & Buttons */}
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="font-poppins text-2xl sm:text-3xl font-bold text-ocean" data-testid="text-dialog-price">
                    €{getDisplayPrice()}
                  </span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 sm:flex-initial bg-red-500 hover:bg-red-600 text-white border-red-500 font-poppins font-bold rounded-full px-4 sm:px-6 min-h-[48px] text-sm sm:text-base shadow-lg hover:shadow-xl transition-all"
                    data-testid="button-dialog-back"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Zurück</span>
                  </Button>
                  <Button
                    onClick={() => {
                      onAddToCart(
                        item, 
                        item.hasSizeOptions === 1 ? selectedSize : undefined, 
                        item.enableBaseSelection === 1 ? selectedBase : undefined
                      );
                      onClose();
                    }}
                    disabled={item.available === 0 || (item.enableBaseSelection === 1 && !selectedBase)}
                    className="flex-1 sm:flex-initial bg-sunset hover:bg-sunset-dark text-white font-poppins font-bold rounded-full px-6 sm:px-8 min-h-[48px] text-sm sm:text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="button-dialog-add-to-cart"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Hinzufügen
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
