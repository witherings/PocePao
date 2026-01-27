import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, ChevronDown } from "lucide-react";
import type { MenuItem, ProductVariant } from "@shared/schema";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { motion, AnimatePresence } from "framer-motion";

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

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent 
              className="fixed inset-0 p-0 border-0 bg-transparent max-w-none w-full h-full flex flex-col justify-end"
              style={{ maxWidth: '100vw', maxHeight: '100vh' }}
            >
              <VisuallyHidden>
                <DialogTitle>{item.nameDE}</DialogTitle>
              </VisuallyHidden>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
                data-testid="button-backdrop-close"
              />
              
              <div className="absolute top-0 left-0 right-0 h-[35vh] flex items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="relative w-48 h-48 sm:w-56 sm:h-56"
                >
                  <img 
                    src={item.image || "/images/default-dish.png"} 
                    alt={item.nameDE} 
                    className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white"
                  />
                </motion.div>
              </div>
              
              <motion.div
                ref={contentRef}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative bg-white dark:bg-gray-900 rounded-t-[2rem] shadow-2xl overflow-hidden"
                style={{ maxHeight: '70vh' }}
              >
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-3 mb-2" />
                
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover-elevate transition-colors z-10"
                  data-testid="button-close-dialog"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
                
                <div className="px-6 pb-6 pt-2 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 80px)' }}>
                  <h2 className="font-poppins text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {item.nameDE}
                  </h2>
                  
                  {item.descriptionDE && (
                    <p className="font-lato text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
                      {item.descriptionDE}
                    </p>
                  )}
                  
                  {needsSizeSelection && (
                    <div className="mb-5">
                      <h3 className="font-poppins font-semibold text-base text-gray-700 dark:text-gray-300 mb-3">
                        Größe wählen
                      </h3>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedSize("klein")}
                          className={`flex-1 py-3 px-4 rounded-xl font-poppins font-medium text-base transition-all duration-200 hover-elevate ${
                            selectedSize === "klein"
                              ? "bg-sunset text-white shadow-lg shadow-sunset/30"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          }`}
                          data-testid="button-size-klein"
                        >
                          <span className="block">Klein</span>
                          {item.priceSmall && (
                            <span className={`text-sm ${selectedSize === "klein" ? "text-white/90" : "text-gray-500"}`}>
                              €{item.priceSmall}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => setSelectedSize("standard")}
                          className={`flex-1 py-3 px-4 rounded-xl font-poppins font-medium text-base transition-all duration-200 hover-elevate ${
                            selectedSize === "standard"
                              ? "bg-sunset text-white shadow-lg shadow-sunset/30"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          }`}
                          data-testid="button-size-standard"
                        >
                          <span className="block">Standard</span>
                          <span className={`text-sm ${selectedSize === "standard" ? "text-white/90" : "text-gray-500"}`}>
                            €{item.price}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {baseVariants.length > 0 && (
                    <div className="mb-5">
                      <h3 className="font-poppins font-semibold text-base text-gray-700 dark:text-gray-300 mb-3">
                        Basis wählen
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {baseVariants.map(v => (
                          <button
                            key={v.id}
                            onClick={() => setSelectedBase(v.nameDE)}
                            className={`py-3 px-4 rounded-xl font-poppins font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 hover-elevate ${
                              selectedBase === v.nameDE
                                ? "bg-sunset text-white shadow-lg shadow-sunset/30"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            }`}
                            data-testid={`button-base-${v.id}`}
                          >
                            {selectedBase === v.nameDE && <Check className="w-4 h-4" />}
                            {v.nameDE}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {flavorVariants.length > 0 && (
                    <div className="mb-5">
                      <h3 className="font-poppins font-semibold text-base text-gray-700 dark:text-gray-300 mb-3">
                        Geschmack wählen
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {flavorVariants.map(v => (
                          <button
                            key={v.id}
                            onClick={() => { setSelectedFlavorId(v.id); setSelectedFlavor(v.nameDE); }}
                            className={`py-3 px-4 rounded-xl font-poppins font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 hover-elevate ${
                              selectedFlavorId === v.id
                                ? "bg-sunset text-white shadow-lg shadow-sunset/30"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            }`}
                            data-testid={`button-flavor-${v.id}`}
                          >
                            {selectedFlavorId === v.id && <Check className="w-4 h-4" />}
                            {v.nameDE}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {(needsSizeSelection || needsVariantSelection) && (selectedBase || selectedFlavor || selectedSize) && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <p className="font-poppins text-xs text-gray-500 dark:text-gray-400 mb-2">Deine Auswahl:</p>
                      <div className="flex flex-wrap gap-2">
                        {needsSizeSelection && (
                          <Badge className="bg-ocean text-white text-xs px-3 py-1">
                            {selectedSize === "klein" ? "Klein" : "Standard"}
                          </Badge>
                        )}
                        {selectedBase && (
                          <Badge className="bg-ocean text-white text-xs px-3 py-1">{selectedBase}</Badge>
                        )}
                        {selectedFlavor && (
                          <Badge className="bg-ocean text-white text-xs px-3 py-1">{selectedFlavor}</Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="sticky bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                  <Button 
                    onClick={handleAddToCart}
                    className="w-full h-14 rounded-2xl bg-sunset text-white font-poppins font-bold text-lg shadow-lg shadow-sunset/30 transition-all duration-200"
                    data-testid="button-add-to-cart"
                  >
                    In den Warenkorb • €{getDisplayPrice()}
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        ref={contentRef} 
        className="w-[95dvw] max-w-4xl p-0 overflow-hidden border-0 shadow-2xl rounded-2xl"
      >
        <VisuallyHidden>
          <DialogTitle>{item.nameDE}</DialogTitle>
        </VisuallyHidden>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="hidden lg:flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 overflow-hidden relative aspect-square">
            <img 
              src={item.image || "/images/default-dish.png"} 
              alt={item.nameDE} 
              className="w-full h-full object-cover" 
            />
          </div>

          <div className="flex flex-col p-8 bg-white dark:bg-gray-950">
            <div className="lg:hidden relative aspect-video rounded-xl overflow-hidden mb-6 shadow-lg">
              <img 
                src={item.image || "/images/default-dish.png"} 
                alt={item.nameDE} 
                className="w-full h-full object-cover" 
              />
            </div>

            <h2 className="font-poppins text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {item.nameDE}
            </h2>
            
            {item.descriptionDE && (
              <p className="font-lato text-base text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                {item.descriptionDE}
              </p>
            )}

            <div className="space-y-6 flex-grow">
              {needsSizeSelection && (
                <div>
                  <h4 className="font-poppins font-semibold text-base text-gray-700 dark:text-gray-300 mb-3">
                    Größe wählen
                  </h4>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedSize("klein")}
                      className={`flex-1 py-3 px-4 rounded-xl font-poppins font-medium transition-all duration-200 hover-elevate ${
                        selectedSize === "klein"
                          ? "bg-sunset text-white shadow-lg shadow-sunset/30"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                      data-testid="button-desktop-size-klein"
                    >
                      Klein {item.priceSmall && `(€${item.priceSmall})`}
                    </button>
                    <button
                      onClick={() => setSelectedSize("standard")}
                      className={`flex-1 py-3 px-4 rounded-xl font-poppins font-medium transition-all duration-200 hover-elevate ${
                        selectedSize === "standard"
                          ? "bg-sunset text-white shadow-lg shadow-sunset/30"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                      data-testid="button-desktop-size-standard"
                    >
                      Standard (€{item.price})
                    </button>
                  </div>
                </div>
              )}

              {baseVariants.length > 0 && (
                <div>
                  <h4 className="font-poppins font-semibold text-base text-gray-700 dark:text-gray-300 mb-3">
                    Basis wählen
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {baseVariants.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedBase(v.nameDE)}
                        className={`py-3 px-4 rounded-xl font-poppins font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 hover-elevate ${
                          selectedBase === v.nameDE
                            ? "bg-sunset text-white shadow-lg shadow-sunset/30"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                        data-testid={`button-desktop-base-${v.id}`}
                      >
                        {selectedBase === v.nameDE && <Check className="w-4 h-4" />}
                        {v.nameDE}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {flavorVariants.length > 0 && (
                <div>
                  <h4 className="font-poppins font-semibold text-base text-gray-700 dark:text-gray-300 mb-3">
                    Geschmack wählen
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {flavorVariants.map(v => (
                      <button
                        key={v.id}
                        onClick={() => { setSelectedFlavorId(v.id); setSelectedFlavor(v.nameDE); }}
                        className={`py-3 px-4 rounded-xl font-poppins font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 hover-elevate ${
                          selectedFlavorId === v.id
                            ? "bg-sunset text-white shadow-lg shadow-sunset/30"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                        data-testid={`button-desktop-flavor-${v.id}`}
                      >
                        {selectedFlavorId === v.id && <Check className="w-4 h-4" />}
                        {v.nameDE}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button 
              onClick={handleAddToCart}
              className="w-full h-14 rounded-2xl bg-sunset text-white font-poppins font-bold text-lg shadow-lg shadow-sunset/30 mt-6 transition-all duration-200"
              data-testid="button-desktop-add-to-cart"
            >
              In den Warenkorb • €{getDisplayPrice()}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
