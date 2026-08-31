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
        phone: "+7 999 999 99-99",
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

  it.each([
    ["+7 (999) 999-99-99", "+79999999999"],
    ["8 999 999 99 99", "+79999999999"],
    ["999 999-99-99", "+79999999999"],
  ])("normalizes a Russian phone %s", (phone, expected) => {
    expect(normalizePhone(phone)).toBe(expected);
  });

  it.each(["+381 62 000 0000", "+8 999 999-99-99", "12345"])(
    "rejects a non-Russian phone %s",
    (phone) => {
      expect(
        contactSchema.safeParse({
          ...validPayload,
          telegram: "",
          phone,
        }).success,
      ).toBe(false);
    },
  );

  it("rejects letters in a Russian phone", () => {
    expect(normalizePhone("+7 999 ABC-99-99")).toBe("");
  });
});
