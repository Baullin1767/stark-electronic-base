"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowUpRight,
  Check,
  Mail,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CONTACTS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { contentProps, text } from "@/lib/content";
import {
  contactSchema,
  type ContactInput,
} from "@/lib/validation/contact-schema";

type SubmitState = "idle" | "sending" | "success" | "error" | "rate-limited";

const professionOptions = Array.from(
  { length: 7 },
  (_, index) => text(`contact.profession_option_${index + 1}` as Parameters<typeof text>[0]),
);

function getTimestamp() {
  return Date.now();
}

export function ContactSection() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [hasStarted, setHasStarted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      profession: "",
      telegram: "",
      phone: "",
      message: "",
      selectedPlan: "",
      consent: false,
      website: "",
      formStartedAt: 0,
    },
  });

  useEffect(() => {
    setValue("formStartedAt", getTimestamp());
    const onPlan = (event: Event) => {
      const customEvent = event as CustomEvent<{ plan: string }>;
      setSelectedPlan(customEvent.detail.plan);
      setValue("selectedPlan", customEvent.detail.plan);
    };
    window.addEventListener("stark:plan-selected", onPlan);
    return () => window.removeEventListener("stark:plan-selected", onPlan);
  }, [setValue]);

  const markStarted = () => {
    if (!hasStarted) {
      setHasStarted(true);
      trackEvent("form_start");
    }
  };

  const submit = async (data: ContactInput) => {
    setSubmitState("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as {
        ok: boolean;
        code?: string;
      };

      if (response.ok && result.ok) {
        setSubmitState("success");
        trackEvent("form_success");
        const nextStart = getTimestamp();
        reset({
          firstName: "",
          lastName: "",
          profession: "",
          telegram: "",
          phone: "",
          message: "",
          selectedPlan: "",
          consent: false,
          website: "",
          formStartedAt: nextStart,
        });
        setSelectedPlan("");
        setHasStarted(false);
        return;
      }

      if (response.status === 429) {
        setSubmitState("rate-limited");
      } else {
        setSubmitState("error");
      }
      trackEvent("form_error", { code: result.code ?? "UNKNOWN" });
    } catch {
      setSubmitState("error");
      trackEvent("form_error", { code: "NETWORK" });
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner section-shell">
        <div className="contact-copy">
          <span className="section-number light" {...contentProps("contact.section")}>{text("contact.section")}</span>
          <h2 {...contentProps("contact.title")}>{text("contact.title")}</h2>
          <p {...contentProps("contact.description")}>{text("contact.description")}</p>
          <div className="contact-list">
            <a
              href={CONTACTS.telegramUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("telegram_click")}
            >
              <span>
                <MessageCircle />
              </span>
              <div>
                <small {...contentProps("contact.telegram_label")}>{text("contact.telegram_label")}</small>
                <strong {...contentProps("contacts.telegram")}>{CONTACTS.telegram}</strong>
              </div>
              <ArrowUpRight />
            </a>
            <div className="contact-messenger-row">
              <a
                href={CONTACTS.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("whatsapp_click")}
              >
                <span>
                  <MessageCircle />
                </span>
                <strong>WhatsApp</strong>
                <ArrowUpRight />
              </a>
              <a
                href={CONTACTS.viberUrl}
                onClick={() => trackEvent("viber_click")}
              >
                <span>
                  <Phone />
                </span>
                <strong>Viber</strong>
                <ArrowUpRight />
              </a>
            </div>
            <a href={CONTACTS.emailUrl}>
              <span>
                <Mail />
              </span>
              <div>
                <small {...contentProps("contact.email_label")}>{text("contact.email_label")}</small>
                <strong {...contentProps("contacts.email")}>{CONTACTS.email}</strong>
              </div>
              <ArrowUpRight />
            </a>
          </div>
        </div>

        <form
          className="contact-form"
          onSubmit={handleSubmit(submit)}
          onFocus={markStarted}
          noValidate
        >
          <div className="form-head">
            <div>
              <small {...contentProps("contact.consultation")}>{text("contact.consultation")}</small>
              <h3 {...contentProps("contact.form_title")}>{text("contact.form_title")}</h3>
            </div>
            <span>
              <Send />
            </span>
          </div>

          {selectedPlan && (
            <div className="selected-plan">
              <Check size={15} /> <span {...contentProps("contact.selected_plan")}>{text("contact.selected_plan")}</span> <strong>{selectedPlan}</strong>
            </div>
          )}

          <div className="form-grid">
            <label>
              <span {...contentProps("contact.field.first_name")}>{text("contact.field.first_name")}</span>
              <input
                {...register("firstName")}
                autoComplete="given-name"
                placeholder={text("contact.placeholder.first_name")}
                {...contentProps("contact.placeholder.first_name")}
                aria-invalid={Boolean(errors.firstName)}
              />
              {errors.firstName && <em>{errors.firstName.message}</em>}
            </label>
            <label>
              <span {...contentProps("contact.field.last_name")}>{text("contact.field.last_name")}</span>
              <input
                {...register("lastName")}
                autoComplete="family-name"
                placeholder={text("contact.placeholder.last_name")}
                {...contentProps("contact.placeholder.last_name")}
              />
            </label>
          </div>

          <label>
            <span {...contentProps("contact.field.profession")}>{text("contact.field.profession")}</span>
            <input
              {...register("profession")}
              list="profession-options"
              autoComplete="organization-title"
              placeholder={text("contact.placeholder.profession")}
              {...contentProps("contact.placeholder.profession")}
            />
            <datalist id="profession-options">
              {professionOptions.map((option) => (
                <option value={option} key={option} />
              ))}
            </datalist>
            <small className="field-hint" {...contentProps("contact.profession_hint")}>{text("contact.profession_hint")}</small>
          </label>

          <div className="form-grid">
            <label>
              <span {...contentProps("contact.field.telegram")}>{text("contact.field.telegram")}</span>
              <input
                {...register("telegram")}
                autoComplete="off"
                placeholder={text("contact.placeholder.telegram")}
                {...contentProps("contact.placeholder.telegram")}
                aria-invalid={Boolean(errors.telegram)}
              />
              {errors.telegram && <em>{errors.telegram.message}</em>}
            </label>
            <label>
              <span {...contentProps("contact.field.phone")}>{text("contact.field.phone")}</span>
              <input
                {...register("phone")}
                autoComplete="tel"
                inputMode="tel"
                placeholder={text("contact.placeholder.phone")}
                {...contentProps("contact.placeholder.phone")}
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone && <em>{errors.phone.message}</em>}
            </label>
          </div>

          <label>
            <span {...contentProps("contact.field.message")}>{text("contact.field.message")}</span>
            <textarea
              {...register("message")}
              rows={4}
              placeholder={text("contact.placeholder.message")}
              {...contentProps("contact.placeholder.message")}
            />
            {errors.message && <em>{errors.message.message}</em>}
          </label>

          <label className="consent">
            <input type="checkbox" {...register("consent")} />
            <span>
              <span {...contentProps("contact.consent")}>{text("contact.consent")}</span>{" "}
              <a href="/privacy" {...contentProps("contact.privacy_link")}>{text("contact.privacy_link")}</a>
            </span>
          </label>
          {errors.consent && <em className="consent-error">{errors.consent.message}</em>}

          <label className="honeypot" aria-hidden="true">
            {text("contact.honeypot")}
            <input {...register("website")} tabIndex={-1} autoComplete="off" />
          </label>
          <input type="hidden" {...register("formStartedAt", { valueAsNumber: true })} />
          <input type="hidden" {...register("selectedPlan")} />

          <button
            className="button button-primary submit-button"
            type="submit"
            disabled={submitState === "sending" || submitState === "success"}
          >
            <span
              {...contentProps(
                submitState === "sending" ? "contact.sending" : "contact.submit",
              )}
            >
              {submitState === "sending"
                ? text("contact.sending")
                : text("contact.submit")}
            </span>
            <Send size={17} />
          </button>

          <div className="form-status" aria-live="polite">
            {submitState === "success" && (
              <p className="success" {...contentProps("contact.success")}>
                <Check size={17} /> {text("contact.success")}
              </p>
            )}
            {submitState === "rate-limited" && (
              <p className="error" {...contentProps("contact.rate_limited")}>{text("contact.rate_limited")}</p>
            )}
            {submitState === "error" && (
              <p className="error" {...contentProps("contact.error")}>
                {text("contact.error").replace(/Telegram\.?$/, "")}
                <a href={CONTACTS.telegramUrl}>{text("contact.telegram_label")}</a>.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
