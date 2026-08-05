import { z } from "zod";
import { formatText, text } from "@/lib/content";

const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max, formatText("validation.max", { max }))
    .optional()
    .default("");

const telegramPattern = /^@[A-Za-z0-9_]{5,32}$/;
const russianPhoneCharactersPattern = /^\+?[0-9\s().-]+$/;

export function normalizePhone(value: string) {
  const trimmed = value.trim();
  if (!russianPhoneCharactersPattern.test(trimmed)) return "";

  const digits = trimmed.replace(/\D/g, "");
  let nationalNumber: string;

  if (digits.length === 10) {
    nationalNumber = digits;
  } else if (digits.length === 11 && digits.startsWith("7")) {
    nationalNumber = digits.slice(1);
  } else if (
    digits.length === 11 &&
    digits.startsWith("8") &&
    !trimmed.startsWith("+")
  ) {
    nationalNumber = digits.slice(1);
  } else {
    return "";
  }

  return /^[3489]\d{9}$/.test(nationalNumber)
    ? `+7${nationalNumber}`
    : "";
}

export const contactSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, text("validation.first_name_required"))
      .max(60, formatText("validation.max", { max: 60 })),
    lastName: optionalTrimmed(60),
    profession: optionalTrimmed(80),
    telegram: optionalTrimmed(33),
    phone: optionalTrimmed(24),
    message: optionalTrimmed(2000),
    selectedPlan: optionalTrimmed(80),
    consent: z
      .boolean()
      .refine((value) => value, { message: text("validation.consent_required") }),
    website: optionalTrimmed(120),
    formStartedAt: z.number().int().positive(),
  })
  .superRefine((data, context) => {
    if (!data.telegram && !data.phone) {
      const message = text("validation.contact_required");
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
        message: text("validation.telegram_example"),
      });
    }

    if (data.phone && !normalizePhone(data.phone)) {
      context.addIssue({
        code: "custom",
        path: ["phone"],
        message: text("validation.phone_format"),
      });
    }
  });

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
