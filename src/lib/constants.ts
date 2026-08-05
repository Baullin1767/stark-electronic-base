import { text, type ContentKey } from "@/lib/content";
import type { DemoStep } from "@/types/demo";

const telegram = text("contacts.telegram");
const phone = text("contacts.phone");
const email = text("contacts.email");
const phoneInternational = phone.replace(/\D/g, "");

export const CONTACTS = {
  telegram,
  telegramUrl: `https://t.me/${telegram.replace(/^@/, "")}`,
  phone,
  whatsappUrl: `https://wa.me/${phoneInternational}`,
  viberUrl: `viber://chat?number=${encodeURIComponent(`+${phoneInternational}`)}`,
  phoneUrl: `tel:+${phoneInternational}`,
  email,
  emailUrl: `mailto:${email}`,
} as const;

export const DEMO_CLIENT = {
  fullName: text("demo.client.full_name"),
  shortName: text("demo.client.short_name"),
  phone: text("demo.client.phone_masked"),
  phoneLastDigits: text("demo.client.phone_last_digits"),
  date: text("demo.client.date"),
  dateNumeric: text("demo.client.date_numeric"),
  issue: text("demo.client.issue"),
  procedure: text("demo.client.procedure"),
  recommendation: text("demo.client.recommendation"),
  nextVisit: text("demo.client.next_visit"),
  comment: text("demo.client.comment"),
  photos: {
    before: 1,
    after: 1,
    additional: 0,
  },
} as const;

const demoSteps = [
  "empty-chat",
  "voice-recording",
  "transcription",
  "attachments",
  "message-sent",
  "summary-preview",
  "confirmation",
  "saved",
  "clients-table",
  "visits-table",
  "visit-details",
] as const;

export const DEMO_STEPS: DemoStep[] = demoSteps.map((id) => {
  const prefix = `demo.step.${id}` as const;
  return {
    id,
    eyebrow: text(`${prefix}.eyebrow` as ContentKey),
    eyebrowKey: `${prefix}.eyebrow` as ContentKey,
    title: text(`${prefix}.title` as ContentKey),
    titleKey: `${prefix}.title` as ContentKey,
    description: text(`${prefix}.description` as ContentKey),
    descriptionKey: `${prefix}.description` as ContentKey,
  };
});

const benefitIds = [
  "voice",
  "structure",
  "review",
  "history",
  "search",
  "profession",
] as const;

export const BENEFITS = benefitIds.map((id) => ({
  title: text(`benefits.${id}.title` as ContentKey),
  titleKey: `benefits.${id}.title` as ContentKey,
  description: text(`benefits.${id}.description` as ContentKey),
  descriptionKey: `benefits.${id}.description` as ContentKey,
}));

function plan(
  id: "initial" | "custom" | "online",
  featured: boolean,
  featureCount: number,
  noteCount = 0,
) {
  const prefix = `pricing.plan.${id}` as const;
  return {
    id,
    name: text(`${prefix}.name` as ContentKey),
    nameKey: `${prefix}.name` as ContentKey,
    price: text(`${prefix}.price` as ContentKey),
    priceKey: `${prefix}.price` as ContentKey,
    description: text(`${prefix}.description` as ContentKey),
    descriptionKey: `${prefix}.description` as ContentKey,
    features: Array.from({ length: featureCount }, (_, index) => {
      const key = `${prefix}.feature_${index + 1}` as ContentKey;
      return { value: text(key), key };
    }),
    notes: Array.from({ length: noteCount }, (_, index) => {
      const key = `${prefix}.note_${index + 1}` as ContentKey;
      return { value: text(key), key };
    }),
    cta: text(`${prefix}.cta` as ContentKey),
    ctaKey: `${prefix}.cta` as ContentKey,
    featured,
  };
}

export const PRICING = [
  plan("initial", true, 5),
  plan("custom", false, 6),
  plan("online", false, 7, 1),
];

function addOn<
  T extends "database-backup" | "table-customization" | "employee-account",
>(id: T) {
  const prefix = `pricing.addon.${id}` as const;
  const priceNoteKey =
    id === "employee-account"
      ? (`${prefix}.price_note` as ContentKey)
      : undefined;
  return {
    id,
    name: text(`${prefix}.name` as ContentKey),
    nameKey: `${prefix}.name` as ContentKey,
    price: text(`${prefix}.price` as ContentKey),
    priceKey: `${prefix}.price` as ContentKey,
    priceNote: priceNoteKey ? text(priceNoteKey) : "",
    priceNoteKey,
    description: text(`${prefix}.description` as ContentKey),
    descriptionKey: `${prefix}.description` as ContentKey,
  };
}

export const PRICING_ADD_ONS = [
  addOn("database-backup"),
  addOn("employee-account"),
];
