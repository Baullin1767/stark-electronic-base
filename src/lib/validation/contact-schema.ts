import { z } from "zod";

const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Не больше ${max} символов`)
    .optional()
    .default("");

const telegramPattern = /^@[A-Za-z0-9_]{5,32}$/;
const phonePattern = /^\+?[0-9\s().-]{7,24}$/;

export const contactSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "Укажите имя")
      .max(60, "Не больше 60 символов"),
    lastName: optionalTrimmed(60),
    profession: optionalTrimmed(80),
    telegram: optionalTrimmed(33),
    phone: optionalTrimmed(24),
    message: optionalTrimmed(2000),
    selectedPlan: optionalTrimmed(80),
    consent: z
      .boolean()
      .refine((value) => value, { message: "Необходимо согласие" }),
    website: optionalTrimmed(120),
    formStartedAt: z.number().int().positive(),
  })
  .superRefine((data, context) => {
    if (!data.telegram && !data.phone) {
      const message = "Укажите Telegram или телефон";
      context.addIssue({
        code: "custom",
        path: ["telegram"],
        message,
      });
      context.addIssue({ code: "custom", path: ["phone"], message });
    }

    if (data.telegram && !telegramPattern.test(data.telegram)) {
      context.addIssue({
        code: "custom",
        path: ["telegram"],
        message: "Например, @username",
      });
    }

    if (data.phone && !phonePattern.test(data.phone)) {
      context.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Проверьте формат телефона",
      });
    }
  });

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

export function normalizePhone(value: string) {
  const trimmed = value.trim();
  const prefix = trimmed.startsWith("+") ? "+" : "";
  return `${prefix}${trimmed.replace(/\D/g, "")}`;
}
