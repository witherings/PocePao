import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import type { MenuItem } from "@shared/schema";
import { useState, useEffect } from "react";

interface MenuItemDialogProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, size?: "klein" | "standard") => void;
}

export function MenuItemDialog({ item, isOpen, onClose, onAddToCart }: MenuItemDialogProps) {
  const [selectedSize, setSelectedSize] = useState<"klein" | "standard">("standard");

  // Reset to default size when dialog opens or item changes
  useEffect(() => {
    if (isOpen && item?.hasSizeOptions === 1) {
      setSelectedSize("standard");
    }
  }, [item, isOpen]);

  if (!item) return null;

  // Calculate the displayed price based on selected size
  const getDisplayPrice = () => {
    if (item.hasSizeOptions === 1) {
      if (selectedSize === "klein" && item.priceSmall) {
        return item.priceSmall;
      } else if (selectedSize === "standard" && item.priceLarge) {
        return item.priceLarge;
      }
    }
    return item.price;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-menu-item">
        <DialogHeader>
          <DialogTitle className="font-poppins text-2xl" data-testid="text-dialog-title">
            {item.nameDE}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Produktdetails und Größenauswahl für {item.nameDE}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={item.image}
              alt={item.nameDE}
              loading="lazy"
              className="w-full h-full object-cover"
              data-testid="img-dialog-item"
            />
            {item.popular === 1 && (
              <div className="absolute top-3 right-3 group/badge">
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

          {/* Description */}
          <p className="font-lato text-muted-foreground" data-testid="text-dialog-description">
            {item.descriptionDE}
          </p>

          {/* Size Selection */}
          {item.hasSizeOptions === 1 && (
            <div>
              <h4 className="font-poppins font-semibold text-sm mb-3 text-foreground">Größe wählen</h4>
              <div className="flex gap-3">
                <Button
                  variant={selectedSize === "klein" ? "default" : "outline"}
                  onClick={() => setSelectedSize("klein")}
                  className={`flex-1 font-poppins font-semibold ${
                    selectedSize === "klein" 
                      ? "bg-ocean hover:bg-ocean/90 text-white" 
                      : ""
                  }`}
                  data-testid="button-size-klein"
                >
                  <div className="text-center">
                    <div>Klein</div>
                    {item.priceSmall && (
                      <div className="text-sm font-normal">€{item.priceSmall}</div>
                    )}
                  </div>
                </Button>
                <Button
                  variant={selectedSize === "standard" ? "default" : "outline"}
                  onClick={() => setSelectedSize("standard")}
                  className={`flex-1 font-poppins font-semibold ${
                    selectedSize === "standard" 
                      ? "bg-ocean hover:bg-ocean/90 text-white" 
                      : ""
                  }`}
                  data-testid="button-size-standard"
                >
                  <div className="text-center">
                    <div>Standard</div>
                    {item.priceLarge && (
                      <div className="text-sm font-normal">€{item.priceLarge}</div>
                    )}
                  </div>
                </Button>
              </div>
            </div>
          )}

          {/* Protein */}
          {item.protein && (
            <div>
              <h4 className="font-poppins font-semibold text-sm mb-2 text-foreground">Protein</h4>
              <Badge variant="secondary" className="font-lato" data-testid="badge-protein">
                {item.protein}
              </Badge>
            </div>
          )}

          {/* Marinade */}
          {item.marinade && (
            <div>
              <h4 className="font-poppins font-semibold text-sm mb-2 text-foreground">Marinade</h4>
              <div className="border-2 border-ocean/30 rounded-lg p-3 bg-ocean/5">
                <p className="font-lato text-sm font-medium text-foreground" data-testid="text-marinade">
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
                  <Badge key={idx} variant="outline" className="font-lato" data-testid={`badge-ingredient-${idx}`}>
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
                <p className="font-lato text-sm font-medium text-foreground" data-testid="text-sauce">
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
                  <Badge key={idx} variant="outline" className="font-lato" data-testid={`badge-topping-${idx}`}>
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
                  <Badge key={idx} variant="destructive" className="font-lato" data-testid={`badge-allergen-${idx}`}>
                    {allergen}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <span className="font-poppins text-3xl font-bold text-ocean" data-testid="text-dialog-price">
                €{getDisplayPrice()}
              </span>
            </div>
            <Button
              onClick={() => {
                onAddToCart(item, item.hasSizeOptions === 1 ? selectedSize : undefined);
                onClose();
              }}
              disabled={item.available === 0}
              className="bg-sunset hover:bg-sunset-dark text-white font-poppins font-bold rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-dialog-add-to-cart"
            >
              <Plus className="w-5 h-5 mr-2" />
              Hinzufügen
            </Button>
          </div>

          {item.available === 0 && (
            <p className="text-center text-sm text-destructive font-semibold" data-testid="text-dialog-unavailable">
              Derzeit nicht verfügbar
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
