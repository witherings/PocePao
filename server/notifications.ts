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
    // Railway compatible mapping based on attached image
    this.orderBotToken = process.env.TELEGRAM_BOT_TOKEN || "";
    this.orderChatId = process.env.TELEGRAM_ORDER_CHAT_ID || "";
    
    this.reservationBotToken = process.env.TELEGRAM_BOT_TOKEN || "";
    this.reservationChatId = process.env.TELEGRAM_RESERVATION_CHAT_ID || "";

    console.log("🤖 Telegram Service Initialized (Railway Config):");
    console.log(`   - Bot Token: ${this.orderBotToken ? (this.orderBotToken.substring(0, 5) + "...") : "MISSING"}`);
    console.log(`   - Order Chat ID: ${this.orderChatId ? this.orderChatId : "MISSING"}`);
    console.log(`   - Reservation Chat ID: ${this.reservationChatId ? this.reservationChatId : "MISSING"}`);
  }

  private async sendTelegramMessage(message: string, botToken: string, chatId: string, type: string): Promise<void> {
    if (!botToken || !chatId) {
      console.log(`\n⚠️  Telegram für ${type} nicht konfiguriert.`);
      console.log("Bitte setzen Sie die Umgebungsvariablen:");
      console.log(`  - Для ${type}: TELEGRAM_BOT_TOKEN и TELEGRAM_${type.toUpperCase()}_CHAT_ID`);
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
        console.error(`❌ Telegram API Error (${type}):`, error);
        return;
      }

      console.log(`✅ Telegram Benachrichtigung ${type} erfolgreich gesendet!`);
    } catch (error) {
      console.error(`❌ Fehler beim Senden der Telegram Benachrichtigung ${type}:`, error);
    }
  }

  private parseCustomization(customizationJson: any): CustomBowlSelection | null {
    if (!customizationJson) return null;
    try {
      // If it's already an object, return it. If it's a string, parse it.
      if (typeof customizationJson === 'object') return customizationJson as CustomBowlSelection;
      if (typeof customizationJson === 'string') {
        return JSON.parse(customizationJson) as CustomBowlSelection;
      }
      return null;
    } catch (error) {
      console.error('❌ Error parsing customization:', error, 'Data:', customizationJson);
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
          return `${ing.nameDE || ing.name} (+€${extraPrice.toFixed(2)})`;
        }
        return `${id}`;
      });
    };

    const proteinExtras = createIngredientMap(customization.extraProtein);
    const freshExtras = createIngredientMap(customization.extraFreshIngredients);
    const sauceExtras = createIngredientMap(customization.extraSauces);
    const toppingExtras = createIngredientMap(customization.extraToppings);

    if (proteinExtras.length > 0) lines.push(`      • Extra Protein: ${proteinExtras.join(", ")}`);
    if (freshExtras.length > 0) lines.push(`      • Extra Zutaten: ${freshExtras.join(", ")}`);
    if (sauceExtras.length > 0) lines.push(`      • Extra Soßen: ${sauceExtras.join(", ")}`);
    if (toppingExtras.length > 0) lines.push(`      • Extra Toppings: ${toppingExtras.join(", ")}`);

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

    if (customization.base) lines.push(`   🥬 Basis: ${getIngredientNameDE(customization.base)}`);
    if (customization.protein) lines.push(`   🍗 Protein: ${getIngredientNameDE(customization.protein)}`);
    if (customization.marinade) lines.push(`   🧂 Marinade: ${getIngredientNameDE(customization.marinade)}`);
    if (customization.freshIngredients && customization.freshIngredients.length > 0) {
      lines.push(`   🥕 Frische Zutaten: ${mapToGermanNames(customization.freshIngredients)}`);
    }
    if (customization.sauce) lines.push(`   🌶 Soße: ${getIngredientNameDE(customization.sauce)}`);
    if (customization.toppings && customization.toppings.length > 0) {
      lines.push(`   ✨ Toppings: ${mapToGermanNames(customization.toppings)}`);
    }

    const hasExtras = 
      (customization.extraProtein && customization.extraProtein.length > 0) ||
      (customization.extraFreshIngredients && customization.extraFreshIngredients.length > 0) ||
      (customization.extraSauces && customization.extraSauces.length > 0) ||
      (customization.extraToppings && customization.extraToppings.length > 0);

    if (hasExtras) {
      lines.push(`   <b>➕ Extras:</b>`);
      const extrasLines = this.formatExtrasWithPrices(customization, ingredients);
      extrasLines.forEach(line => lines.push(line));
    }

    return lines.join("\n");
  }

  async sendOrderNotification(order: Order, items: OrderItem[]): Promise<void> {
    const itemsDetails: string[] = [];
    
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
      const quantity = item.quantity || 1;
      const itemTotal = itemPrice * quantity;

      let itemDesc = `<b>${i + 1}. ${item.nameDE || item.name}</b> (${quantity}x)`;

      if (item.size) itemDesc += `\n   📏 Größe: ${item.size === 'klein' ? 'Klein' : 'Standard'}`;
      if (item.selectedVariant) itemDesc += `\n   🏷️ Variante: ${item.selectedVariant}`;

      itemsDetails.push(itemDesc);
      
      const customization = this.parseCustomization(item.customization);
      if (customization) {
        const customDetails = this.formatCustomization(customization, item.size, allIngredients);
        if (customDetails) {
          itemsDetails.push(`   <b>📋 Zusammenstellung:</b>\n${customDetails}`);
        }
      }
      
      itemsDetails.push(`   💰 €${itemPrice.toFixed(2)} x ${quantity} = <b>€${itemTotal.toFixed(2)}</b>`);

      if (i < items.length - 1) itemsDetails.push("───────────────────");
    }

    const serviceTypeEmoji = order.serviceType === "pickup" ? "🥡" : "🍽";
    const serviceTypeText = order.serviceType === "pickup" ? "Abholung" : "Im Restaurant";
    
    let additionalInfo = "";
    if (order.serviceType === "pickup" && order.pickupTime) {
      additionalInfo = `⏰ <b>Abholzeit:</b> ${order.pickupTime}`;
    } else if (order.serviceType === "dinein" && order.tableNumber) {
      additionalInfo = `🪑 <b>Tischnummer:</b> ${order.tableNumber}`;
    }

    const createdDate = new Date(order.createdAt || Date.now());
    const dateStr = createdDate.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
    const timeStr = createdDate.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

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
💰 <b>SUMME: €${parseFloat(order.total).toFixed(2)}</b>
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
