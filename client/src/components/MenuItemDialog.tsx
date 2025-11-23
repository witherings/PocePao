import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronLeft } from "lucide-react";
import type { MenuItem, ProductVariant } from "@shared/schema";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useIsMobile } from "@/hooks/use-mobile";

interface MenuItemDialogProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, size?: "klein" | "standard", selectedBase?: string, customization?: any, customPrice?: string, selectedVariant?: string, selectedVariantName?: string) => void;
}

export function MenuItemDialog({ item, isOpen, onClose, onAddToCart }: MenuItemDialogProps) {
  const isMobile = useIsMobile();
  const [selectedSize, setSelectedSize] = useState<"klein" | "standard">("standard");
  const [selectedBase, setSelectedBase] = useState<string>("");
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [selectedFlavorId, setSelectedFlavorId] = useState<string>("");
  const [stepIndex, setStepIndex] = useState(0); // 0: initial, 1: size selected on mobile, 2: base selected
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch all variants
  const { data: allVariants = [] } = useQuery<ProductVariant[]>({
    queryKey: ['/api/product-variants'],
  });

  // Get base variants for this item
  const baseVariants = item ? allVariants.filter(v => v.menuItemId === item.id && v.type === 'base' && v.available === 1).sort((a, b) => a.order - b.order) : [];
  
  // Get flavor variants for this item
  const flavorVariants = item ? allVariants.filter(v => v.menuItemId === item.id && v.type === 'flavor' && v.available === 1).sort((a, b) => a.order - b.order) : [];

  useBodyScrollLock(isOpen);

  // Handle browser back button to close dialog instead of navigating away
  useEffect(() => {
    if (isOpen) {
      // Add entry to history stack
      window.history.pushState({ dialogOpen: true }, "");

      const handlePopState = () => {
        onClose();
      };

      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: 'auto' });
      }, 0);
      
      if (item?.hasSizeOptions === 1) {
        setSelectedSize("standard");
      }
      setSelectedBase("");
      setSelectedFlavor("");
      setSelectedFlavorId("");
      setStepIndex(0);
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

            {/* Description - Hidden on mobile */}
            {item.descriptionDE && !isMobile && (
              <p className="font-lato text-sm text-muted-foreground mb-4" data-testid="text-dialog-description">
                {item.descriptionDE}
              </p>
            )}

            <div className="space-y-4 flex-grow overflow-y-auto">
              {/* MOBILE TWO-STEP LAYOUT */}
              {isMobile && (item.hasSizeOptions === 1 || item.priceSmall) ? (
                <>
                  {/* STEP 1: Size Selection (fills screen) */}
                  {stepIndex === 0 && (
                    <div className="space-y-4">
                      <h3 className="font-poppins font-bold text-lg text-foreground">Schritt 1: Größe wählen</h3>
                      <div className="flex flex-col gap-3">
                        <Button
                          variant={selectedSize === "klein" ? "default" : "outline"}
                          onClick={() => {
                            setSelectedSize("klein");
                            setStepIndex((baseVariants.length > 0 || flavorVariants.length > 0) ? 1 : 2);
                          }}
                          className={`w-full font-poppins font-semibold min-h-[64px] text-base ${
                            selectedSize === "klein" 
                              ? "bg-ocean hover:bg-ocean/90 text-white" 
                              : ""
                          }`}
                          data-testid="button-size-klein"
                        >
                          <div className="text-center w-full">
                            <div>Klein</div>
                            {item.priceSmall && (
                              <div className="text-sm font-normal">€{item.priceSmall}</div>
                            )}
                          </div>
                        </Button>
                        <Button
                          variant={selectedSize === "standard" ? "default" : "outline"}
                          onClick={() => {
                            setSelectedSize("standard");
                            setStepIndex((baseVariants.length > 0 || flavorVariants.length > 0) ? 1 : 2);
                          }}
                          className={`w-full font-poppins font-semibold min-h-[64px] text-base ${
                            selectedSize === "standard" 
                              ? "bg-ocean hover:bg-ocean/90 text-white" 
                              : ""
                          }`}
                          data-testid="button-size-standard"
                        >
                          <div className="text-center w-full">
                            <div>Standard</div>
                            {item.price && (
                              <div className="text-sm font-normal">€{item.price}</div>
                            )}
                          </div>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Base/Flavor Selection (horizontal scroll) */}
                  {stepIndex === 1 && (baseVariants.length > 0 || flavorVariants.length > 0) && (
                    <div className="space-y-4">
                      <h3 className="font-poppins font-bold text-lg text-foreground">Schritt 2: Base wählen</h3>
                      
                      {/* Base Selection */}
                      {(baseVariants.length > 0) && (
                        <div className="overflow-x-auto pb-2">
                          <div className="flex gap-2 min-w-min">
                            {baseVariants.map((variant) => (
                              <Button
                                key={variant.id}
                                variant={selectedBase === variant.nameDE ? "default" : "outline"}
                                onClick={() => {
                                  setSelectedBase(variant.nameDE);
                                  setStepIndex(2);
                                }}
                                className={`font-poppins font-semibold whitespace-nowrap flex-shrink-0 min-h-[48px] px-4 ${
                                  selectedBase === variant.nameDE 
                                    ? "bg-ocean hover:bg-ocean/90 text-white" 
                                    : ""
                                }`}
                                data-testid={`button-base-${variant.nameDE}`}
                              >
                                {variant.nameDE}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Flavor Selection */}
                      {(flavorVariants.length > 0) && (
                        <div className="space-y-2">
                          {flavorVariants.map((variant) => (
                            <Button
                              key={variant.id}
                              variant={selectedFlavorId === variant.id ? "default" : "outline"}
                              onClick={() => {
                                setSelectedFlavorId(variant.id);
                                setSelectedFlavor(variant.nameDE);
                                setStepIndex(2);
                              }}
                              className={`w-full font-poppins font-semibold min-h-[44px] text-sm justify-start text-left ${
                                selectedFlavorId === variant.id 
                                  ? "bg-ocean hover:bg-ocean/90 text-white" 
                                  : ""
                              }`}
                              data-testid={`button-flavor-${variant.nameDE}`}
                            >
                              {variant.nameDE}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 3: Summary and Add to Cart */}
                  {stepIndex === 2 && (
                    <div className="space-y-4">
                      <h3 className="font-poppins font-bold text-lg text-foreground">Deine Auswahl:</h3>
                      <div className="bg-ocean/10 rounded-lg p-3 space-y-2">
                        <div><span className="font-semibold">Größe:</span> {selectedSize === "klein" ? "Klein" : "Standard"}</div>
                        {selectedBase && <div><span className="font-semibold">Base:</span> {selectedBase}</div>}
                        {selectedFlavor && <div><span className="font-semibold">Geschmack:</span> {selectedFlavor}</div>}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* DESKTOP: Show all at once */}
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

                  {/* Base Selection - from hasVariants */}
                  {item.hasVariants === 1 && item.variantType === 'base' && baseVariants.length > 0 && (
                    <div>
                      <h4 className="font-poppins font-semibold text-sm mb-2 text-foreground">Base wählen *</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {baseVariants.map((variant) => (
                          <Button
                            key={variant.id}
                            variant={selectedBase === variant.nameDE ? "default" : "outline"}
                            onClick={() => setSelectedBase(variant.nameDE)}
                            className={`font-poppins font-semibold min-h-[44px] text-sm ${
                              selectedBase === variant.nameDE 
                                ? "bg-ocean hover:bg-ocean/90 text-white" 
                                : ""
                            }`}
                            data-testid={`button-base-${variant.nameDE}`}
                          >
                            {variant.nameDE}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Base Selection - Legacy from enableBaseSelection */}
                  {item.enableBaseSelection === 1 && item.hasVariants !== 1 && baseVariants.length > 0 && (
                    <div>
                      <h4 className="font-poppins font-semibold text-sm mb-2 text-foreground">Base wählen *</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {baseVariants.map((variant) => (
                          <Button
                            key={variant.id}
                            variant={selectedBase === variant.nameDE ? "default" : "outline"}
                            onClick={() => setSelectedBase(variant.nameDE)}
                            className={`font-poppins font-semibold min-h-[44px] text-sm ${
                              selectedBase === variant.nameDE 
                                ? "bg-ocean hover:bg-ocean/90 text-white" 
                                : ""
                            }`}
                            data-testid={`button-base-legacy-${variant.nameDE}`}
                          >
                            {variant.nameDE}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Flavor Selection (for items like Fritz-Kola) */}
              {item.hasVariants === 1 && item.variantType === 'flavor' && flavorVariants.length > 0 && (
                <div>
                  <h4 className="font-poppins font-semibold text-sm mb-2 text-foreground">Geschmacksrichtung wählen *</h4>
                  <div className="space-y-2">
                    {flavorVariants.map((variant) => (
                      <Button
                        key={variant.id}
                        variant={selectedFlavorId === variant.id ? "default" : "outline"}
                        onClick={() => {
                          setSelectedFlavorId(variant.id);
                          setSelectedFlavor(variant.nameDE);
                        }}
                        className={`w-full font-poppins font-semibold min-h-[48px] text-sm justify-start text-left ${
                          selectedFlavorId === variant.id 
                            ? "bg-ocean hover:bg-ocean/90 text-white" 
                            : ""
                        }`}
                        data-testid={`button-flavor-${variant.nameDE}`}
                      >
                        {variant.nameDE}
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
                  {/* Mobile: Back button for two-step process */}
                  {isMobile && stepIndex > 0 ? (
                    <Button
                      onClick={() => setStepIndex(stepIndex - 1)}
                      variant="outline"
                      className="flex-1 sm:flex-initial bg-red-500 hover:bg-red-600 text-white border-red-500 font-poppins font-bold rounded-full px-4 sm:px-6 min-h-[48px] text-sm sm:text-base shadow-lg hover:shadow-xl transition-all"
                      data-testid="button-step-back"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="ml-1">Zurück</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={onClose}
                      variant="outline"
                      className="flex-1 sm:flex-initial bg-red-500 hover:bg-red-600 text-white border-red-500 font-poppins font-bold rounded-full px-4 sm:px-6 min-h-[48px] text-sm sm:text-base shadow-lg hover:shadow-xl transition-all"
                      data-testid="button-dialog-back"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline ml-1">Zurück</span>
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      onAddToCart(
                        item, 
                        item.hasSizeOptions === 1 ? selectedSize : undefined, 
                        item.enableBaseSelection === 1 ? selectedBase : undefined,
                        undefined,
                        undefined,
                        item.hasVariants === 1 && item.variantType === 'flavor' ? selectedFlavorId : undefined,
                        item.hasVariants === 1 && item.variantType === 'flavor' ? selectedFlavor : undefined
                      );
                      onClose();
                    }}
                    disabled={item.available === 0 || (baseVariants.length > 0 && !selectedBase) || (flavorVariants.length > 0 && !selectedFlavorId) || (isMobile && stepIndex < 2 && (baseVariants.length > 0 || flavorVariants.length > 0))}
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
