export type DemoStepId =
  | "empty-chat"
  | "voice-recording"
  | "transcription"
  | "attachments"
  | "message-sent"
  | "processing-client"
  | "client-preview"
  | "confirmation"
  | "saving"
  | "saved"
  | "clients-table"
  | "visits-table"
  | "visit-details"
  | "search-request"
  | "search-processing"
  | "search-result";

export type DemoStep = {
  id: DemoStepId;
  eyebrow: string;
  title: string;
  description: string;
};
