import { X, Plus, Minus, Trash2, ShoppingBag, Check, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCartStore } from "@/lib/cartStore";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Ingredient } from "@shared/schema";
import { useState } from "react";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditItem?: (itemId: string) => void;
}

export function CartModal({ isOpen, onClose, onEditItem }: CartModalProps) {
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  const [showCheckout, setShowCheckout] = useState(false);
  const [serviceType, setServiceType] = useState<"pickup" | "dinein">("pickup");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  // Fetch all ingredients to display names
  const { data: ingredients = [] } = useQuery<Ingredient[]>({
    queryKey: ['/api/ingredients'],
  });

  const getIngredientName = (id: string) => {
    const ing = ingredients.find(i => i.id === id);
    return ing?.nameDE || id;
  };

  const createOrderMutation = useMutation({
    mutationFn: async (data: { name: string; phone: string; pickupTime: string; tableNumber?: string; serviceType: string; total: string; comment?: string; items: any[] }) => {
      return await apiRequest('POST', '/api/orders', data);
    },
    onSuccess: () => {
      toast({
        title: "Bestellung erfolgreich!",
        description: serviceType === "pickup" 
          ? "Ihre Bestellung zur Abholung wurde aufgegeben."
          : "Ihre Bestellung für den Verzehr im Restaurant wurde aufgegeben.",
      });
      clearCart();
      setShowCheckout(false);
      setCustomerName("");
      setCustomerPhone("");
      setTableNumber("");
      setPickupTime("");
      setComment("");
      onClose();
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Bestellung konnte nicht aufgegeben werden.",
        variant: "destructive",
      });
    },
  });

  const handleCheckout = () => {
    const requiredField = serviceType === "pickup" ? pickupTime : tableNumber;
    if (!customerName || !customerPhone || !requiredField) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte füllen Sie alle erforderlichen Felder aus.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      name: customerName,
      phone: customerPhone,
      pickupTime: serviceType === "pickup" ? pickupTime : "",
      tableNumber: serviceType === "dinein" ? tableNumber : "",
      serviceType: serviceType,
      total: getTotal().toFixed(2),
      comment: comment || undefined,
      items: items.map(item => ({
        menuItemId: item.menuItemId,
        name: item.name,
        nameDE: item.nameDE,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        customization: item.customization ? JSON.stringify(item.customization) : null,
      })),
    };
    createOrderMutation.mutate(orderData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        data-testid="backdrop-cart-modal"
      />

      {/* Modal */}
      <div className="relative bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-poppins text-2xl md:text-3xl font-bold text-ocean flex items-center gap-2" data-testid="text-cart-title">
            <ShoppingBag className="w-7 h-7" />
            Ihr Warenkorb
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-full transition-colors"
            data-testid="button-close-cart"
            aria-label="Close cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12" data-testid="empty-cart">
              <ShoppingBag className="w-20 h-20 mx-auto mb-4 text-muted-foreground/30" />
              <p className="font-poppins text-xl text-muted-foreground mb-2">
                Dein Warenkorb ist leer
              </p>
              <p className="font-lato text-sm text-muted-foreground">
                Füge leckere Poke Bowls hinzu!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-card rounded-lg border border-card-border"
                  data-testid={`cart-item-${item.id}`}
                >
                  <img
                    src={item.image}
                    alt={item.nameDE}
                    className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                    data-testid={`img-cart-item-${item.id}`}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-poppins font-bold text-foreground mb-1" data-testid={`text-cart-item-name-${item.id}`}>
                      {item.nameDE}
                    </h3>
                    {item.size && (
                      <p className="font-lato text-xs text-muted-foreground mb-1" data-testid={`text-cart-item-size-${item.id}`}>
                        Größe: {item.size === "klein" ? "Klein" : "Standard"}
                      </p>
                    )}
                    
                    {/* Customization details */}
                    {item.customization && (
                      <div className="mt-2 space-y-1 text-xs">
                        {item.customization.base && (
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-muted-foreground">Base:</span>
                            <Badge variant="outline" className="text-xs h-5">{getIngredientName(item.customization.base)}</Badge>
                          </div>
                        )}
                        {item.customization.marinade && (
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-muted-foreground">Marinade:</span>
                            <Badge variant="outline" className="text-xs h-5">{getIngredientName(item.customization.marinade)}</Badge>
                          </div>
                        )}
                        {item.customization.freshIngredients && item.customization.freshIngredients.length > 0 && (
                          <div className="flex items-start gap-1">
                            <span className="font-semibold text-muted-foreground whitespace-nowrap">Zutaten:</span>
                            <div className="flex flex-wrap gap-1">
                              {item.customization.freshIngredients.map((ing, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs h-5">{getIngredientName(ing)}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {item.customization.sauce && (
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-muted-foreground">Sauce:</span>
                            <Badge variant="outline" className="text-xs h-5">{getIngredientName(item.customization.sauce)}</Badge>
                          </div>
                        )}
                        {item.customization.toppings && item.customization.toppings.length > 0 && (
                          <div className="flex items-start gap-1">
                            <span className="font-semibold text-muted-foreground whitespace-nowrap">Toppings:</span>
                            <div className="flex flex-wrap gap-1">
                              {item.customization.toppings.map((topping, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs h-5">{getIngredientName(topping)}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <p className="font-poppins text-lg font-bold text-ocean mt-2" data-testid={`text-cart-item-price-${item.id}`}>
                      €{item.price}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <div className="flex gap-1">
                      {item.customization && onEditItem && (
                        <button
                          onClick={() => onEditItem(item.id)}
                          className="p-1 hover:bg-ocean/10 text-ocean rounded transition-colors"
                          data-testid={`button-edit-${item.id}`}
                          aria-label="Edit item"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 hover:bg-destructive/10 text-destructive rounded transition-colors"
                        data-testid={`button-remove-${item.id}`}
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 hover:bg-accent rounded transition-colors"
                        data-testid={`button-decrease-${item.id}`}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold w-8 text-center" data-testid={`text-quantity-${item.id}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-accent rounded transition-colors"
                        data-testid={`button-increase-${item.id}`}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            {!showCheckout ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-poppins text-xl font-bold text-foreground">Gesamt:</span>
                  <span className="font-poppins text-2xl font-bold text-ocean" data-testid="text-cart-total">
                    €{getTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={clearCart}
                    variant="outline"
                    className="flex-1 font-poppins font-bold"
                    data-testid="button-clear-cart"
                  >
                    Warenkorb leeren
                  </Button>
                  <Button
                    onClick={() => setShowCheckout(true)}
                    className="flex-1 bg-sunset hover:bg-sunset-dark text-white font-poppins font-bold"
                    data-testid="button-checkout"
                  >
                    Zur Kasse
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-poppins text-xl font-bold text-foreground">Bestellung abschließen</span>
                  <span className="font-poppins text-2xl font-bold text-ocean" data-testid="text-checkout-total">
                    €{getTotal().toFixed(2)}
                  </span>
                </div>
                
                {/* Order Type Selection */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => setServiceType("pickup")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      serviceType === "pickup"
                        ? "border-ocean bg-ocean/10 shadow-lg"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    data-testid="button-order-type-pickup"
                  >
                    <div className="flex flex-col items-center gap-2">
                      {serviceType === "pickup" && (
                        <Check className="w-5 h-5 text-ocean" />
                      )}
                      <span className="font-poppins font-semibold text-center">
                        Zum Mitnehmen
                      </span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setServiceType("dinein")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      serviceType === "dinein"
                        ? "border-ocean bg-ocean/10 shadow-lg"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    data-testid="button-order-type-dinein"
                  >
                    <div className="flex flex-col items-center gap-2">
                      {serviceType === "dinein" && (
                        <Check className="w-5 h-5 text-ocean" />
                      )}
                      <span className="font-poppins font-semibold text-center">
                        Im Restaurant essen
                      </span>
                    </div>
                  </button>
                </div>

                {/* Customer Information Form */}
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="customer-name" className="font-poppins font-semibold">Name *</Label>
                    <Input
                      id="customer-name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ihr Name"
                      className="mt-1"
                      data-testid="input-customer-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customer-phone" className="font-poppins font-semibold">Telefonnummer *</Label>
                    <Input
                      id="customer-phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Ihre Telefonnummer"
                      className="mt-1"
                      data-testid="input-customer-phone"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="table-or-time" className="font-poppins font-semibold">
                      {serviceType === "pickup" ? "Abholzeit *" : "Tischnummer *"}
                    </Label>
                    {serviceType === "pickup" ? (
                      <Select value={pickupTime} onValueChange={setPickupTime}>
                        <SelectTrigger className="mt-1" data-testid="select-pickup-time">
                          <SelectValue placeholder="Wähle deine Abholzeit" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 48 }, (_, i) => {
                            const hour = Math.floor(i / 4) + 10;
                            const minute = (i % 4) * 15;
                            if (hour >= 22) return null;
                            const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                            return (
                              <SelectItem key={timeStr} value={timeStr}>
                                {timeStr} Uhr
                              </SelectItem>
                            );
                          }).filter(Boolean)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Select value={tableNumber} onValueChange={setTableNumber}>
                        <SelectTrigger className="mt-1" data-testid="select-table-number">
                          <SelectValue placeholder="Wähle deinen Tisch" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              Tisch {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="comment" className="font-poppins font-semibold">Kommentar (optional)</Label>
                    <Input
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Besondere Wünsche oder Anmerkungen"
                      className="mt-1"
                      data-testid="input-comment"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={() => setShowCheckout(false)}
                    variant="outline"
                    className="flex-1 font-poppins font-bold"
                    data-testid="button-back-to-cart"
                  >
                    Zurück
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    disabled={createOrderMutation.isPending}
                    className="flex-1 bg-sunset hover:bg-sunset-dark text-white font-poppins font-bold"
                    data-testid="button-confirm-order"
                  >
                    {createOrderMutation.isPending ? "Wird bearbeitet..." : "Bestellung aufgeben"}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
