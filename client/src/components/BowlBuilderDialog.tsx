import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import type { MenuItem, Ingredient, CustomBowlSelection } from "@shared/schema";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCartStore } from "@/lib/cartStore";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { motion, AnimatePresence } from "framer-motion";

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
  extras: { title: "Deine extra (optional)", min: 0, max: 999 },
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
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const { items: cartItems } = useCartStore();

  useBodyScrollLock(isOpen);

  // Fetch ingredients
  const { data: ingredients = [] } = useQuery<Ingredient[]>({
    queryKey: ['/api/ingredients'],
  });

  // Helper function to get ingredient name by ID
  const getIngredientName = (id: string | undefined) => {
    if (!id) return "";
    const ingredient = ingredients.find(ing => ing.id === id);
    return ingredient?.nameDE || "";
  };


  // Reset when dialog opens or item changes
  useEffect(() => {
    if (isOpen && item) {
      // Scroll to top when dialog opens
      setTimeout(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: 'instant' });
      }, 0);

      // If editing, load existing data from cart
      if (editingCartItemId) {
        const cartItem = cartItems.find(i => i.id === editingCartItemId);
        if (cartItem && cartItem.customization) {
          setCurrentStep(0);
          setSelectedSize(cartItem.size || "standard");
          setSelections(cartItem.customization);
          return;
        }
      }
      
      // Otherwise reset to defaults
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

  // Auto-scroll to next button when max ingredients reached
  useEffect(() => {
    if (isOpen) {
      const currentType = STEPS[currentStep];
      // Check if step is complete
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

      // Only auto-scroll for steps with multiple selections
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

  // Filter ingredients for current step
  const currentIngredients = ingredients.filter(
    ing => ing.type === currentStepType && ing.available === 1
  );

  // Check if current step is complete
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

  // Handle ingredient selection
  const handleSelect = (ingredientId: string) => {
    const current = currentStepType;
    
    if (current === "protein" || current === "base" || current === "marinade" || current === "sauce") {
      setSelections(prev => ({ ...prev, [current]: ingredientId }));
      // Scroll to next button after selection
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

  // Handle extras selection
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
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setTimeout(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleComplete = () => {
    if (isStepComplete()) {
      // Calculate final price based on selected protein and size
      const finalPrice = item.hasSizeOptions === 1 
        ? getSizePrice(selectedSize) 
        : parseFloat(item.price || "0").toFixed(2);
      console.log('🛒 Adding Wunsch Bowl to cart:', {
        selectedSize,
        finalPrice,
        selectedProtein: selections.protein,
        protein: selections.protein ? ingredients.find(i => i.id === selections.protein)?.nameDE : 'N/A'
      });
      onAddToCart(item, selectedSize, undefined, selections, finalPrice);
      onClose();
    }
  };

  const getSizePrice = (size: "klein" | "standard") => {
    // Get selected protein from DB
    const selectedProtein = selections.protein 
      ? ingredients.find(ing => ing.id === selections.protein)
      : null;
    
    let totalPrice = 0;
    const breakdown: { protein: number; extras: Array<{ name?: string; price: number }> } = { protein: 0, extras: [] };

    // Add protein price based on size (from database)
    if (selectedProtein) {
      let proteinPrice = 0;
      
      if (size === "klein") {
        proteinPrice = selectedProtein.priceSmall 
          ? parseFloat(String(selectedProtein.priceSmall))
          : selectedProtein.price 
            ? parseFloat(String(selectedProtein.price))
            : 0;
      } else if (size === "standard") {
        proteinPrice = selectedProtein.priceStandard 
          ? parseFloat(String(selectedProtein.priceStandard))
          : selectedProtein.price 
            ? parseFloat(String(selectedProtein.price))
            : 0;
      }
      
      totalPrice += proteinPrice;
      breakdown.protein = proteinPrice;
    }

    // Add extras pricing - sum actual ingredient prices from DB
    const extraProteinPrice = (selections.extraProtein || []).reduce((sum, ingredientId) => {
      const ingredient = ingredients.find(ing => ing.id === ingredientId);
      const price = ingredient?.price ? parseFloat(String(ingredient.price)) : 0;
      if (price > 0) breakdown.extras.push({ name: ingredient?.nameDE, price });
      return sum + price;
    }, 0);
    totalPrice += extraProteinPrice;
    
    const extraFreshPrice = (selections.extraFreshIngredients || []).reduce((sum, ingredientId) => {
      const ingredient = ingredients.find(ing => ing.id === ingredientId);
      const price = ingredient?.price ? parseFloat(String(ingredient.price)) : 0;
      if (price > 0) breakdown.extras.push({ name: ingredient?.nameDE, price });
      return sum + price;
    }, 0);
    totalPrice += extraFreshPrice;
    
    const extraSaucesPrice = (selections.extraSauces || []).reduce((sum, ingredientId) => {
      const ingredient = ingredients.find(ing => ing.id === ingredientId);
      const price = ingredient?.price ? parseFloat(String(ingredient.price)) : 0;
      if (price > 0) breakdown.extras.push({ name: ingredient?.nameDE, price });
      return sum + price;
    }, 0);
    totalPrice += extraSaucesPrice;
    
    const extraToppingsPrice = (selections.extraToppings || []).reduce((sum, ingredientId) => {
      const ingredient = ingredients.find(ing => ing.id === ingredientId);
      const price = ingredient?.price ? parseFloat(String(ingredient.price)) : 0;
      if (price > 0) breakdown.extras.push({ name: ingredient?.nameDE, price });
      return sum + price;
    }, 0);
    totalPrice += extraToppingsPrice;

    const finalPrice = totalPrice.toFixed(2);
    console.log('💰 getSizePrice calculation:', { size, breakdown, finalPrice });
    return finalPrice;
  };

  const getDisplayPrice = () => {
    // For custom bowl (Wunsch Bowl), ALWAYS calculate from selected ingredients
    const isCustomBowl = item.isCustomBowl === 1;
    
    if (isCustomBowl || item.hasSizeOptions === 1) {
      return getSizePrice(selectedSize);
    }
    
    return parseFloat(item.price || "0").toFixed(2);
  };

  // Get price range for protein options (Klein prices)
  const getProteinPriceRange = () => {
    const proteinIngredients = ingredients.filter(
      ing => ing.type === "protein" && ing.available === 1
    );
    
    if (proteinIngredients.length === 0) {
      return { 
        min: parseFloat(item.price || "0"), 
        max: parseFloat(item.price || "0") 
      };
    }
    
    // Get KLEIN prices (priceSmall) from each ingredient - fallback to price
    const kleinPrices = proteinIngredients.map(ing => {
      let price = 0;
      if (ing.priceSmall) {
        price = parseFloat(String(ing.priceSmall));
      } else if (ing.price) {
        price = parseFloat(String(ing.price));
      }
      return price;
    }).filter(p => p > 0);
    
    if (kleinPrices.length === 0) {
      return { 
        min: parseFloat(item.price || "0"), 
        max: parseFloat(item.price || "0") 
      };
    }
    
    return {
      min: Math.min(...kleinPrices),
      max: Math.max(...kleinPrices)
    };
  };

  // Get Standard prices for Wunsch Bowl menu display
  const getCustomBowlMenuPrices = () => {
    const proteinIngredients = ingredients.filter(
      ing => ing.type === "protein" && ing.available === 1
    );
    
    if (proteinIngredients.length === 0) {
      return { kleinMin: "0.00", standardMin: "0.00" };
    }
    
    // Get Klein prices (priceSmall)
    const kleinPrices = proteinIngredients
      .map(ing => ing.priceSmall ? parseFloat(String(ing.priceSmall)) : (ing.price ? parseFloat(String(ing.price)) : 0))
      .filter(p => p > 0);
    
    // Get Standard prices (priceStandard)
    const standardPrices = proteinIngredients
      .map(ing => ing.priceStandard ? parseFloat(String(ing.priceStandard)) : 0)
      .filter(p => p > 0);
    
    const kleinMin = kleinPrices.length > 0 ? Math.min(...kleinPrices).toFixed(2) : "0.00";
    const standardMin = standardPrices.length > 0 ? Math.min(...standardPrices).toFixed(2) : "0.00";
    
    return { kleinMin, standardMin };
  };

  const getSizeButtonText = (size: "klein" | "standard") => {
    const priceRange = getProteinPriceRange();
    
    if (selections.protein) {
      // If protein is selected, show exact price
      return `€${getSizePrice(size)}`;
    }
    
    // Show minimum price only
    if (size === "klein") {
      return `ab €${priceRange.min.toFixed(2)}`;
    } else {
      // Get minimum standard price from available proteins
      const proteinIngredients = ingredients.filter(
        ing => ing.type === "protein" && ing.available === 1
      );
      
      let minStandardPrice = priceRange.min + 5.25; // Default: min klein price + 5.25
      
      // Check if any protein has priceStandard defined
      const standardPrices = proteinIngredients
        .map(ing => ing.priceStandard ? parseFloat(String(ing.priceStandard)) : 0)
        .filter(p => p > 0);
      
      if (standardPrices.length > 0) {
        minStandardPrice = Math.min(...standardPrices);
      }
      
      return `ab €${minStandardPrice.toFixed(2)}`;
    }
  };

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
                ? "text-2xl font-bold text-ocean"
                : "text-lg font-semibold text-ocean"
            }`}>
              {stepConfig.title}
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className={`${isMobile ? '' : 'grid grid-cols-7 gap-6'}`}>
          {/* Main Content */}
          <div className={`space-y-6 ${isMobile ? '' : 'col-span-5'}`}>
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
                      ? "bg-ocean hover:bg-ocean/90 text-white" 
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
                      ? "bg-ocean hover:bg-ocean/90 text-white" 
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
                  className="bg-red-500 hover:bg-red-600 text-white font-poppins font-bold px-12 py-6 text-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
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
                          selected ? "border-ocean shadow-lg" : "border-gray-200 hover:border-gray-300"
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
                            <div className="absolute top-2 right-2 bg-ocean text-white rounded-full p-1">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-white">
                          <p className="font-poppins text-sm font-medium text-center mb-1">{ingredient.nameDE}</p>
                          <p className="font-poppins text-sm text-center text-sunset font-bold mb-2">€{(parseFloat(String(ingredient.price || "0"))).toFixed(2)}</p>
                          <Button
                            onClick={() => handleExtraSelect(ingredient.id, "protein")}
                            variant={selected ? "default" : "outline"}
                            size="sm"
                            className={`w-full font-poppins font-bold text-xs ${selected ? "bg-ocean hover:bg-ocean/90 text-white" : ""}`}
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
                          selected ? "border-ocean shadow-lg" : "border-gray-200 hover:border-gray-300"
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
                            <div className="absolute top-2 right-2 bg-ocean text-white rounded-full p-1">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-white">
                          <p className="font-poppins text-sm font-medium text-center mb-1">{ingredient.nameDE}</p>
                          <p className="font-poppins text-sm text-center text-sunset font-bold mb-2">€{(parseFloat(String(ingredient.price || "0"))).toFixed(2)}</p>
                          <Button
                            onClick={() => handleExtraSelect(ingredient.id, "fresh")}
                            variant={selected ? "default" : "outline"}
                            size="sm"
                            className={`w-full font-poppins font-bold text-xs ${selected ? "bg-ocean hover:bg-ocean/90 text-white" : ""}`}
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
                          selected ? "border-ocean shadow-lg" : "border-gray-200 hover:border-gray-300"
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
                            <div className="absolute top-2 right-2 bg-ocean text-white rounded-full p-1">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-white">
                          <p className="font-poppins text-sm font-medium text-center mb-1">{ingredient.nameDE}</p>
                          <p className="font-poppins text-sm text-center text-sunset font-bold mb-2">€{(parseFloat(String(ingredient.price || "0"))).toFixed(2)}</p>
                          <Button
                            onClick={() => handleExtraSelect(ingredient.id, "sauce")}
                            variant={selected ? "default" : "outline"}
                            size="sm"
                            className={`w-full font-poppins font-bold text-xs ${selected ? "bg-ocean hover:bg-ocean/90 text-white" : ""}`}
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
                          selected ? "border-ocean shadow-lg" : "border-gray-200 hover:border-gray-300"
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
                            <div className="absolute top-2 right-2 bg-ocean text-white rounded-full p-1">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-white">
                          <p className="font-poppins text-sm font-medium text-center mb-1">{ingredient.nameDE}</p>
                          <p className="font-poppins text-sm text-center text-sunset font-bold mb-2">€{(parseFloat(String(ingredient.price || "0"))).toFixed(2)}</p>
                          <Button
                            onClick={() => handleExtraSelect(ingredient.id, "topping")}
                            variant={selected ? "default" : "outline"}
                            size="sm"
                            className={`w-full font-poppins font-bold text-xs ${selected ? "bg-ocean hover:bg-ocean/90 text-white" : ""}`}
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
              {currentIngredients.map((ingredient, index) => {
                const selected = isSelected(ingredient.id);
                return (
                  <div
                    key={ingredient.id}
                    className={`relative rounded-lg border-2 overflow-hidden transition-all ${
                      selected 
                        ? "border-ocean shadow-lg" 
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
                        <div className="absolute top-2 right-2 bg-ocean text-white rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    
                    {/* Name and Price */}
                    <div className="p-2 bg-white">
                      <p className="font-poppins text-sm font-medium text-center mb-1" data-testid={`text-ingredient-name-${ingredient.id}`}>
                        {ingredient.nameDE}
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
                            ? "bg-ocean hover:bg-ocean/90 text-white shadow-md" 
                            : "border-ocean/40 hover:border-ocean hover:bg-ocean/5 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
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
                <span className="font-poppins text-lg sm:text-2xl font-bold text-ocean" data-testid="text-builder-price">
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

          {/* Mobile Collapsible Summary */}
          {isMobile && (
            <div className="mt-6 border-t pt-4">
              <Button
                onClick={() => setShowMobileSummary(!showMobileSummary)}
                variant="outline"
                className="w-full font-poppins font-semibold"
                data-testid="button-toggle-summary"
              >
                {showMobileSummary ? "Auswahl verbergen" : "Deine Auswahl anzeigen"}
                <ChevronRight className={`w-4 h-4 ml-2 transition-transform ${showMobileSummary ? 'rotate-90' : ''}`} />
              </Button>
              
              <AnimatePresence>
                {showMobileSummary && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 pt-4">
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
                      <div className="pt-3 border-t">
                        <p className="font-semibold text-sm text-muted-foreground mb-1">Gesamtpreis:</p>
                        <p className="font-poppins text-2xl font-bold text-ocean">€{getDisplayPrice()}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          </div>

          {/* Summary Sidebar (Desktop only) */}
          {!isMobile && (
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
                <p className="font-poppins text-3xl font-bold text-ocean">€{getDisplayPrice()}</p>
              </div>
            </div>
          )}
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
