import type { Order, Reservation, OrderItem } from "@shared/schema";

interface NotificationService {
  sendOrderNotification(order: Order, items: OrderItem[]): Promise<void>;
  sendReservationNotification(reservation: Reservation): Promise<void>;
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
      console.log(`\n⚠️  Telegram для ${type} не настроен.`);
      console.log("Настройте переменные окружения:");
      console.log(`  - Для ${type}: TELEGRAM_${type.toUpperCase()}_BOT_TOKEN и TELEGRAM_${type.toUpperCase()}_CHAT_ID`);
      console.log("  - Или используйте общие: TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID");
      console.log(`=== TELEGRAM УВЕДОМЛЕНИЕ ${type.toUpperCase()} (не отправлено) ===`);
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

      console.log(`✅ Telegram уведомление ${type} отправлено успешно!`);
    } catch (error) {
      console.error(`❌ Ошибка отправки Telegram уведомления ${type}:`, error);
      throw error;
    }
  }

  async sendOrderNotification(order: Order, items: OrderItem[]): Promise<void> {
    const itemsList = items
      .map((item) => `  • ${item.quantity}x ${item.nameDE} - €${item.price}`)
      .join("\n");

    const serviceTypeText = order.serviceType === "pickup" 
      ? "🥡 <b>Самовывоз</b>" 
      : "🍽 <b>В ресторане</b>";

    const additionalInfo = order.serviceType === "pickup" 
      ? `⏰ <b>Время самовывоза:</b> ${order.pickupTime}` 
      : `🪑 <b>Столик №:</b> ${order.tableNumber}`;

    const message = `
🍱 <b>НОВЫЙ ЗАКАЗ!</b>

${serviceTypeText}
👤 <b>Имя:</b> ${order.name}
📞 <b>Телефон:</b> ${order.phone}
${additionalInfo}

📝 <b>Заказ:</b>
${itemsList}

💰 <b>Сумма:</b> €${order.total}
${order.comment ? `\n💬 <b>Комментарий:</b> ${order.comment}` : ""}

📅 <b>Время заказа:</b> ${new Date(order.createdAt).toLocaleString("de-DE")}
    `.trim();

    await this.sendTelegramMessage(message, this.orderBotToken, this.orderChatId, "ORDER");
  }

  async sendReservationNotification(reservation: Reservation): Promise<void> {
    const message = `
🪑 <b>НОВОЕ БРОНИРОВАНИЕ СТОЛИКА!</b>

👤 <b>Имя:</b> ${reservation.name}
📞 <b>Телефон:</b> ${reservation.phone}
📅 <b>Дата:</b> ${reservation.date}
⏰ <b>Время:</b> ${reservation.time}
👥 <b>Количество гостей:</b> ${reservation.guests}

📅 <b>Время бронирования:</b> ${new Date().toLocaleString("de-DE")}
    `.trim();

    await this.sendTelegramMessage(message, this.reservationBotToken, this.reservationChatId, "RESERVATION");
  }
}

export const notificationService = new TelegramNotificationService();
