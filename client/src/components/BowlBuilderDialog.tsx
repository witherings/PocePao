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

interface BowlBuilderDialogProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, size: "klein" | "standard", customization: CustomBowlSelection, customPrice?: string) => void;
  editingCartItemId?: string | null;
}

type BuilderStep = "protein" | "base" | "marinade" | "fresh" | "sauce" | "topping" | "extras";

const STEPS: BuilderStep[] = ["protein", "base", "marinade", "fresh", "sauce", "topping", "extras"];

const STEP_CONFIG = {
  protein: { title: "Wähle dein Protein", min: 1, max: 1 },
  base: { title: "Wähle deine Base", min: 1, max: 1 },
  marinade: { title: "Wähle deine Marinade", min: 1, max: 1 },
  fresh: { title: "Wähle 4 frische Zutaten", min: 4, max: 4 },
  sauce: { title: "Wähle deine Sauce", min: 1, max: 1 },
  topping: { title: "Wähle 3 Toppings", min: 3, max: 3 },
  extras: { title: "Deine extra (optional)", min: 0, max: 999 },
};

export function BowlBuilderDialog({ item, isOpen, onClose, onAddToCart, editingCartItemId }: BowlBuilderDialogProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<"klein" | "standard">("standard");
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
  const { items: cartItems } = useCartStore();

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
    if (current === "protein" || current === "base" || current === "marinade" || current === "sauce") {
      const key = current as keyof typeof selections;
      return !!selections[key];
    } else if (current === "fresh") {
      return selections.freshIngredients?.length === 4;
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
    } else if (current === "fresh") {
      setSelections(prev => {
        const current = prev.freshIngredients || [];
        if (current.includes(ingredientId)) {
          return { ...prev, freshIngredients: current.filter(id => id !== ingredientId) };
        } else if (current.length < 4) {
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
      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleComplete = () => {
    if (isStepComplete()) {
      // Calculate final price based on selected protein and size
      const finalPrice = item.hasSizeOptions === 1 ? getSizePrice(selectedSize) : parseFloat(item.price).toFixed(2);
      onAddToCart(item, selectedSize, selections, finalPrice);
      onClose();
    }
  };

  const getSizePrice = (size: "klein" | "standard") => {
    // Get selected protein's base price
    const selectedProtein = selections.protein 
      ? ingredients.find(ing => ing.id === selections.protein)
      : null;
    
    const basePrice = selectedProtein?.price 
      ? parseFloat(selectedProtein.price) 
      : parseFloat(item.price);

    let totalPrice = basePrice;

    if (size === "standard") {
      // Standard pricing: +5.25 for €9.50 proteins, +6.00 for €9.90 proteins
      const priceIncrease = basePrice === 9.90 ? 6.00 : 5.25;
      totalPrice += priceIncrease;
    }

    // Add extras pricing
    totalPrice += (selections.extraProtein?.length || 0) * 3.70;
    totalPrice += (selections.extraFreshIngredients?.length || 0) * 1.00;
    totalPrice += (selections.extraSauces?.length || 0) * 0.60;
    totalPrice += (selections.extraToppings?.length || 0) * 0.60;

    return totalPrice.toFixed(2);
  };

  const getDisplayPrice = () => {
    if (item.hasSizeOptions === 1) {
      return getSizePrice(selectedSize);
    }
    return parseFloat(item.price).toFixed(2);
  };

  // Get price range for protein options
  const getProteinPriceRange = () => {
    const proteinIngredients = ingredients.filter(
      ing => ing.type === "protein" && ing.available === 1 && ing.price
    );
    
    if (proteinIngredients.length === 0) {
      return { min: parseFloat(item.price), max: parseFloat(item.price) };
    }
    
    const prices = proteinIngredients.map(ing => parseFloat(ing.price || "0"));
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  };

  const getSizeButtonText = (size: "klein" | "standard") => {
    const priceRange = getProteinPriceRange();
    
    if (selections.protein) {
      // If protein is selected, show exact price
      return `€${getSizePrice(size)}`;
    }
    
    // Show price range
    if (size === "klein") {
      if (priceRange.min === priceRange.max) {
        return `ab €${priceRange.min.toFixed(2)}`;
      }
      return `€${priceRange.min.toFixed(2)} - €${priceRange.max.toFixed(2)}`;
    } else {
      const minStandard = priceRange.min + (priceRange.min === 9.90 ? 6.00 : 5.25);
      const maxStandard = priceRange.max + (priceRange.max === 9.90 ? 6.00 : 5.25);
      if (minStandard === maxStandard) {
        return `ab €${minStandard.toFixed(2)}`;
      }
      return `€${minStandard.toFixed(2)} - €${maxStandard.toFixed(2)}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]" data-testid="dialog-bowl-builder">
        <div ref={contentRef} className="overflow-y-auto max-h-[calc(90vh-80px)]">
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

        <div className={`${isMobile ? '' : 'grid grid-cols-3 gap-6'}`}>
          {/* Main Content */}
          <div className={`space-y-6 ${isMobile ? '' : 'col-span-2'}`}>
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-poppins text-muted-foreground">
              <span>Schritt {currentStep + 1} von {STEPS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Size Selection (shown on first step) */}
          {currentStep === 0 && item.hasSizeOptions === 1 && (
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
                    <div className="text-sm font-normal">{getSizeButtonText("klein")}</div>
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
                    <div className="text-sm font-normal">{getSizeButtonText("standard")}</div>
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
                  {ingredients.filter(ing => ing.type === "protein" && ing.available === 1).map((ingredient) => {
                    const selected = isExtraSelected(ingredient.id, "protein");
                    return (
                      <div
                        key={ingredient.id}
                        className={`relative rounded-lg border-2 overflow-hidden transition-all ${
                          selected ? "border-ocean shadow-lg" : "border-gray-200 hover:border-gray-300"
                        }`}
                        data-testid={`card-extra-protein-${ingredient.id}`}
                      >
                        <div className="aspect-square relative">
                          <img src={ingredient.image} alt={ingredient.nameDE} loading="lazy" className="w-full h-full object-cover" />
                          {selected && (
                            <div className="absolute top-2 right-2 bg-ocean text-white rounded-full p-1">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-white">
                          <p className="font-poppins text-sm font-medium text-center mb-1">{ingredient.nameDE}</p>
                          <p className="font-poppins text-sm text-center text-sunset font-bold mb-2">€3.70</p>
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
                  {ingredients.filter(ing => ing.type === "fresh" && ing.available === 1).map((ingredient) => {
                    const selected = isExtraSelected(ingredient.id, "fresh");
                    return (
                      <div
                        key={ingredient.id}
                        className={`relative rounded-lg border-2 overflow-hidden transition-all ${
                          selected ? "border-ocean shadow-lg" : "border-gray-200 hover:border-gray-300"
                        }`}
                        data-testid={`card-extra-fresh-${ingredient.id}`}
                      >
                        <div className="aspect-square relative">
                          <img src={ingredient.image} alt={ingredient.nameDE} loading="lazy" className="w-full h-full object-cover" />
                          {selected && (
                            <div className="absolute top-2 right-2 bg-ocean text-white rounded-full p-1">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-white">
                          <p className="font-poppins text-sm font-medium text-center mb-1">{ingredient.nameDE}</p>
                          <p className="font-poppins text-sm text-center text-sunset font-bold mb-2">€1.00</p>
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
                  {ingredients.filter(ing => ing.type === "sauce" && ing.available === 1).map((ingredient) => {
                    const selected = isExtraSelected(ingredient.id, "sauce");
                    return (
                      <div
                        key={ingredient.id}
                        className={`relative rounded-lg border-2 overflow-hidden transition-all ${
                          selected ? "border-ocean shadow-lg" : "border-gray-200 hover:border-gray-300"
                        }`}
                        data-testid={`card-extra-sauce-${ingredient.id}`}
                      >
                        <div className="aspect-square relative">
                          <img src={ingredient.image} alt={ingredient.nameDE} loading="lazy" className="w-full h-full object-cover" />
                          {selected && (
                            <div className="absolute top-2 right-2 bg-ocean text-white rounded-full p-1">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-white">
                          <p className="font-poppins text-sm font-medium text-center mb-1">{ingredient.nameDE}</p>
                          <p className="font-poppins text-sm text-center text-sunset font-bold mb-2">€0.60</p>
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
                  {ingredients.filter(ing => ing.type === "topping" && ing.available === 1).map((ingredient) => {
                    const selected = isExtraSelected(ingredient.id, "topping");
                    return (
                      <div
                        key={ingredient.id}
                        className={`relative rounded-lg border-2 overflow-hidden transition-all ${
                          selected ? "border-ocean shadow-lg" : "border-gray-200 hover:border-gray-300"
                        }`}
                        data-testid={`card-extra-topping-${ingredient.id}`}
                      >
                        <div className="aspect-square relative">
                          <img src={ingredient.image} alt={ingredient.nameDE} loading="lazy" className="w-full h-full object-cover" />
                          {selected && (
                            <div className="absolute top-2 right-2 bg-ocean text-white rounded-full p-1">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-white">
                          <p className="font-poppins text-sm font-medium text-center mb-1">{ingredient.nameDE}</p>
                          <p className="font-poppins text-sm text-center text-sunset font-bold mb-2">€0.60</p>
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

          {/* Ingredient Selection Grid (for non-extras steps) */}
          {currentStepType !== "extras" && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentIngredients.map((ingredient) => {
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
                    <div className="aspect-square relative">
                      <img
                        src={ingredient.image}
                        alt={ingredient.nameDE}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        data-testid={`img-ingredient-${ingredient.id}`}
                      />
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
                      {currentStepType === "protein" && ingredient.price && (
                        <p className="font-poppins text-xs text-center text-muted-foreground mb-2">
                          {selectedSize === "klein" ? (
                            <>€{ingredient.price}</>
                          ) : (
                            <>€{(parseFloat(ingredient.price) + (parseFloat(ingredient.price) === 9.90 ? 6.00 : 5.25)).toFixed(2)}</>
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
              </div>

            </>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
              variant="outline"
              className="font-poppins"
              data-testid="button-prev"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>

            <div className="flex items-center gap-2">
              <span className="font-poppins text-2xl font-bold text-ocean" data-testid="text-builder-price">
                €{getDisplayPrice()}
              </span>
            </div>

            {currentStep < STEPS.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepComplete()}
                className="bg-sunset hover:bg-sunset-dark text-white font-poppins font-bold"
                data-testid="button-next"
              >
                Weiter
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!isStepComplete()}
                className="bg-green-500 hover:bg-green-600 text-white font-poppins font-bold px-8 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
                data-testid="button-complete"
              >
                In den Warenkorb
                <Check className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Helper Text */}
          <p className="text-center text-sm text-muted-foreground font-lato">
            {currentStepType === "fresh" && `${selections.freshIngredients?.length || 0} von 4 ausgewählt`}
            {currentStepType === "topping" && `${selections.toppings?.length || 0} von 3 ausgewählt`}
            {(currentStepType === "protein" || currentStepType === "base" || currentStepType === "marinade" || currentStepType === "sauce") && 
              !isStepComplete() && "Bitte wähle eine Option"}
          </p>
          </div>

          {/* Summary Sidebar (Desktop only) */}
          {!isMobile && (
            <div className="col-span-1 border-l pl-6 space-y-4">
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
