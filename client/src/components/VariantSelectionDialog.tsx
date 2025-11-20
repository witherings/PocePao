import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import type { MenuItem, ProductVariant } from "@shared/schema";

interface VariantSelectionDialogProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, variantId: string, variantName: string) => void;
}

export function VariantSelectionDialog({ item, isOpen, onClose, onAddToCart }: VariantSelectionDialogProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");

  // Fetch variants for this menu item
  const { data: allVariants = [] } = useQuery<ProductVariant[]>({
    queryKey: ['/api/product-variants'],
  });

  const variants = item ? allVariants.filter(v => v.menuItemId === item.id && v.available === 1).sort((a, b) => a.order - b.order) : [];

  // Reset selection when dialog opens or item changes
  useEffect(() => {
    if (isOpen && item) {
      setSelectedVariantId("");
    }
  }, [isOpen, item]);

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-poppins font-bold text-2xl text-ocean">{item.nameDE}</DialogTitle>
          <DialogDescription className="font-poppins text-sm text-gray-600">
            Wähle eine {variantTypeLabel} aus {variants.length} verfügbaren {variantTypeLabelPlural}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup value={selectedVariantId} onValueChange={setSelectedVariantId}>
            <div className="space-y-3">
              {variants.map((variant) => (
                <div 
                  key={variant.id} 
                  className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-ocean transition-colors cursor-pointer"
                  onClick={() => setSelectedVariantId(variant.id)}
                >
                  <RadioGroupItem value={variant.id} id={variant.id} />
                  <Label 
                    htmlFor={variant.id} 
                    className="flex-1 font-poppins text-base cursor-pointer"
                  >
                    {variant.nameDE}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 font-poppins font-bold"
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!selectedVariantId}
            className="flex-1 font-poppins font-bold bg-sunset hover:bg-sunset/90 text-white"
          >
            Hinzufügen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
