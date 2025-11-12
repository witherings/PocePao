import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { MenuItem } from "@shared/schema";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface BowlInfoDialogProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onStartBuilder: () => void;
}

export function BowlInfoDialog({ item, isOpen, onClose, onStartBuilder }: BowlInfoDialogProps) {
  useBodyScrollLock(isOpen);

  if (!item) return null;

  const includedItems = [
    { label: "1 Protein", description: "Tofu, Falafel, Hähnchen, Lachs oder Ente" },
    { label: "1 Base", description: "Reis, Salat oder gemischt" },
    { label: "1 Marinade", description: "Verschiedene Marinaden zur Auswahl" },
    { label: "4 Frische Zutaten", description: "Avocado, Gurke, Mango, Edamame und mehr" },
    { label: "1 Sauce", description: "Sesam, Granatapfel, Nori und mehr" },
    { label: "3 Toppings", description: "Verschiedene leckere Toppings" },
    { label: "Extras (Optional)", description: "Zusätzliche Proteine, Zutaten oder Sauces" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 border border-gray-300 dark:border-gray-600 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-poppins text-2xl font-bold text-ocean">
            {item.nameDE}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {item.image && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700">
              <img
                src={item.image}
                alt={item.nameDE}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {item.descriptionDE && (
            <p className="font-lato text-muted-foreground text-center">
              {item.descriptionDE}
            </p>
          )}

          <div>
            <h3 className="font-poppins font-bold text-lg mb-4 text-center">
              Was ist enthalten:
            </h3>
            <div className="space-y-3">
              {includedItems.map((incItem, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-ocean/5 to-transparent border border-ocean/10"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 rounded-full bg-ocean/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-ocean" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="font-poppins font-semibold text-sm text-foreground">
                      {incItem.label}
                    </p>
                    <p className="font-lato text-xs text-muted-foreground">
                      {incItem.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-sunset/10 to-ocean/10 rounded-lg p-4 border border-sunset/20">
            <p className="font-lato text-sm text-center text-foreground">
              <strong className="font-poppins">Preise:</strong> Klein (€{item.priceSmall || "9.50"}) • Standard (€{item.priceLarge || item.price || "14.75"})
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 font-poppins"
              data-testid="button-cancel"
            >
              Abbrechen
            </Button>
            <Button
              onClick={() => {
                onClose();
                onStartBuilder();
              }}
              className="flex-1 bg-gradient-to-r from-sunset to-sunset-dark hover:opacity-90 text-white font-poppins font-semibold shadow-lg hover:shadow-xl transition-all"
              data-testid="button-start-builder"
            >
              Jetzt gestalten
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
