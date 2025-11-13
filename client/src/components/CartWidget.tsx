import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cartStore";

interface CartWidgetProps {
  onOpen: () => void;
  isHidden?: boolean;
}

export function CartWidget({ onOpen, isHidden = false }: CartWidgetProps) {
  const { items, getTotal } = useCartStore();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (itemCount === 0 || isHidden) return null;

  return (
    <>
      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-[9999] animate-scale-in">
        <Button
          onClick={onOpen}
          className="bg-sunset hover:bg-sunset-dark text-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_40px_rgba(255,107,53,0.35)] transition-all hover:scale-105 px-6 py-4 relative"
          data-testid="button-cart-widget"
        >
          <ShoppingCart className="w-7 h-7" />
          <span className="absolute -top-2 -right-2 bg-ocean text-white text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg" data-testid="badge-cart-count">
            {itemCount}
          </span>
        </Button>
      </div>
    </>
  );
}
