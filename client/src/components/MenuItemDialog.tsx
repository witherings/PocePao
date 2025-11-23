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
  const [stepIndex, setStepIndex] = useState(0); // Mobile steps
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
      
      // Start at the correct step based on what selections are needed
      const initialStep = determineNextStep();
      setStepIndex(initialStep);
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

  // Check if item needs size selection
  const needsSizeSelection = item.hasSizeOptions === 1 || item.priceSmall;
  
  // Check if item needs base/variant selection
  const needsBaseSelection = baseVariants.length > 0;
  const needsFlavorSelection = flavorVariants.length > 0;
  const needsVariantSelection = needsBaseSelection || needsFlavorSelection;

  // Determine initial step for mobile
  const determineNextStep = () => {
    if (needsSizeSelection) return 0;
    if (needsVariantSelection) return 1;
    return 2;
  };

  // Get summary data for step 3
  const getSizeName = () => selectedSize === "klein" ? "Klein" : "Standard";
  const getBaseOrVariantName = () => {
    if (selectedFlavor) return selectedFlavor;
    if (selectedBase) return selectedBase;
    return null;
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

          {/* RIGHT: Content */}
          <div className="flex flex-col overflow-hidden lg:overflow-y-auto h-full p-6">
            {/* Mobile Image - Fixed */}
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

            {/* Title - Fixed */}
            <h2 className="font-poppins text-2xl font-bold text-foreground mb-2 flex-shrink-0" data-testid="text-dialog-title">
              {item.nameDE}
            </h2>

            {/* Description - Show on both desktop and mobile */}
            {item.descriptionDE && (
              <p className={`font-lato ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-4 flex-shrink-0 ${isMobile ? 'line-clamp-3' : ''}`} data-testid="text-dialog-description">
                {item.descriptionDE}
              </p>
            )}

            {/* MOBILE & DESKTOP CONTENT - FLEX GROW */}
            <div className="flex-grow overflow-hidden flex flex-col min-h-0">
              {/* MOBILE STEPS */}
              {isMobile ? (
                <>
                  {/* STEP 1: Size Selection - GIANT BUTTONS FILL ALL SPACE */}
                  {stepIndex === 0 && needsSizeSelection && (
                    <div className="flex flex-col h-full min-h-0">
                      <h3 className="font-poppins font-bold text-base text-foreground mb-1 flex-shrink-0">Schritt 1: Größe wählen</h3>
                      <div className="grid grid-rows-2 gap-1 flex-grow min-h-0">
                        <button
                          onClick={() => {
                            setSelectedSize("klein");
                            setStepIndex(needsVariantSelection ? 1 : 2);
                          }}
                          className={`font-poppins font-bold text-lg px-2 py-1 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                            selectedSize === "klein" 
                              ? "bg-ocean text-white border-ocean shadow-lg" 
                              : "bg-white text-foreground border-gray-300 dark:bg-gray-800 dark:border-gray-600 hover:border-ocean"
                          }`}
                          data-testid="button-size-klein"
                        >
                          <div>Klein</div>
                          {item.priceSmall && (
                            <div className="text-sm font-normal">€{item.priceSmall}</div>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSize("standard");
                            setStepIndex(needsVariantSelection ? 1 : 2);
                          }}
                          className={`font-poppins font-bold text-lg px-2 py-1 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                            selectedSize === "standard" 
                              ? "bg-ocean text-white border-ocean shadow-lg" 
                              : "bg-white text-foreground border-gray-300 dark:bg-gray-800 dark:border-gray-600 hover:border-ocean"
                          }`}
                          data-testid="button-size-standard"
                        >
                          <div>Standard</div>
                          {item.price && (
                            <div className="text-sm font-normal">€{item.price}</div>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Base/Flavor Selection - FILL ALL AVAILABLE SPACE */}
                  {stepIndex === 1 && needsVariantSelection && (
                    <div className="flex flex-col h-full min-h-0">
                      <h3 className="font-poppins font-bold text-base text-foreground mb-1 flex-shrink-0">Schritt 2: Base wählen</h3>
                      
                      {/* Base variants */}
                      {baseVariants.length > 0 && flavorVariants.length === 0 && (
                        <div className={`grid gap-1 flex-grow min-h-0`} style={{ gridTemplateRows: `repeat(${baseVariants.length}, 1fr)` }}>
                          {baseVariants.map((variant) => (
                            <button
                              key={variant.id}
                              onClick={() => {
                                setSelectedBase(variant.nameDE);
                                setStepIndex(2);
                              }}
                              className={`font-poppins font-semibold px-2 py-1 rounded-lg border-2 transition-all text-left flex items-center justify-center ${
                                selectedBase === variant.nameDE 
                                  ? "bg-ocean text-white border-ocean shadow-md" 
                                  : "bg-white text-foreground border-gray-300 dark:bg-gray-800 dark:border-gray-600 hover:border-ocean"
                              }`}
                              data-testid={`button-base-${variant.nameDE}`}
                            >
                              {variant.nameDE}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Flavor variants */}
                      {flavorVariants.length > 0 && baseVariants.length === 0 && (
                        <div className={`grid gap-1 flex-grow min-h-0`} style={{ gridTemplateRows: `repeat(${flavorVariants.length}, 1fr)` }}>
                          {flavorVariants.map((variant) => (
                            <button
                              key={variant.id}
                              onClick={() => {
                                setSelectedFlavorId(variant.id);
                                setSelectedFlavor(variant.nameDE);
                                setStepIndex(2);
                              }}
                              className={`font-poppins font-semibold px-2 py-1 rounded-lg border-2 transition-all text-left flex items-center justify-center ${
                                selectedFlavorId === variant.id 
                                  ? "bg-ocean text-white border-ocean shadow-md" 
                                  : "bg-white text-foreground border-gray-300 dark:bg-gray-800 dark:border-gray-600 hover:border-ocean"
                              }`}
                              data-testid={`button-flavor-${variant.nameDE}`}
                            >
                              {variant.nameDE}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Both base and flavor */}
                      {baseVariants.length > 0 && flavorVariants.length > 0 && (
                        <div className="flex flex-col gap-1 min-h-0 flex-grow overflow-y-auto">
                          {baseVariants.map((variant) => (
                            <button
                              key={variant.id}
                              onClick={() => {
                                setSelectedBase(variant.nameDE);
                                setStepIndex(2);
                              }}
                              className={`font-poppins font-semibold px-2 py-1 rounded-lg border-2 transition-all text-left flex items-center justify-center flex-shrink-0 ${
                                selectedBase === variant.nameDE 
                                  ? "bg-ocean text-white border-ocean shadow-md" 
                                  : "bg-white text-foreground border-gray-300 dark:bg-gray-800 dark:border-gray-600 hover:border-ocean"
                              }`}
                              data-testid={`button-base-${variant.nameDE}`}
                            >
                              {variant.nameDE}
                            </button>
                          ))}
                          {flavorVariants.map((variant) => (
                            <button
                              key={variant.id}
                              onClick={() => {
                                setSelectedFlavorId(variant.id);
                                setSelectedFlavor(variant.nameDE);
                                setStepIndex(2);
                              }}
                              className={`font-poppins font-semibold px-2 py-1 rounded-lg border-2 transition-all text-left flex items-center justify-center flex-shrink-0 ${
                                selectedFlavorId === variant.id 
                                  ? "bg-ocean text-white border-ocean shadow-md" 
                                  : "bg-white text-foreground border-gray-300 dark:bg-gray-800 dark:border-gray-600 hover:border-ocean"
                              }`}
                              data-testid={`button-flavor-${variant.nameDE}`}
                            >
                              {variant.nameDE}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 3: Summary with all details */}
                  {stepIndex === 2 && (
                    <div className="flex flex-col h-full min-h-0">
                      <h3 className="font-poppins font-bold text-base text-foreground py-1 mb-2 flex-shrink-0">Deine Auswahl:</h3>
                      
                      <div className="flex-grow overflow-y-auto min-h-0 space-y-3">
                        {/* Selected Size & Variant */}
                        <div className="space-y-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                        {needsSizeSelection && (
                          <div className="flex items-center gap-2">
                            <span className="font-poppins font-semibold text-sm">Größe:</span>
                            <Badge className="bg-ocean text-white">{getSizeName()}</Badge>
                          </div>
                        )}
                        {getBaseOrVariantName() && (
                          <div className="flex items-center gap-2">
                            <span className="font-poppins font-semibold text-sm">Variante:</span>
                            <Badge className="bg-ocean text-white">{getBaseOrVariantName()}</Badge>
                          </div>
                        )}
                      </div>

                      {/* Protein */}
                      {item.protein && (
                        <div>
                          <h4 className="font-poppins font-semibold text-sm text-foreground">Protein</h4>
                          <p className="font-lato text-sm text-muted-foreground">{item.protein}</p>
                        </div>
                      )}

                      {/* Marinade */}
                      {item.marinade && (
                        <div>
                          <h4 className="font-poppins font-semibold text-sm text-foreground">Marinade</h4>
                          <p className="font-lato text-sm text-muted-foreground">{item.marinade}</p>
                        </div>
                      )}

                      {/* Ingredients */}
                      {item.ingredients && item.ingredients.length > 0 && (
                        <div>
                          <h4 className="font-poppins font-semibold text-sm text-foreground">Frische Zutaten</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {item.ingredients.map((ingredient, idx) => (
                              <Badge key={idx} variant="secondary" className="font-lato text-xs" data-testid={`badge-ingredient-${idx}`}>
                                {ingredient}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sauce */}
                      {item.sauce && (
                        <div>
                          <h4 className="font-poppins font-semibold text-sm text-foreground">Sauce</h4>
                          <p className="font-lato text-sm text-muted-foreground">{item.sauce}</p>
                        </div>
                      )}

                      {/* Toppings */}
                      {item.toppings && item.toppings.length > 0 && (
                        <div>
                          <h4 className="font-poppins font-semibold text-sm text-foreground">Toppings</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {item.toppings.map((topping, idx) => (
                              <Badge key={idx} variant="secondary" className="font-lato text-xs" data-testid={`badge-topping-${idx}`}>
                                {topping}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                        {/* Allergens */}
                        {item.allergens && item.allergens.length > 0 && (
                          <div>
                            <h4 className="font-poppins font-semibold text-sm text-destructive">Allergene</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {item.allergens.map((allergen, idx) => (
                                <Badge key={idx} variant="destructive" className="font-lato text-xs" data-testid={`badge-allergen-${idx}`}>
                                  {allergen}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* DESKTOP: Show all at once */}
                  {/* Size Selection */}
                  {needsSizeSelection && (
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

                  {/* Base Selection - show if available and no flavor variants */}
                  {baseVariants.length > 0 && flavorVariants.length === 0 && (
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

                  {/* Flavor Selection (for items like Fritz-Kola) */}
                  {flavorVariants.length > 0 && (
                    <div>
                      <h4 className="font-poppins font-semibold text-sm mb-2 text-foreground">Geschmack wählen *</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {flavorVariants.map((variant) => (
                          <Button
                            key={variant.id}
                            variant={selectedFlavorId === variant.id ? "default" : "outline"}
                            onClick={() => {
                              setSelectedFlavorId(variant.id);
                              setSelectedFlavor(variant.nameDE);
                            }}
                            className={`font-poppins font-semibold min-h-[44px] text-sm ${
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
                </>
              )}
            </div>

            {/* Unavailable message */}
            {item.available === 0 && (
              <p className="text-center text-sm text-destructive font-semibold mt-4 flex-shrink-0" data-testid="text-dialog-unavailable">
                Derzeit nicht verfügbar
              </p>
            )}

            {/* Footer: Price & Buttons - Fixed at bottom */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between gap-2">
                {/* Back Button - Mobile: Symbol only, Desktop: With text */}
                {isMobile && stepIndex > 0 ? (
                  <Button
                    onClick={() => setStepIndex(stepIndex - 1)}
                    variant="outline"
                    className="bg-red-500 hover:bg-red-600 text-white border-red-500 font-poppins font-bold rounded-full w-12 h-12 p-0 min-h-0 shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                    data-testid="button-step-back"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                ) : (
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="bg-red-500 hover:bg-red-600 text-white border-red-500 font-poppins font-bold rounded-full sm:px-6 sm:min-h-[48px] w-12 h-12 sm:w-auto sm:h-auto p-0 sm:p-4 min-h-0 sm:min-h-12 shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                    data-testid="button-dialog-back"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden sm:inline ml-2">Zurück</span>
                  </Button>
                )}

                {/* Price - Center */}
                <span className="font-poppins text-xl sm:text-2xl font-bold text-ocean flex-grow text-center" data-testid="text-dialog-price">
                  €{getDisplayPrice()}
                </span>

                {/* Add to Cart Button - Mobile: Symbol only, Desktop: With text */}
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
                  className="bg-sunset hover:bg-sunset-dark text-white font-poppins font-bold rounded-full sm:px-8 sm:min-h-[48px] w-12 h-12 sm:w-auto sm:h-auto p-0 sm:p-4 min-h-0 sm:min-h-12 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  data-testid="button-dialog-add-to-cart"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline ml-2">Hinzufügen</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
