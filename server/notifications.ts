import type { Order, OrderItem, CustomBowlSelection, Ingredient } from "@shared/schema";

interface NotificationService {
  sendOrderNotification(order: Order, items: OrderItem[]): Promise<void>;
  sendReservationNotification(reservation: any): Promise<void>;
}

class TelegramNotificationService implements NotificationService {
  private orderBotToken: string;
  private orderChatId: string;
  private reservationBotToken: string;
  private reservationChatId: string;

  constructor() {
    // Orders: use specific tokens if available, otherwise fall back to shared tokens
    this.orderBotToken = process.env.TELEGRAM_ORDER_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || "";
    this.orderChatId = process.env.TELEGRAM_ORDER_CHAT_ID || process.env.TELEGRAM_CHAT_ID || "";
    
    // Reservations: use specific tokens if available, otherwise fall back to shared tokens
    this.reservationBotToken = process.env.TELEGRAM_RESERVATION_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || "";
    this.reservationChatId = process.env.TELEGRAM_RESERVATION_CHAT_ID || process.env.TELEGRAM_CHAT_ID || "";
  }

  private async sendTelegramMessage(message: string, botToken: string, chatId: string, type: string): Promise<void> {
    if (!botToken || !chatId) {
      console.log(`\n⚠️  Telegram für ${type} nicht konfiguriert.`);
      console.log("Bitte setzen Sie die Umgebungsvariablen:");
      console.log(`  - Für ${type}: TELEGRAM_${type.toUpperCase()}_BOT_TOKEN und TELEGRAM_${type.toUpperCase()}_CHAT_ID`);
      console.log("  - Oder verwenden Sie die allgemeinen: TELEGRAM_BOT_TOKEN und TELEGRAM_CHAT_ID");
      console.log(`=== TELEGRAM BENACHRICHTIGUNG ${type.toUpperCase()} (nicht gesendet) ===`);
      console.log(message);
      console.log("============================================\n");
      return;
    }

    try {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Telegram API error: ${error}`);
      }

      console.log(`✅ Telegram Benachrichtigung ${type} erfolgreich gesendet!`);
    } catch (error) {
      console.error(`❌ Fehler beim Senden der Telegram Benachrichtigung ${type}:`, error);
      throw error;
    }
  }

  private parseCustomization(customizationJson: string | null): CustomBowlSelection | null {
    if (!customizationJson) return null;
    try {
      return JSON.parse(customizationJson) as CustomBowlSelection;
    } catch {
      return null;
    }
  }

  private formatExtrasWithPrices(customization: CustomBowlSelection | null, ingredients: any[]): string[] {
    if (!customization) return [];
    
    const lines: string[] = [];
    const createIngredientMap = (ids: string[] | undefined) => {
      if (!ids || ids.length === 0) return [];
      return ids.map((id: string) => {
        const ing = ingredients.find((i: any) => i.name === id || i.id === id);
        if (ing) {
          const extraPrice = ing.extraPrice ? parseFloat(String(ing.extraPrice)) : (ing.price ? parseFloat(String(ing.price)) : 0);
          return `${ing.nameDE}: €${extraPrice.toFixed(2)}`;
        }
        return `${id}: €0.00`;
      });
    };

    const proteinExtras = createIngredientMap(customization.extraProtein);
    const freshExtras = createIngredientMap(customization.extraFreshIngredients);
    const sauceExtras = createIngredientMap(customization.extraSauces);
    const toppingExtras = createIngredientMap(customization.extraToppings);

    if (proteinExtras.length > 0) {
      lines.push(`      • Extra Protein: ${proteinExtras.join(", ")}`);
    }
    if (freshExtras.length > 0) {
      lines.push(`      • Extra Zutaten: ${freshExtras.join(", ")}`);
    }
    if (sauceExtras.length > 0) {
      lines.push(`      • Extra Soßen: ${sauceExtras.join(", ")}`);
    }
    if (toppingExtras.length > 0) {
      lines.push(`      • Extra Toppings: ${toppingExtras.join(", ")}`);
    }

    return lines;
  }

  private formatCustomization(customization: CustomBowlSelection | null, size?: string | null, ingredients: Ingredient[] = []): string {
    if (!customization) return "";

    const lines: string[] = [];
    
    const getIngredientNameDE = (id: string): string => {
      const ing = ingredients.find(i => i.name === id || i.id === id);
      return ing?.nameDE || id;
    };
    
    const mapToGermanNames = (ids: string[]): string => {
      return ids.map(id => getIngredientNameDE(id)).join(", ");
    };

    // Basis (Base)
    if (customization.base) {
      lines.push(`   🥬 Basis: ${getIngredientNameDE(customization.base)}`);
    }

    // Protein
    if (customization.protein) {
      lines.push(`   🍗 Protein: ${getIngredientNameDE(customization.protein)}`);
    }

    // Marinade
    if (customization.marinade) {
      lines.push(`   🧂 Marinade: ${getIngredientNameDE(customization.marinade)}`);
    }

    // Frische Zutaten (Fresh Ingredients)
    if (customization.freshIngredients && customization.freshIngredients.length > 0) {
      lines.push(`   🥕 Frische Zutaten: ${mapToGermanNames(customization.freshIngredients)}`);
    }

    // Soße (Sauce)
    if (customization.sauce) {
      lines.push(`   🌶 Soße: ${getIngredientNameDE(customization.sauce)}`);
    }

    // Toppings
    if (customization.toppings && customization.toppings.length > 0) {
      lines.push(`   ✨ Toppings: ${mapToGermanNames(customization.toppings)}`);
    }

    // Extras
    const hasExtras = 
      (customization.extraProtein && customization.extraProtein.length > 0) ||
      (customization.extraFreshIngredients && customization.extraFreshIngredients.length > 0) ||
      (customization.extraSauces && customization.extraSauces.length > 0) ||
      (customization.extraToppings && customization.extraToppings.length > 0);

    if (hasExtras) {
      lines.push(`   <b>➕ Extras:</b>`);
      
      if (customization.extraProtein && customization.extraProtein.length > 0) {
        lines.push(`      • Extra Protein: ${mapToGermanNames(customization.extraProtein)}`);
      }
      if (customization.extraFreshIngredients && customization.extraFreshIngredients.length > 0) {
        lines.push(`      • Extra Zutaten: ${mapToGermanNames(customization.extraFreshIngredients)}`);
      }
      if (customization.extraSauces && customization.extraSauces.length > 0) {
        lines.push(`      • Extra Soßen: ${mapToGermanNames(customization.extraSauces)}`);
      }
      if (customization.extraToppings && customization.extraToppings.length > 0) {
        lines.push(`      • Extra Toppings: ${mapToGermanNames(customization.extraToppings)}`);
      }
    }

    return lines.length > 0 ? lines.join("\n") : "";
  }

  async sendOrderNotification(order: Order, items: OrderItem[]): Promise<void> {
    // Build detailed order items list
    const itemsDetails: string[] = [];
    let calculatedTotal = 0;

    // Fetch all ingredients for price calculation (needed for extras breakdown)
    let allIngredients: Ingredient[] = [];
    try {
      const { getDb } = await import("./db");
      const { ingredients } = await import("@shared/schema");
      const db = await getDb();
      allIngredients = await db.select().from(ingredients);
    } catch (err) {
      console.warn("Could not fetch ingredients for detailed pricing:", err);
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemPrice = parseFloat(item.price || "0");
      const itemTotal = itemPrice * item.quantity;
      calculatedTotal += itemTotal;

      const quantity = item.quantity || 1;
      let itemDesc = `<b>${i + 1}. ${item.nameDE}</b> (${quantity}x)`;

      // Add size information if present
      if (item.size) {
        itemDesc += ` • <i>Größe: ${item.size}</i>`;
      }

      // Add selected variant/base if present
      if (item.selectedVariant && item.selectedVariant.trim()) {
        itemDesc += ` • <i>Variante: ${item.selectedVariant}</i>`;
      } else if (item.selectedBase && item.selectedBase.trim()) {
        // Fallback for deprecated selectedBase
        itemDesc += ` • <i>Variante: ${item.selectedBase}</i>`;
      }

      itemsDetails.push(itemDesc);

      // Add price info
      if (quantity > 1) {
        itemsDetails.push(`   💰 ${quantity}x €${itemPrice.toFixed(2)} = €${itemTotal.toFixed(2)}`);
      } else {
        itemsDetails.push(`   💰 €${itemPrice.toFixed(2)}`);
      }

      // Add customization details for Wunsch Bowl (custom bowls)
      const customization = this.parseCustomization(item.customization);
      if (customization) {
        const customDetails = this.formatCustomization(customization, item.size, allIngredients);
        if (customDetails) {
          itemsDetails.push(`   <b>📋 Zusammenstellung:</b>`);
          itemsDetails.push(customDetails);
        }
        
        // Add extras price breakdown if available
        if (allIngredients.length > 0) {
          const extrasLines = this.formatExtrasWithPrices(customization, allIngredients);
          if (extrasLines.length > 0) {
            itemsDetails.push(`   <b>➕ Extras Details:</b>`);
            itemsDetails.push(extrasLines.join("\n"));
          }
        }
      }

      // Add blank line between items for readability
      if (i < items.length - 1) {
        itemsDetails.push("");
      }
    }

    // Determine service type display
    const serviceTypeEmoji = order.serviceType === "pickup" ? "🥡" : "🍽";
    const serviceTypeText = order.serviceType === "pickup" ? "Abholung" : "Im Restaurant";
    
    // Additional info based on service type
    let additionalInfo = "";
    if (order.serviceType === "pickup" && order.pickupTime) {
      additionalInfo = `⏰ <b>Abholzeit:</b> ${order.pickupTime}`;
    } else if (order.serviceType === "dinein" && order.tableNumber) {
      additionalInfo = `🪑 <b>Tischnummer:</b> ${order.tableNumber}`;
    }

    // Format date nicely in German
    const createdDate = new Date(order.createdAt);
    const dateStr = createdDate.toLocaleDateString("de-DE", {
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const timeStr = createdDate.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Verify totals match
    const totalMatch = Math.abs(calculatedTotal - parseFloat(order.total)) < 0.01;
    const totalDisplay = order.total || calculatedTotal.toFixed(2);

    const message = `
🍱 <b>NEUE BESTELLUNG!</b>

${serviceTypeEmoji} <b>${serviceTypeText}</b>
👤 <b>Kunde:</b> ${order.name}
📞 <b>Telefon:</b> ${order.phone}
${additionalInfo}

<b>═══════════════════════════════════</b>
<b>📝 BESTELLDETAILS:</b>
<b>═══════════════════════════════════</b>

${itemsDetails.join("\n")}

<b>═══════════════════════════════════</b>
💰 <b>SUMME:</b> €${totalDisplay}
<b>═══════════════════════════════════</b>
${order.comment ? `\n💬 <b>Anmerkung:</b> ${order.comment}` : ""}

📅 <b>Bestellzeit:</b> ${dateStr} • ${timeStr}
    `.trim();

    await this.sendTelegramMessage(message, this.orderBotToken, this.orderChatId, "ORDER");
  }

  async sendReservationNotification(reservation: Record<string, any>): Promise<void> {
    const message = `
🪑 <b>NEUE TISCHRESERVIERUNG!</b>

👤 <b>Name:</b> ${reservation.name}
📞 <b>Telefon:</b> ${reservation.phone}
📅 <b>Datum:</b> ${reservation.date}
⏰ <b>Uhrzeit:</b> ${reservation.time}
👥 <b>Gäste:</b> ${reservation.guests}

📅 <b>Reservierungszeit:</b> ${new Date().toLocaleString("de-DE")}
    `.trim();

    await this.sendTelegramMessage(message, this.reservationBotToken, this.reservationChatId, "RESERVATION");
  }
}

export const notificationService = new TelegramNotificationService();
