import type { ContactData } from "@/lib/validation/contact-schema";
import { normalizePhone } from "@/lib/validation/contact-schema";

function safeLine(value: string | undefined, fallback = "не указано") {
  const safe = value?.replace(/[\u0000-\u001F\u007F]/g, " ").trim();
  return safe || fallback;
}

export function buildTelegramMessage(
  data: ContactData,
  now = new Date(),
) {
  return [
    "Новая заявка — Stark Electronic Base",
    "",
    `Имя: ${safeLine(data.firstName)}`,
    `Фамилия: ${safeLine(data.lastName)}`,
    `Род деятельности: ${safeLine(data.profession)}`,
    `Telegram: ${safeLine(data.telegram)}`,
    `Телефон: ${data.phone ? normalizePhone(data.phone) : "не указан"}`,
    `Интересует: ${safeLine(data.selectedPlan)}`,
    "",
    "Сообщение:",
    safeLine(data.message, "без сообщения"),
    "",
    `Дата заявки: ${new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "Europe/Belgrade",
    }).format(now)}`,
  ].join("\n");
}

export async function sendTelegramMessage(data: ContactData) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("TELEGRAM_NOT_CONFIGURED");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: buildTelegramMessage(data),
          disable_web_page_preview: true,
        }),
        signal: controller.signal,
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error(`TELEGRAM_HTTP_${response.status}`);
  } finally {
    clearTimeout(timeout);
  }
}
