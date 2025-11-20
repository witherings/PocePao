import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

interface PriceRange {
  kleinMin: string;
  kleinMax: string;
  standardMin: string;
  standardMax: string;
}

export function useCustomBowlPrices(): PriceRange {
  const { data: ingredients = [] } = useQuery<any[]>({
    queryKey: ["/api/ingredients"],
  });

  const priceRange = useMemo(() => {
    const proteins = ingredients.filter(
      (ing: any) => ing.type === 'protein' && ing.available === 1
    );
    
    // Default fallback values
    const defaults = {
      kleinMin: '9.50',
      kleinMax: '9.90',
      standardMin: '14.75',
      standardMax: '15.90',
    };
    
    if (proteins.length === 0) return defaults;
    
    // Parse and validate klein prices
    const kleinPrices = proteins
      .map((p: any) => {
        const price = parseFloat(p.priceSmall || p.price || '0');
        return !isNaN(price) && price > 0 ? price : null;
      })
      .filter((p): p is number => p !== null);
    
    // Parse and validate standard prices
    const standardPrices = proteins
      .map((p: any) => {
        const price = parseFloat(p.priceStandard || p.price || '0');
        return !isNaN(price) && price > 0 ? price : null;
      })
      .filter((p): p is number => p !== null);
    
    return {
      kleinMin: kleinPrices.length > 0 ? Math.min(...kleinPrices).toFixed(2) : defaults.kleinMin,
      kleinMax: kleinPrices.length > 0 ? Math.max(...kleinPrices).toFixed(2) : defaults.kleinMax,
      standardMin: standardPrices.length > 0 ? Math.min(...standardPrices).toFixed(2) : defaults.standardMin,
      standardMax: standardPrices.length > 0 ? Math.max(...standardPrices).toFixed(2) : defaults.standardMax,
    };
  }, [ingredients]);

  return priceRange;
}
