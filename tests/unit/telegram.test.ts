import { describe, expect, it } from "vitest";
import { buildTelegramMessage } from "@/lib/telegram";

describe("Telegram message", () => {
  it("formats user data as plain text and strips control characters", () => {
    const message = buildTelegramMessage(
      {
        firstName: "Александр\u0000",
        lastName: "",
        profession: "Подолог",
        telegram: "@example_user",
        phone: "",
        message: "<b>Без HTML</b>",
        selectedPlan: "Первичное подключение",
        consent: true,
        website: "",
        formStartedAt: 1,
      },
      new Date("2026-07-28T13:30:00.000Z"),
    );

    expect(message).toContain("Новая заявка — Stark Electronic Base");
    expect(message).toContain("<b>Без HTML</b>");
    expect(message).not.toContain("\u0000");
    expect(message).toContain("Фамилия: не указано");
  });
});
