import type { ContentKey } from "@/generated/site-content";

export type DemoStepId =
  | "empty-chat"
  | "voice-recording"
  | "transcription"
  | "attachments"
  | "summary-preview"
  | "confirmation"
  | "saved"
  | "clients-table"
  | "visits-table"
  | "visit-details";

export type DemoStep = {
  id: DemoStepId;
  eyebrow: string;
  eyebrowKey: ContentKey;
  title: string;
  titleKey: ContentKey;
  description: string;
  descriptionKey: ContentKey;
};
