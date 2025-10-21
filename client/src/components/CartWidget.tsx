import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cartStore";

interface CartWidgetProps {
  onOpen: () => void;
}

export function CartWidget({ onOpen }: CartWidgetProps) {
  const { items, getTotal } = useCartStore();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-scale-in">
      <Button
        onClick={onOpen}
        size="lg"
        className="bg-sunset hover:bg-sunset-dark text-white rounded-full shadow-2xl hover:shadow-sunset/50 transition-all hover:scale-105 px-6 py-6 relative"
        data-testid="button-cart-widget"
      >
        <ShoppingCart className="w-6 h-6 mr-2" />
        <span className="font-poppins font-bold">
          {itemCount} {itemCount === 1 ? "Artikel" : "Artikel"}
        </span>
        <span className="absolute -top-2 -right-2 bg-ocean text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center" data-testid="badge-cart-count">
          {itemCount}
        </span>
      </Button>
    </div>
  );
}
