import type { Ingredient, CustomBowlSelection } from "@shared/schema";

export interface PriceBreakdown {
  protein: number;
  base: number;
  ingredients: Array<{ name: string; price: number; type: string }>;
  extras: Array<{ name: string; price: number; type: string }>;
  total: number;
}

export interface MinPrices {
  kleinMin: number;
  standardMin: number;
}

export const pricingService = {
  getProteinPrice(ingredient: Ingredient, size: "klein" | "standard"): number {
    if (size === "klein") {
      return ingredient.priceSmall 
        ? parseFloat(String(ingredient.priceSmall))
        : ingredient.price 
          ? parseFloat(String(ingredient.price))
          : 0;
    } else {
      return ingredient.priceStandard 
        ? parseFloat(String(ingredient.priceStandard))
        : ingredient.price 
          ? parseFloat(String(ingredient.price))
          : 0;
    }
  },

  getExtraPrice(ingredient: Ingredient): number {
    if (ingredient.extraPrice) {
      return parseFloat(String(ingredient.extraPrice));
    }
    if (ingredient.price) {
      return parseFloat(String(ingredient.price));
    }
    return 0;
  },

  getIngredientPrice(ingredient: Ingredient): number {
    if (ingredient.price) {
      return parseFloat(String(ingredient.price));
    }
    return 0;
  },

  calculateWunschbowlPrice(
    selections: CustomBowlSelection,
    size: "klein" | "standard",
    ingredients: Ingredient[]
  ): PriceBreakdown {
    let totalPrice = 0;
    const breakdown: PriceBreakdown = { 
      protein: 0, 
      base: 0,
      ingredients: [],
      extras: [], 
      total: 0 
    };

    const selectedProtein = selections.protein 
      ? ingredients.find(ing => ing.id === selections.protein)
      : null;

    if (selectedProtein) {
      const proteinPrice = this.getProteinPrice(selectedProtein, size);
      totalPrice += proteinPrice;
      breakdown.protein = proteinPrice;
    }

    // Helper function to add regular ingredient price
    const addIngredientPrice = (ingredientId: string | undefined, type: string) => {
      if (!ingredientId) return;
      const ingredient = ingredients.find(ing => ing.id === ingredientId);
      if (ingredient) {
        const price = this.getIngredientPrice(ingredient);
        if (price > 0) {
          breakdown.ingredients.push({ 
            name: ingredient.nameDE, 
            price, 
            type 
          });
          totalPrice += price;
        }
      }
    };

    // Helper function to add regular ingredient price from array
    const addIngredientPrices = (ingredientIds: string[] | undefined, type: string) => {
      if (!ingredientIds) return;
      ingredientIds.forEach(id => addIngredientPrice(id, type));
    };

    // Calculate prices for regular ingredients (base, marinade, sauce, fresh, toppings)
    addIngredientPrice(selections.base, "Basis");
    addIngredientPrice(selections.marinade, "Marinade");
    addIngredientPrice(selections.sauce, "Soße");
    addIngredientPrices(selections.freshIngredients, "Frische Zutat");
    addIngredientPrices(selections.toppings, "Topping");

    // Helper function for extra ingredients
    const addExtraPrice = (ingredientId: string, type: string) => {
      const ingredient = ingredients.find(ing => ing.id === ingredientId);
      if (ingredient) {
        const price = this.getExtraPrice(ingredient);
        if (price > 0) {
          breakdown.extras.push({ 
            name: ingredient.nameDE, 
            price, 
            type 
          });
          totalPrice += price;
        }
      }
    };

    (selections.extraProtein || []).forEach(id => addExtraPrice(id, "Extra Protein"));
    (selections.extraFreshIngredients || []).forEach(id => addExtraPrice(id, "Extra Frisch"));
    (selections.extraSauces || []).forEach(id => addExtraPrice(id, "Extra Sauce"));
    (selections.extraToppings || []).forEach(id => addExtraPrice(id, "Extra Topping"));

    breakdown.total = totalPrice;
    return breakdown;
  },

  getMinProteinPrices(ingredients: Ingredient[]): MinPrices {
    const proteinIngredients = ingredients.filter(
      ing => ing.type === "protein" && ing.available === 1
    );

    if (proteinIngredients.length === 0) {
      return { kleinMin: 0, standardMin: 0 };
    }

    const kleinPrices = proteinIngredients
      .map(ing => this.getProteinPrice(ing, "klein"))
      .filter(p => p > 0);

    const standardPrices = proteinIngredients
      .map(ing => this.getProteinPrice(ing, "standard"))
      .filter(p => p > 0);

    return {
      kleinMin: kleinPrices.length > 0 ? Math.min(...kleinPrices) : 0,
      standardMin: standardPrices.length > 0 ? Math.min(...standardPrices) : 0
    };
  },

  formatPrice(price: number): string {
    return price.toFixed(2);
  },

  formatPriceWithCurrency(price: number): string {
    return `€${price.toFixed(2)}`;
  }
};
