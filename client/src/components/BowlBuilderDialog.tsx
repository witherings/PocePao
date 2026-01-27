import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { MenuItem, Ingredient, CustomBowlSelection } from "@shared/schema";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCartStore } from "@/lib/cartStore";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { motion, AnimatePresence, useDragControls, PanInfo } from "framer-motion";
import { pricingService } from "@/lib/pricingService";

interface BowlBuilderDialogProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, size: "klein" | "standard", selectedBase: string | undefined, customization: CustomBowlSelection, customPrice?: string) => void;
  editingCartItemId?: string | null;
}

type BuilderStep = "size" | "protein" | "base" | "marinade" | "fresh" | "sauce" | "topping" | "extras";

const STEPS: BuilderStep[] = ["size", "protein", "base", "marinade", "fresh", "sauce", "topping", "extras"];

const STEP_CONFIG = {
  size: { title: "Wähle deine Größe", min: 1, max: 1 },
  protein: { title: "Wähle dein Protein", min: 1, max: 1 },
  base: { title: "Wähle deine Base", min: 1, max: 1 },
  marinade: { title: "Wähle deine Marinade", min: 1, max: 1 },
  fresh: { title: "Wähle 5 frische Zutaten", min: 5, max: 5 },
  sauce: { title: "Wähle deine Sauce", min: 1, max: 1 },
  topping: { title: "Wähle 3 Toppings", min: 3, max: 3 },
  extras: { title: "Extras (optional)", min: 0, max: 999 },
};

export function BowlBuilderDialog({ item, isOpen, onClose, onAddToCart, editingCartItemId }: BowlBuilderDialogProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<"klein" | "standard">("standard");
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  const [selections, setSelections] = useState<CustomBowlSelection>({
    protein: undefined,
    base: undefined,
    marinade: undefined,
    freshIngredients: [],
    sauce: undefined,
    toppings: [],
    extraProtein: [],
    extraFreshIngredients: [],
    extraSauces: [],
    extraToppings: [],
  });
  const isMobile = useIsMobile();
  const contentRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const { items: cartItems } = useCartStore();
  const dragControls = useDragControls();
  
  const getScrollRef = () => isMobile ? mobileScrollRef : contentRef;

  useBodyScrollLock(isOpen);

  const { data: ingredients = [] } = useQuery<Ingredient[]>({
    queryKey: ['/api/ingredients'],
  });

  const getIngredientName = (id: string | undefined) => {
    if (!id) return "";
    const ingredient = ingredients.find(ing => ing.id === id);
    return ingredient?.nameDE || "";
  };

  useEffect(() => {
    if (isOpen && item) {
      setTimeout(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: 'instant' });
      }, 0);

      if (editingCartItemId) {
        const cartItem = cartItems.find(i => i.id === editingCartItemId);
        if (cartItem && cartItem.customization) {
          setCurrentStep(0);
          setSelectedSize(cartItem.size || "standard");
          setSelections(cartItem.customization);
          return;
        }
      }
      
      setCurrentStep(0);
      setSelectedSize("standard");
      setSelections({
        protein: undefined,
        base: undefined,
        marinade: undefined,
        freshIngredients: [],
        sauce: undefined,
        toppings: [],
        extraProtein: [],
        extraFreshIngredients: [],
        extraSauces: [],
        extraToppings: [],
      });
    }
  }, [item, isOpen, editingCartItemId, cartItems]);

  useEffect(() => {
    if (isOpen) {
      const currentType = STEPS[currentStep];
      const stepComplete = (() => {
        if (currentType === "protein" || currentType === "base" || currentType === "marinade" || currentType === "sauce") {
          return !!selections[currentType];
        } else if (currentType === "fresh") {
          return selections.freshIngredients?.length === 5;
        } else if (currentType === "topping") {
          return selections.toppings?.length === 3;
        }
        return false;
      })();

      if (stepComplete && (currentType === "fresh" || currentType === "topping")) {
        setTimeout(() => {
          nextButtonRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          });
        }, 300);
      }
    }
  }, [selections, isOpen, currentStep]);

  if (!item) return null;

  const currentStepType = STEPS[currentStep];
  const stepConfig = STEP_CONFIG[currentStepType];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const currentIngredients = ingredients.filter(
    ing => ing.type === currentStepType && ing.available === 1
  );

  const isStepComplete = () => {
    const current = currentStepType;
    if (current === "size") {
      return !!selectedSize;
    } else if (current === "protein" || current === "base" || current === "marinade" || current === "sauce") {
      const key = current as keyof typeof selections;
      return !!selections[key];
    } else if (current === "fresh") {
      return selections.freshIngredients?.length === 5;
    } else if (current === "topping") {
      return selections.toppings?.length === 3;
    } else if (current === "extras") {
      return true;
    }
    return false;
  };

  const handleSelect = (ingredientId: string) => {
    const current = currentStepType;
    
    if (current === "protein" || current === "base" || current === "marinade" || current === "sauce") {
      setSelections(prev => ({ ...prev, [current]: ingredientId }));
      setTimeout(() => {
        nextButtonRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
      }, 300);
    } else if (current === "fresh") {
      setSelections(prev => {
        const current = prev.freshIngredients || [];
        if (current.includes(ingredientId)) {
          return { ...prev, freshIngredients: current.filter(id => id !== ingredientId) };
        } else if (current.length < 5) {
          return { ...prev, freshIngredients: [...current, ingredientId] };
        }
        return prev;
      });
    } else if (current === "topping") {
      setSelections(prev => {
        const current = prev.toppings || [];
        if (current.includes(ingredientId)) {
          return { ...prev, toppings: current.filter(id => id !== ingredientId) };
        } else if (current.length < 3) {
          return { ...prev, toppings: [...current, ingredientId] };
        }
        return prev;
      });
    }
  };

  const isSelected = (ingredientId: string) => {
    const current = currentStepType;
    if (current === "protein" || current === "base" || current === "marinade" || current === "sauce") {
      return selections[current] === ingredientId;
    } else if (current === "fresh") {
      return selections.freshIngredients?.includes(ingredientId) || false;
    } else if (current === "topping") {
      return selections.toppings?.includes(ingredientId) || false;
    }
    return false;
  };

  const handleExtraSelect = (ingredientId: string, type: "protein" | "fresh" | "sauce" | "topping") => {
    const key = type === "protein" ? "extraProtein" : type === "fresh" ? "extraFreshIngredients" : type === "sauce" ? "extraSauces" : "extraToppings";
    setSelections(prev => {
      const current = prev[key] || [];
      if (current.includes(ingredientId)) {
        return { ...prev, [key]: current.filter(id => id !== ingredientId) };
      } else {
        return { ...prev, [key]: [...current, ingredientId] };
      }
    });
  };

  const isExtraSelected = (ingredientId: string, type: "protein" | "fresh" | "sauce" | "topping") => {
    const key = type === "protein" ? "extraProtein" : type === "fresh" ? "extraFreshIngredients" : type === "sauce" ? "extraSauces" : "extraToppings";
    return selections[key]?.includes(ingredientId) || false;
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1 && isStepComplete()) {
      setCurrentStep(prev => prev + 1);
      setTimeout(() => {
        getScrollRef().current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setTimeout(() => {
        getScrollRef().current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleComplete = () => {
    if (isStepComplete()) {
      const finalPrice = item.hasSizeOptions === 1 
        ? getSizePrice(selectedSize) 
        : parseFloat(item.price || "0").toFixed(2);
      onAddToCart(item, selectedSize, undefined, selections, finalPrice);
      onClose();
    }
  };

  const getSizePrice = (size: "klein" | "standard") => {
    const breakdown = pricingService.calculateWunschbowlPrice(selections, size, ingredients);
    return pricingService.formatPrice(breakdown.total);
  };

  const getDisplayPrice = () => {
    const isCustomBowl = item.isCustomBowl === 1;
    if (isCustomBowl || item.hasSizeOptions === 1) {
      return getSizePrice(selectedSize);
    }
    return parseFloat(item.price || "0").toFixed(2);
  };

  const getSizeButtonText = (size: "klein" | "standard") => {
    const minPrices = pricingService.getMinProteinPrices(ingredients);
    
    if (selections.protein) {
      return `€${getSizePrice(size)}`;
    }
    
    if (size === "klein") {
      return `ab €${pricingService.formatPrice(minPrices.kleinMin)}`;
    } else {
      return `ab €${pricingService.formatPrice(minPrices.standardMin)}`;
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y > 100) {
      onClose();
    }
  };

  // Mobile Bottom Sheet UI
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50" data-testid="dialog-bowl-builder">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="absolute inset-0 bg-black/50"
              onClick={onClose}
              data-testid="button-backdrop-close"
            />
            
            <motion.div
              ref={contentRef}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 40, stiffness: 500 }}
              drag="y"
              dragListener={false}
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={handleDragEnd}
              className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-[2rem] shadow-2xl overflow-hidden z-10"
              style={{ maxHeight: '92vh' }}
            >
              {/* Drag Handle */}
              <div 
                className="flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-5 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-poppins text-xl font-bold text-gray-900 dark:text-white">
                    {item.nameDE}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    data-testid="button-close-mobile"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                {/* Progress */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500 font-medium">Schritt {currentStep + 1}/{STEPS.length}</span>
                  <Progress value={progress} className="h-1.5 flex-1" />
                </div>
                
                {/* Step Title */}
                <p className={`font-poppins font-bold ${
                  currentStepType === "fresh" || currentStepType === "topping" || currentStepType === "extras"
                    ? "text-lg text-sunset"
                    : "text-base text-sunset"
                }`}>
                  {stepConfig.title}
                </p>
                
                {/* Selection Counter */}
                {(currentStepType === "fresh" || currentStepType === "topping") && (
                  <p className="text-sm text-gray-500 mt-1">
                    {currentStepType === "fresh" && `${selections.freshIngredients?.length || 0}/5 ausgewählt`}
                    {currentStepType === "topping" && `${selections.toppings?.length || 0}/3 ausgewählt`}
                  </p>
                )}
              </div>
              
              {/* Scrollable Content */}
              <div ref={mobileScrollRef} className="px-5 pb-28 overflow-y-auto" style={{ maxHeight: 'calc(92vh - 200px)' }}>
                
                {/* Size Selection */}
                {currentStepType === "size" && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setSelectedSize("klein")}
                      className={`flex-1 py-4 px-4 rounded-xl font-poppins font-semibold transition-all ${
                        selectedSize === "klein"
                          ? "bg-sunset text-white shadow-lg"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                      data-testid="button-size-klein"
                    >
                      <div className="text-base">Klein</div>
                      <div className="text-sm opacity-90 mt-1">{getSizeButtonText("klein")}</div>
                    </button>
                    <button
                      onClick={() => setSelectedSize("standard")}
                      className={`flex-1 py-4 px-4 rounded-xl font-poppins font-semibold transition-all ${
                        selectedSize === "standard"
                          ? "bg-sunset text-white shadow-lg"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                      data-testid="button-size-standard"
                    >
                      <div className="text-base">Standard</div>
                      <div className="text-sm opacity-90 mt-1">{getSizeButtonText("standard")}</div>
                    </button>
                  </div>
                )}

                {/* Single Selection Steps (protein, base, marinade, sauce) */}
                {(currentStepType === "protein" || currentStepType === "base" || currentStepType === "marinade" || currentStepType === "sauce") && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {currentIngredients.map((ingredient) => {
                      const selected = isSelected(ingredient.id);
                      return (
                        <button
                          key={ingredient.id}
                          onClick={() => handleSelect(ingredient.id)}
                          className={`relative rounded-xl overflow-hidden transition-all ${
                            selected
                              ? "ring-2 ring-sunset shadow-lg"
                              : "ring-1 ring-gray-200 dark:ring-gray-700"
                          }`}
                          data-testid={`card-ingredient-${ingredient.id}`}
                        >
                          <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
                            {ingredient.image && ingredient.image.trim() ? (
                              <img
                                src={ingredient.image}
                                alt={ingredient.nameDE}
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                Kein Bild
                              </div>
                            )}
                            {selected && (
                              <div className="absolute top-2 right-2 bg-sunset text-white rounded-full p-1">
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="p-2 bg-white dark:bg-gray-900 text-center">
                            <p className="font-poppins text-sm font-medium text-gray-900 dark:text-white truncate">
                              {ingredient.nameDE}
                            </p>
                            {currentStepType === "protein" && (
                              <p className="text-xs text-sunset font-bold mt-0.5">
                                {selectedSize === "klein" 
                                  ? (ingredient.priceSmall ? `€${ingredient.priceSmall}` : '')
                                  : (ingredient.priceStandard ? `€${ingredient.priceStandard}` : '')
                                }
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Multi Selection Steps (fresh, topping) */}
                {(currentStepType === "fresh" || currentStepType === "topping") && (
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {currentIngredients.map((ingredient) => {
                      const selected = isSelected(ingredient.id);
                      const maxReached = currentStepType === "fresh" 
                        ? (selections.freshIngredients?.length || 0) >= 5 
                        : (selections.toppings?.length || 0) >= 3;
                      const disabled = !selected && maxReached;
                      
                      return (
                        <button
                          key={ingredient.id}
                          onClick={() => !disabled && handleSelect(ingredient.id)}
                          disabled={disabled}
                          className={`relative rounded-xl overflow-hidden transition-all ${
                            selected
                              ? "ring-2 ring-sunset shadow-md"
                              : disabled
                              ? "opacity-40 ring-1 ring-gray-200"
                              : "ring-1 ring-gray-200 dark:ring-gray-700"
                          }`}
                          data-testid={`card-ingredient-${ingredient.id}`}
                        >
                          <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
                            {ingredient.image && ingredient.image.trim() ? (
                              <img
                                src={ingredient.image}
                                alt={ingredient.nameDE}
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                Kein Bild
                              </div>
                            )}
                            {selected && (
                              <div className="absolute top-1 right-1 bg-sunset text-white rounded-full p-0.5">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                          <div className="py-1.5 px-1 bg-white dark:bg-gray-900 text-center">
                            <p className="font-poppins text-xs font-medium text-gray-900 dark:text-white leading-tight line-clamp-2">
                              {ingredient.nameDE}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Extras Step */}
                {currentStepType === "extras" && (
                  <div className="space-y-6 pt-2">
                    {/* Skip Button */}
                    <button
                      onClick={() => mobileScrollRef.current?.scrollTo({ top: mobileScrollRef.current.scrollHeight, behavior: 'smooth' })}
                      className="w-full py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-poppins font-semibold text-gray-600 dark:text-gray-300"
                      data-testid="button-skip-extras"
                    >
                      Nein, danke - weiter zum Warenkorb
                    </button>

                    {/* Extra Categories */}
                    {[
                      { type: "extra_protein" as const, label: "Extra Protein", extraType: "protein" as const },
                      { type: "extra_fresh" as const, label: "Extra Zutaten", extraType: "fresh" as const },
                      { type: "extra_sauce" as const, label: "Extra Sauce", extraType: "sauce" as const },
                      { type: "extra_topping" as const, label: "Extra Toppings", extraType: "topping" as const },
                    ].map(({ type, label, extraType }) => {
                      const extraIngredients = ingredients.filter(ing => ing.type === type && ing.available === 1);
                      if (extraIngredients.length === 0) return null;
                      
                      return (
                        <div key={type}>
                          <h3 className="font-poppins font-bold text-base mb-3 text-gray-900 dark:text-white">{label}</h3>
                          <div className="grid grid-cols-3 gap-2">
                            {extraIngredients.map((ingredient) => {
                              const selected = isExtraSelected(ingredient.id, extraType);
                              return (
                                <button
                                  key={ingredient.id}
                                  onClick={() => handleExtraSelect(ingredient.id, extraType)}
                                  className={`relative rounded-xl overflow-hidden transition-all ${
                                    selected
                                      ? "ring-2 ring-sunset shadow-md"
                                      : "ring-1 ring-gray-200 dark:ring-gray-700"
                                  }`}
                                  data-testid={`card-extra-${extraType}-${ingredient.id}`}
                                >
                                  <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
                                    {ingredient.image && ingredient.image.trim() ? (
                                      <img
                                        src={ingredient.image}
                                        alt={ingredient.nameDE}
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                        Kein Bild
                                      </div>
                                    )}
                                    {selected && (
                                      <div className="absolute top-1 right-1 bg-sunset text-white rounded-full p-0.5">
                                        <Check className="w-3 h-3" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="py-1.5 px-1 bg-white dark:bg-gray-900 text-center">
                                    <p className="font-poppins text-xs font-medium text-gray-900 dark:text-white leading-tight line-clamp-2">
                                      {ingredient.nameDE}
                                    </p>
                                    <p className="text-xs text-sunset font-bold">
                                      +€{pricingService.formatPrice(pricingService.getExtraPrice(ingredient))}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Fixed Bottom Navigation */}
              <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-5 py-4 safe-area-pb">
                <div className="flex items-center gap-3">
                  {currentStep === 0 ? (
                    <button
                      onClick={onClose}
                      className="px-4 py-3 rounded-xl font-poppins font-semibold text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
                      data-testid="button-close"
                    >
                      Abbrechen
                    </button>
                  ) : (
                    <button
                      onClick={handlePrev}
                      className="px-4 py-3 rounded-xl font-poppins font-semibold text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 flex items-center"
                      data-testid="button-prev"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Zurück
                    </button>
                  )}

                  <div className="flex-1 text-center">
                    <span className="font-poppins text-lg font-bold text-sunset" data-testid="text-builder-price">
                      €{getDisplayPrice()}
                    </span>
                  </div>

                  {currentStep < STEPS.length - 1 ? (
                    <button
                      ref={nextButtonRef}
                      onClick={handleNext}
                      disabled={!isStepComplete()}
                      className={`px-5 py-3 rounded-xl font-poppins font-bold flex items-center transition-all ${
                        isStepComplete()
                          ? "bg-sunset text-white shadow-lg"
                          : "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                      }`}
                      data-testid="button-next"
                    >
                      Weiter
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  ) : (
                    <button
                      ref={nextButtonRef}
                      onClick={handleComplete}
                      className="flex-1 py-3 rounded-xl bg-sunset text-white font-poppins font-bold shadow-lg flex items-center justify-center"
                      data-testid="button-complete"
                    >
                      In den Warenkorb
                      <Check className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop Dialog UI
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent hideCloseButton={true} className="max-w-6xl max-h-[85dvh] p-4 sm:p-6 border border-gray-300 dark:border-gray-600 shadow-2xl" data-testid="dialog-bowl-builder">
        <div ref={contentRef} className="overflow-y-auto max-h-[calc(85dvh-80px)] overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
        <DialogHeader>
          <DialogTitle className="font-poppins text-2xl" data-testid="text-builder-title">
            {item.nameDE}
          </DialogTitle>
          <DialogDescription asChild>
            <p className={`font-poppins mt-2 ${
              currentStepType === "fresh" || currentStepType === "topping"
                ? "text-2xl font-bold text-sunset"
                : "text-lg font-semibold text-sunset"
            }`}>
              {stepConfig.title}
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-7 gap-6">
          {/* Main Content */}
          <div className="space-y-6 col-span-5">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-poppins text-muted-foreground">
              <span>Schritt {currentStep + 1} von {STEPS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Size Selection Step */}
          {currentStepType === "size" && (
            <div>
              <div className="flex gap-2 sm:gap-3">
                <Button
                  variant={selectedSize === "klein" ? "default" : "outline"}
                  onClick={() => setSelectedSize("klein")}
                  className={`flex-1 font-poppins font-semibold min-h-[56px] sm:min-h-[60px] ${
                    selectedSize === "klein" 
                      ? "bg-sunset text-white" 
                      : ""
                  }`}
                  data-testid="button-size-klein"
                >
                  <div className="text-center">
                    <div className="text-sm sm:text-base">Klein</div>
                    <div className="text-xs sm:text-sm font-normal">{getSizeButtonText("klein")}</div>
                  </div>
                </Button>
                <Button
                  variant={selectedSize === "standard" ? "default" : "outline"}
                  onClick={() => setSelectedSize("standard")}
                  className={`flex-1 font-poppins font-semibold min-h-[56px] sm:min-h-[60px] ${
                    selectedSize === "standard" 
                      ? "bg-sunset text-white" 
                      : ""
                  }`}
                  data-testid="button-size-standard"
                >
                  <div className="text-center">
                    <div className="text-sm sm:text-base">Standard</div>
                    <div className="text-xs sm:text-sm font-normal">{getSizeButtonText("standard")}</div>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {/* Extras Step - Categorized View */}
          {currentStepType === "extras" && (
            <div className="space-y-8">
              {/* Nein, Danke Button */}
              <div className="flex justify-center mb-6">
                <Button
                  onClick={() => {
                    contentRef.current?.scrollTo({ top: contentRef.current.scrollHeight, behavior: 'smooth' });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-poppins font-bold px-12 py-6 text-lg shadow-lg"
                  data-testid="button-skip-extras"
                >
                  Nein, Danke
                </Button>
              </div>

              {/* Extra Protein */}
              <div>
                <h3 className="font-poppins font-bold text-xl mb-4">Extra Protein</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {ingredients.filter(ing => ing.type === "extra_protein" && ing.available === 1).map((ingredient) => {
                    const selected = isExtraSelected(ingredient.id, "protein");
                    return (
                      <div
                        key={ingredient.id}
                        className={`relative rounded-lg border-2 overflow-hidden transition-all ${
                          selected ? "border-sunset shadow-lg" : "border-gray-200 hover:border-gray-300"
                        }`}
                        data-testid={`card-extra-protein-${ingredient.id}`}
                      >
                        <div className="aspect-square relative bg-gray-100 flex items-center justify-center">
                          {ingredient.image && ingredient.image.trim() ? (
                            <img src={ingredient.image} alt={ingredient.nameDE} loading="lazy" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gray-400 text-sm">Kein Bild</span>
                          )}
                          {selected && (
                            <div className="absolute top-2 right-2 bg-sunset text-white rounded-full p-1">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-white">
                          <p className="font-poppins text-sm font-medium text-center mb-1">{ingredient.nameDE}</p>
                          <p className="font-poppins text-sm text-center text-sunset font-bold mb-2">€{pricingService.formatPrice(pricingService.getExtraPrice(ingredient))}</p>
                          <Button
                            onClick={() => handleExtraSelect(ingredient.id, "protein")}
                            variant={selected ? "default" : "outline"}
                            size="sm"
                            className={`w-full font-poppins font-bold text-xs ${selected ? "bg-sunset text-white" : ""}`}
                            data-testid={`button-add-extra-protein-${ingredient.id}`}
                          >
                            {selected ? "HINZUGEFÜGT" : "HINZUFÜGEN"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Extra Fresh Ingredients */}
              <div>
                <h3 className="font-poppins font-bold text-xl mb-4">extra frische Zutaten</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {ingredients.filter(ing => ing.type === "extra_fresh" && ing.available === 1).map((ingredient) => {
                    const selected = isExtraSelected(ingredient.id, "fresh");
                    return (
                      <div
                        key={ingredient.id}
                        className={`relative rounded-lg border-2 overflow-hidden transition-all ${
                          selected ? "border-sunset shadow-lg" : "border-gray-200 hover:border-gray-300"
                        }`}
                        data-testid={`card-extra-fresh-${ingredient.id}`}
                      >
                        <div className="aspect-square relative bg-gray-100 flex items-center justify-center">
                          {ingredient.image && ingredient.image.trim() ? (
                            <img src={ingredient.image} alt={ingredient.nameDE} loading="lazy" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gray-400 text-sm">Kein Bild</span>
                          )}
                          {selected && (
                            <div className="absolute top-2 right-2 bg-sunset text-white rounded-full p-1">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-white">
                          <p className="font-poppins text-sm font-medium text-center mb-1">{ingredient.nameDE}</p>
                          <p className="font-poppins text-sm text-center text-sunset font-bold mb-2">€{pricingService.formatPrice(pricingService.getExtraPrice(ingredient))}</p>
                          <Button
                            onClick={() => handleExtraSelect(ingredient.id, "fresh")}
                            variant={selected ? "default" : "outline"}
                            size="sm"
                            className={`w-full font-poppins font-bold text-xs ${selected ? "bg-sunset text-white" : ""}`}
                            data-testid={`button-add-extra-fresh-${ingredient.id}`}
                          >
                            {selected ? "HINZUGEFÜGT" : "HINZUFÜGEN"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Extra Sauces */}
              <div>
                <h3 className="font-poppins font-bold text-xl mb-4">extra Sauce</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {ingredients.filter(ing => ing.type === "extra_sauce" && ing.available === 1).map((ingredient) => {
                    const selected = isExtraSelected(ingredient.id, "sauce");
                    return (
                      <div
                        key={ingredient.id}
                        className={`relative rounded-lg border-2 overflow-hidden transition-all ${
                          selected ? "border-sunset shadow-lg" : "border-gray-200 hover:border-gray-300"
                        }`}
                        data-testid={`card-extra-sauce-${ingredient.id}`}
                      >
                        <div className="aspect-square relative bg-gray-100 flex items-center justify-center">
                          {ingredient.image && ingredient.image.trim() ? (
                            <img src={ingredient.image} alt={ingredient.nameDE} loading="lazy" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gray-400 text-sm">Kein Bild</span>
                          )}
                          {selected && (
                            <div className="absolute top-2 right-2 bg-sunset text-white rounded-full p-1">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-white">
                          <p className="font-poppins text-sm font-medium text-center mb-1">{ingredient.nameDE}</p>
                          <p className="font-poppins text-sm text-center text-sunset font-bold mb-2">€{pricingService.formatPrice(pricingService.getExtraPrice(ingredient))}</p>
                          <Button
                            onClick={() => handleExtraSelect(ingredient.id, "sauce")}
                            variant={selected ? "default" : "outline"}
                            size="sm"
                            className={`w-full font-poppins font-bold text-xs ${selected ? "bg-sunset text-white" : ""}`}
                            data-testid={`button-add-extra-sauce-${ingredient.id}`}
                          >
                            {selected ? "HINZUGEFÜGT" : "HINZUFÜGEN"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Extra Toppings */}
              <div>
                <h3 className="font-poppins font-bold text-xl mb-4">extra Toppings</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {ingredients.filter(ing => ing.type === "extra_topping" && ing.available === 1).map((ingredient) => {
                    const selected = isExtraSelected(ingredient.id, "topping");
                    return (
                      <div
                        key={ingredient.id}
                        className={`relative rounded-lg border-2 overflow-hidden transition-all ${
                          selected ? "border-sunset shadow-lg" : "border-gray-200 hover:border-gray-300"
                        }`}
                        data-testid={`card-extra-topping-${ingredient.id}`}
                      >
                        <div className="aspect-square relative bg-gray-100 flex items-center justify-center">
                          {ingredient.image && ingredient.image.trim() ? (
                            <img src={ingredient.image} alt={ingredient.nameDE} loading="lazy" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gray-400 text-sm">Kein Bild</span>
                          )}
                          {selected && (
                            <div className="absolute top-2 right-2 bg-sunset text-white rounded-full p-1">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-white">
                          <p className="font-poppins text-sm font-medium text-center mb-1">{ingredient.nameDE}</p>
                          <p className="font-poppins text-sm text-center text-sunset font-bold mb-2">€{pricingService.formatPrice(pricingService.getExtraPrice(ingredient))}</p>
                          <Button
                            onClick={() => handleExtraSelect(ingredient.id, "topping")}
                            variant={selected ? "default" : "outline"}
                            size="sm"
                            className={`w-full font-poppins font-bold text-xs ${selected ? "bg-sunset text-white" : ""}`}
                            data-testid={`button-add-extra-topping-${ingredient.id}`}
                          >
                            {selected ? "HINZUGEFÜGT" : "HINZUFÜGEN"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* Ingredient Selection Grid (for non-extras and non-size steps) */}
          {currentStepType !== "extras" && currentStepType !== "size" && (
            <>
              <motion.div 
                key={currentStepType}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
              {currentIngredients.map((ingredient) => {
                const selected = isSelected(ingredient.id);
                return (
                  <div
                    key={ingredient.id}
                    className={`relative rounded-lg border-2 overflow-hidden transition-all ${
                      selected 
                        ? "border-sunset shadow-lg" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    data-testid={`card-ingredient-${ingredient.id}`}
                  >
                    {/* Image */}
                    <div className="aspect-square relative bg-gray-100 flex items-center justify-center">
                      {ingredient.image && ingredient.image.trim() ? (
                        <img
                          src={ingredient.image}
                          alt={ingredient.nameDE}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          data-testid={`img-ingredient-${ingredient.id}`}
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">Kein Bild</span>
                      )}
                      {selected && (
                        <div className="absolute top-2 right-2 bg-sunset text-white rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    
                    {/* Name and Price */}
                    <div className="p-2 bg-white">
                      <p className="font-poppins text-sm font-medium text-center mb-1" data-testid={`text-ingredient-name-${ingredient.id}`}>
                        {ingredient.nameDE}
                        {/* Show price for regular ingredients if price > 0 */}
                        {currentStepType !== "protein" && pricingService.getIngredientPrice(ingredient) > 0 && (
                          <span className="text-sunset font-bold ml-1">
                            +€{pricingService.formatPrice(pricingService.getIngredientPrice(ingredient))}
                          </span>
                        )}
                      </p>
                      
                      {/* Price for protein */}
                      {currentStepType === "protein" && (
                        <p className="font-poppins text-xs text-center text-muted-foreground mb-2">
                          {selectedSize === "klein" ? (
                            <>{ingredient.priceSmall ? `€${ingredient.priceSmall}` : (ingredient.price ? `€${ingredient.price}` : '')}</>
                          ) : (
                            <>{ingredient.priceStandard ? `€${ingredient.priceStandard}` : (ingredient.price ? `€${ingredient.price}` : '')}</>
                          )}
                        </p>
                      )}
                      
                      {/* Add Button */}
                      <Button
                        onClick={() => handleSelect(ingredient.id)}
                        variant={selected ? "default" : "outline"}
                        size="sm"
                        className={`w-full font-poppins font-bold text-xs transition-all duration-200 ${
                          selected 
                            ? "bg-sunset text-white shadow-md" 
                            : "border-sunset/40 hover:border-sunset hover:bg-sunset/5 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                        }`}
                        data-testid={`button-add-ingredient-${ingredient.id}`}
                      >
                        {selected ? "AUSGEWÄHLT" : "WÄHLEN"}
                      </Button>
                    </div>
                  </div>
                );
              })}
              </motion.div>

            </>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t gap-2">
            {currentStep === 0 ? (
              <Button
                onClick={onClose}
                variant="outline"
                className="font-poppins min-h-[48px] sm:min-h-[44px] min-w-[80px] text-sm sm:text-base"
                data-testid="button-close"
              >
                <span>Schließen</span>
              </Button>
            ) : (
              <Button
                onClick={handlePrev}
                variant="outline"
                className="font-poppins min-h-[48px] sm:min-h-[44px] min-w-[80px] text-sm sm:text-base"
                data-testid="button-prev"
              >
                <ChevronLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Zurück</span>
              </Button>
            )}

            {currentStep > 0 && (
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="font-poppins text-lg sm:text-2xl font-bold text-sunset" data-testid="text-builder-price">
                  €{getDisplayPrice()}
                </span>
              </div>
            )}

            {currentStep < STEPS.length - 1 ? (
              <Button
                ref={nextButtonRef}
                onClick={handleNext}
                disabled={!isStepComplete()}
                className="bg-sunset hover:bg-sunset-dark text-white font-poppins font-bold min-h-[48px] sm:min-h-[44px] min-w-[80px] text-sm sm:text-base"
                data-testid="button-next"
              >
                <span className="hidden sm:inline">Weiter</span>
                <span className="sm:hidden">Weiter</span>
                <ChevronRight className="w-4 h-4 sm:ml-2" />
              </Button>
            ) : (
              <Button
                ref={nextButtonRef}
                onClick={handleComplete}
                disabled={!isStepComplete()}
                className="bg-green-500 hover:bg-green-600 text-white font-poppins font-bold px-4 sm:px-8 shadow-lg min-h-[48px] sm:min-h-[44px] text-sm sm:text-base"
                data-testid="button-complete"
              >
                <span className="hidden sm:inline">In den Warenkorb</span>
                <span className="sm:hidden">Hinzufügen</span>
                <Check className="w-4 h-4 ml-1 sm:ml-2" />
              </Button>
            )}
          </div>

          {/* Helper Text */}
          <p className="text-center text-sm text-muted-foreground font-lato">
            {currentStepType === "fresh" && `${selections.freshIngredients?.length || 0} von 5 ausgewählt`}
            {currentStepType === "topping" && `${selections.toppings?.length || 0} von 3 ausgewählt`}
            {(currentStepType === "protein" || currentStepType === "base" || currentStepType === "marinade" || currentStepType === "sauce") && 
              !isStepComplete() && "Bitte wähle eine Option"}
          </p>

          </div>

          {/* Summary Sidebar (Desktop only) */}
          <div className="col-span-2 border-l pl-6 space-y-4">
            <h3 className="font-poppins font-bold text-lg text-foreground">Deine Auswahl</h3>
            
            {/* Size */}
            <div>
              <p className="font-semibold text-sm text-muted-foreground mb-1">Größe:</p>
              <Badge variant="outline">{selectedSize === "klein" ? "Klein" : "Standard"}</Badge>
            </div>

            {/* Protein */}
            {selections.protein && (
              <div>
                <p className="font-semibold text-sm text-muted-foreground mb-1">Protein:</p>
                <Badge variant="outline">{getIngredientName(selections.protein)}</Badge>
              </div>
            )}

            {/* Base */}
            {selections.base && (
              <div>
                <p className="font-semibold text-sm text-muted-foreground mb-1">Base:</p>
                <Badge variant="outline">{getIngredientName(selections.base)}</Badge>
              </div>
            )}

            {/* Marinade */}
            {selections.marinade && (
              <div>
                <p className="font-semibold text-sm text-muted-foreground mb-1">Marinade:</p>
                <Badge variant="outline">{getIngredientName(selections.marinade)}</Badge>
              </div>
            )}

            {/* Fresh Ingredients */}
            {selections.freshIngredients && selections.freshIngredients.length > 0 && (
              <div>
                <p className="font-semibold text-sm text-muted-foreground mb-1">Zutaten:</p>
                <div className="flex flex-wrap gap-1">
                  {selections.freshIngredients.map((ing, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{getIngredientName(ing)}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Sauce */}
            {selections.sauce && (
              <div>
                <p className="font-semibold text-sm text-muted-foreground mb-1">Sauce:</p>
                <Badge variant="outline">{getIngredientName(selections.sauce)}</Badge>
              </div>
            )}

            {/* Toppings */}
            {selections.toppings && selections.toppings.length > 0 && (
              <div>
                <p className="font-semibold text-sm text-muted-foreground mb-1">Toppings:</p>
                <div className="flex flex-wrap gap-1">
                  {selections.toppings.map((topping, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{getIngredientName(topping)}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="pt-4 border-t">
              <p className="font-semibold text-sm text-muted-foreground mb-1">Gesamtpreis:</p>
              <p className="font-poppins text-3xl font-bold text-sunset">€{getDisplayPrice()}</p>
            </div>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
