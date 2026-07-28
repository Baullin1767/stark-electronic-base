import { describe, expect, it } from "vitest";
import {
  contactSchema,
  normalizePhone,
} from "@/lib/validation/contact-schema";

const validPayload = {
  firstName: "Александр",
  lastName: "Иванов",
  profession: "Подолог",
  telegram: "@example_user",
  phone: "",
  message: "Нужна база клиентов",
  selectedPlan: "Первичное подключение",
  consent: true,
  website: "",
  formStartedAt: Date.now() - 5_000,
};

describe("contactSchema", () => {
  it("accepts a valid Telegram contact", () => {
    expect(contactSchema.safeParse(validPayload).success).toBe(true);
  });

  it("accepts a phone instead of Telegram", () => {
    expect(
      contactSchema.safeParse({
        ...validPayload,
        telegram: "",
        phone: "+381 62 964 9901",
      }).success,
    ).toBe(true);
  });

  it("rejects a payload without either contact", () => {
    const result = contactSchema.safeParse({
      ...validPayload,
      telegram: "",
      phone: "",
    });
    expect(result.success).toBe(false);
  });

  it("requires consent", () => {
    expect(
      contactSchema.safeParse({ ...validPayload, consent: false }).success,
    ).toBe(false);
  });

  it("normalizes a phone while preserving the international prefix", () => {
    expect(normalizePhone("+381 (62) 964-9901")).toBe("+381629649901");
  });
});
