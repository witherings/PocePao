import type { Order, Reservation } from "@shared/schema";

interface NotificationService {
  sendOrderNotification(order: Order, items: any[]): Promise<void>;
  sendReservationNotification(reservation: Reservation): Promise<void>;
}

class EmailNotificationService implements NotificationService {
  private restaurantEmail: string;

  constructor() {
    this.restaurantEmail = process.env.RESTAURANT_EMAIL || "pokepao@example.com";
  }

  async sendOrderNotification(order: Order, items: any[]): Promise<void> {
    const itemsList = items
      .map((item) => `${item.quantity}x ${item.nameDE} - €${item.price}`)
      .join("\n");

    const message = `
🍱 НОВЫЙ ЗАКАЗ!

Тип: ${order.serviceType === "pickup" ? "Самовывоз" : "В ресторане"}
Имя: ${order.name}
Телефон: ${order.phone}
${order.serviceType === "pickup" ? `Время самовывоза: ${order.pickupTime}` : `Столик: ${order.tableNumber}`}

Заказ:
${itemsList}

Сумма: €${order.total}
${order.comment ? `\nКомментарий: ${order.comment}` : ""}

Статус: ${order.status}
Время заказа: ${new Date(order.createdAt).toLocaleString("de-DE")}
    `.trim();

    console.log("\n=== EMAIL УВЕДОМЛЕНИЕ ===");
    console.log(`To: ${this.restaurantEmail}`);
    console.log(`Subject: Новый заказ от ${order.name}`);
    console.log(message);
    console.log("=========================\n");

    // Если настроен SENDGRID_API_KEY, отправляем реальное email
    if (process.env.SENDGRID_API_KEY) {
      try {
        // Динамический импорт SendGrid только если API key существует
        const sgMail = await import("@sendgrid/mail");
        sgMail.default.setApiKey(process.env.SENDGRID_API_KEY);

        await sgMail.default.send({
          to: this.restaurantEmail,
          from: process.env.SENDGRID_FROM_EMAIL || this.restaurantEmail,
          subject: `🍱 Новый заказ от ${order.name}`,
          text: message,
          html: message.replace(/\n/g, "<br>"),
        });

        console.log("✅ Email успешно отправлен!");
      } catch (error) {
        console.error("❌ Ошибка отправки email:", error);
      }
    } else {
      console.log("ℹ️  SendGrid не настроен. Email не отправлен (только лог).");
    }
  }

  async sendReservationNotification(reservation: Reservation): Promise<void> {
    const message = `
🪑 НОВОЕ БРОНИРОВАНИЕ СТОЛИКА!

Имя: ${reservation.name}
Телефон: ${reservation.phone}
Дата: ${reservation.date}
Время: ${reservation.time}
Количество гостей: ${reservation.guests}

Время бронирования: ${new Date().toLocaleString("de-DE")}
    `.trim();

    console.log("\n=== EMAIL УВЕДОМЛЕНИЕ ===");
    console.log(`To: ${this.restaurantEmail}`);
    console.log(`Subject: Новое бронирование от ${reservation.name}`);
    console.log(message);
    console.log("=========================\n");

    // Если настроен SENDGRID_API_KEY, отправляем реальное email
    if (process.env.SENDGRID_API_KEY) {
      try {
        const sgMail = await import("@sendgrid/mail");
        sgMail.default.setApiKey(process.env.SENDGRID_API_KEY);

        await sgMail.default.send({
          to: this.restaurantEmail,
          from: process.env.SENDGRID_FROM_EMAIL || this.restaurantEmail,
          subject: `🪑 Новое бронирование от ${reservation.name}`,
          text: message,
          html: message.replace(/\n/g, "<br>"),
        });

        console.log("✅ Email успешно отправлен!");
      } catch (error) {
        console.error("❌ Ошибка отправки email:", error);
      }
    } else {
      console.log("ℹ️  SendGrid не настроен. Email не отправлен (только лог).");
    }
  }
}

export const notificationService = new EmailNotificationService();
