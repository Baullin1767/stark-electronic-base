"use client";

export type AnalyticsEvent =
  | "demo_view"
  | "demo_complete"
  | "pricing_click"
  | "form_start"
  | "form_success"
  | "form_error"
  | "telegram_click"
  | "whatsapp_click"
  | "viber_click";

export function trackEvent(
  event: AnalyticsEvent,
  details: Record<string, string> = {},
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("stark:analytics", { detail: { event, ...details } }),
  );
}
