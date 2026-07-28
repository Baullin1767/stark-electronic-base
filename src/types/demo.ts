export type DemoStepId =
  | "empty-chat"
  | "voice-recording"
  | "transcription"
  | "attachments"
  | "message-sent"
  | "processing-client"
  | "summary-preview"
  | "confirmation"
  | "saved"
  | "clients-table"
  | "visits-table"
  | "visit-details";

export type DemoStep = {
  id: DemoStepId;
  eyebrow: string;
  title: string;
  description: string;
};
