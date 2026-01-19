import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import type { MenuItem, ProductVariant } from "@shared/schema";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
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
  const [stepIndex, setStepIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: allVariants = [] } = useQuery<ProductVariant[]>({
    queryKey: ['/api/product-variants'],
  });

  const baseVariants = item ? allVariants.filter(v => v.menuItemId === item.id && v.type === 'base' && v.available === 1).sort((a, b) => a.order - b.order) : [];
  const flavorVariants = item ? allVariants.filter(v => v.menuItemId === item.id && v.type === 'flavor' && v.available === 1).sort((a, b) => a.order - b.order) : [];

  useEffect(() => {
    if (isOpen) {
      if (item?.hasSizeOptions === 1) setSelectedSize("standard");
      setSelectedBase("");
      setSelectedFlavor("");
      setSelectedFlavorId("");
      
      const needsSize = item?.hasSizeOptions === 1 || item?.priceSmall;
      const needsVar = baseVariants.length > 0 || flavorVariants.length > 0;
      setStepIndex(needsSize ? 0 : (needsVar ? 1 : 2));

      if (baseVariants.length === 1 && !selectedBase) {
        setSelectedBase(baseVariants[0].nameDE);
      }
    }
  }, [item?.id, isOpen]);

  if (!item) return null;

  const getDisplayPrice = () => {
    if (selectedSize === "klein" && item.priceSmall) return item.priceSmall;
    return item.price;
  };

  const handleAddToCart = () => {
    onAddToCart(item, selectedSize, selectedBase, null, getDisplayPrice(), selectedFlavorId || undefined, selectedFlavor || undefined);
    onClose();
  };

  const needsSizeSelection = item.hasSizeOptions === 1 || item.priceSmall;
  const needsVariantSelection = baseVariants.length > 0 || flavorVariants.length > 0;
  const getSizeName = () => selectedSize === "klein" ? "Klein" : "Standard";
  const getBaseOrVariantName = () => selectedFlavor || selectedBase || null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent ref={contentRef} className="w-[95dvw] h-[95dvh] max-w-6xl max-h-[95dvh] p-0 overflow-hidden border border-gray-300 dark:border-gray-600 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full overflow-hidden">
          <div className="hidden lg:flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
            <img src={item.image || "/images/default-dish.png"} alt={item.nameDE} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col overflow-hidden lg:overflow-y-auto h-full p-6">
            <div className="lg:hidden relative aspect-[4/3] rounded-lg overflow-hidden mb-4 flex-shrink-0">
              <img src={item.image || "/images/default-dish.png"} alt={item.nameDE} className="w-full h-full object-cover" />
            </div>

            <h2 className="font-poppins text-2xl font-bold text-foreground mb-2 flex-shrink-0">{item.nameDE}</h2>
            {item.descriptionDE && <p className="font-lato text-sm text-muted-foreground mb-4 flex-shrink-0">{item.descriptionDE}</p>}

            <div className="flex-grow overflow-hidden flex flex-col min-h-0">
              {isMobile ? (
                <>
                  {stepIndex === 0 && needsSizeSelection && (
                    <div className="flex flex-col h-full min-h-0">
                      <h3 className="font-poppins font-bold text-base mb-1">Schritt 1: Größe wählen</h3>
                      <div className="grid grid-rows-2 gap-1 flex-grow">
                        <button onClick={() => { setSelectedSize("klein"); setStepIndex(needsVariantSelection ? 1 : 2); }} className={`p-2 rounded-lg border-2 ${selectedSize === "klein" ? "bg-ocean text-white border-ocean" : "bg-white border-gray-300"}`}>Klein {item.priceSmall && `(€${item.priceSmall})`}</button>
                        <button onClick={() => { setSelectedSize("standard"); setStepIndex(needsVariantSelection ? 1 : 2); }} className={`p-2 rounded-lg border-2 ${selectedSize === "standard" ? "bg-ocean text-white border-ocean" : "bg-white border-gray-300"}`}>Standard (€{item.price})</button>
                      </div>
                    </div>
                  )}

                  {stepIndex === 1 && needsVariantSelection && (
                    <div className="flex flex-col h-full min-h-0">
                      <h3 className="font-poppins font-bold text-base mb-1">Schritt 2: Basis/Variante wählen</h3>
                      <div className="grid gap-1 flex-grow overflow-y-auto">
                        {baseVariants.map(v => (
                          <button key={v.id} onClick={() => { setSelectedBase(v.nameDE); setStepIndex(2); }} className={`p-2 rounded-lg border-2 ${selectedBase === v.nameDE ? "bg-ocean text-white border-ocean" : "bg-white border-gray-300"}`}>{v.nameDE}</button>
                        ))}
                        {flavorVariants.map(v => (
                          <button key={v.id} onClick={() => { setSelectedFlavorId(v.id); setSelectedFlavor(v.nameDE); setStepIndex(2); }} className={`p-2 rounded-lg border-2 ${selectedFlavorId === v.id ? "bg-ocean text-white border-ocean" : "bg-white border-gray-300"}`}>{v.nameDE}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {stepIndex === 2 && (
                    <div className="flex flex-col h-full min-h-0">
                      <h3 className="font-poppins font-bold text-base mb-2">Deine Auswahl:</h3>
                      <div className="space-y-2 mb-4">
                        {needsSizeSelection && <div className="flex gap-2"><span>Größe:</span><Badge className="bg-ocean text-white">{getSizeName()}</Badge></div>}
                        {getBaseOrVariantName() && <div className="flex gap-2"><span>Variante:</span><Badge className="bg-ocean text-white">{getBaseOrVariantName()}</Badge></div>}
                      </div>
                      <div className="mt-auto">
                        <Button onClick={handleAddToCart} className="w-full bg-ocean text-white h-12 rounded-xl">Warenkorb hinzufügen • €{getDisplayPrice()}</Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-6">
                  {needsSizeSelection && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Größe wählen</h4>
                      <div className="flex gap-2">
                        <Button variant={selectedSize === "klein" ? "default" : "outline"} onClick={() => setSelectedSize("klein")} className={`flex-1 ${selectedSize === "klein" ? "bg-ocean text-white" : ""}`}>Klein</Button>
                        <Button variant={selectedSize === "standard" ? "default" : "outline"} onClick={() => setSelectedSize("standard")} className={`flex-1 ${selectedSize === "standard" ? "bg-ocean text-white" : ""}`}>Standard</Button>
                      </div>
                    </div>
                  )}
                  {baseVariants.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Basis wählen</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {baseVariants.map(v => (
                          <Button key={v.id} variant={selectedBase === v.nameDE ? "default" : "outline"} onClick={() => setSelectedBase(v.nameDE)} className={selectedBase === v.nameDE ? "bg-ocean text-white" : ""}>{v.nameDE}</Button>
                        ))}
                      </div>
                    </div>
                  )}
                  {flavorVariants.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Geschmacksrichtung wählen</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {flavorVariants.map(v => (
                          <Button key={v.id} variant={selectedFlavorId === v.id ? "default" : "outline"} onClick={() => { setSelectedFlavorId(v.id); setSelectedFlavor(v.nameDE); }} className={selectedFlavorId === v.id ? "bg-ocean text-white" : ""}>{v.nameDE}</Button>
                        ))}
                      </div>
                    </div>
                  )}
                  <Button onClick={handleAddToCart} className="w-full bg-ocean text-white h-14 rounded-xl mt-4">Warenkorb hinzufügen • €{getDisplayPrice()}</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}