import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import type { MenuItem, ProductVariant } from "@shared/schema";

interface VariantSelectionDialogProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, variantId: string, variantName: string) => void;
}

export function VariantSelectionDialog({ item, isOpen, onClose, onAddToCart }: VariantSelectionDialogProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const isMobile = useIsMobile();

  useBodyScrollLock(isOpen);

  const { data: allVariants = [] } = useQuery<ProductVariant[]>({
    queryKey: ['/api/product-variants'],
  });

  const variants = item ? allVariants.filter(v => v.menuItemId === item.id && v.available === 1).sort((a, b) => a.order - b.order) : [];

  useEffect(() => {
    if (isOpen && item) {
      setSelectedVariantId("");
    }
  }, [isOpen, item]);

  useEffect(() => {
    if (isOpen) {
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

  const handleAdd = () => {
    if (!item || !selectedVariantId) return;
    
    const selectedVariant = variants.find(v => v.id === selectedVariantId);
    if (!selectedVariant) return;

    onAddToCart(item, selectedVariantId, selectedVariant.nameDE);
    onClose();
  };

  if (!item) return null;

  const variantTypeLabel = item.variantType === 'base' ? 'Base' : 'Geschmacksrichtung';
  const variantTypeLabelPlural = item.variantType === 'base' ? 'Basen' : 'Geschmacksrichtungen';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`${isMobile ? 'w-[95dvw] max-w-[95dvw]' : 'max-w-md'} p-0 overflow-hidden border border-gray-300 dark:border-gray-600 shadow-2xl`}
        data-testid="dialog-variant-selection"
      >
        <div className="flex flex-col h-full max-h-[85dvh]">
          {/* Header with image for mobile */}
          {isMobile && item.image && (
            <div className="relative aspect-[16/9] overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.nameDE}
                loading="lazy"
                className="w-full h-full object-cover"
                data-testid="img-variant-dialog-item"
              />
            </div>
          )}

          <div className="p-4 flex flex-col flex-grow min-h-0">
            <DialogHeader className="flex-shrink-0 mb-3">
              <DialogTitle className="font-poppins font-bold text-xl text-ocean" data-testid="text-variant-dialog-title">
                {item.nameDE}
              </DialogTitle>
              <DialogDescription className="font-poppins text-sm text-muted-foreground">
                Wähle eine {variantTypeLabel} aus {variants.length} verfügbaren {variantTypeLabelPlural}
              </DialogDescription>
            </DialogHeader>

            {/* Variant Selection - fills available space on mobile */}
            <div className={`flex-grow min-h-0 ${isMobile ? 'overflow-y-auto' : ''}`}>
              {isMobile ? (
                <div 
                  className="grid gap-2" 
                  style={{ gridTemplateRows: variants.length <= 4 ? `repeat(${variants.length}, 1fr)` : undefined }}
                >
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`font-poppins font-semibold px-4 py-3 rounded-lg border-2 transition-all text-center min-h-[48px] ${
                        selectedVariantId === variant.id 
                          ? "bg-ocean text-white border-ocean shadow-md" 
                          : "bg-white text-foreground border-gray-300 dark:bg-gray-800 dark:border-gray-600 hover:border-ocean"
                      }`}
                      data-testid={`button-variant-${variant.id}`}
                    >
                      {variant.nameDE}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {variants.map((variant) => (
                    <Button
                      key={variant.id}
                      variant={selectedVariantId === variant.id ? "default" : "outline"}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`font-poppins font-semibold min-h-[48px] text-sm ${
                        selectedVariantId === variant.id 
                          ? "bg-ocean hover:bg-ocean/90 text-white" 
                          : ""
                      }`}
                      data-testid={`button-variant-${variant.id}`}
                    >
                      {variant.nameDE}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="flex gap-3 mt-4 flex-shrink-0">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 font-poppins font-bold min-h-[48px]"
                data-testid="button-variant-cancel"
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleAdd}
                disabled={!selectedVariantId}
                className="flex-1 font-poppins font-bold bg-sunset hover:bg-sunset/90 text-white min-h-[48px]"
                data-testid="button-variant-add"
              >
                Hinzufügen
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
