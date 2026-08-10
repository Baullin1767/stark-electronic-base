"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowUpRight,
  Check,
  Mail,
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

const messengerIconPaths = {
  telegram:
    "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  whatsapp:
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
  viber:
    "M11.4 0C9.473.028 5.333.344 3.02 2.467 1.302 4.187.696 6.7.633 9.817.57 12.933.488 18.776 6.12 20.36h.003l-.004 2.416s-.037.977.61 1.177c.777.242 1.234-.5 1.98-1.302.407-.44.972-1.084 1.397-1.58 3.85.326 6.812-.416 7.15-.525.776-.252 5.176-.816 5.892-6.657.74-6.02-.36-9.83-2.34-11.546-.596-.55-3.006-2.3-8.375-2.323 0 0-.395-.025-1.037-.017zm.058 1.693c.545-.004.88.017.88.017 4.542.02 6.717 1.388 7.222 1.846 1.675 1.435 2.53 4.868 1.906 9.897v.002c-.604 4.878-4.174 5.184-4.832 5.395-.28.09-2.882.737-6.153.524 0 0-2.436 2.94-3.197 3.704-.12.12-.26.167-.352.144-.13-.033-.166-.188-.165-.414l.02-4.018c-4.762-1.32-4.485-6.292-4.43-8.895.054-2.604.543-4.738 1.996-6.173 1.96-1.773 5.474-2.018 7.11-2.03zm.38 2.602c-.167 0-.303.135-.304.302 0 .167.133.303.3.305 1.624.01 2.946.537 4.028 1.592 1.073 1.046 1.62 2.468 1.633 4.334.002.167.14.3.307.3.166-.002.3-.138.3-.304-.014-1.984-.618-3.596-1.816-4.764-1.19-1.16-2.692-1.753-4.447-1.765zm-3.96.695c-.19-.032-.4.005-.616.117l-.01.002c-.43.247-.816.562-1.146.932-.002.004-.006.004-.008.008-.267.323-.42.638-.46.948-.008.046-.01.093-.007.14 0 .136.022.27.065.4l.013.01c.135.48.473 1.276 1.205 2.604.42.768.903 1.5 1.446 2.186.27.344.56.673.87.984l.132.132c.31.308.64.6.984.87.686.543 1.418 1.027 2.186 1.447 1.328.733 2.126 1.07 2.604 1.206l.01.014c.13.042.265.064.402.063.046.002.092 0 .138-.008.31-.036.627-.19.948-.46.004 0 .003-.002.008-.005.37-.33.683-.72.93-1.148l.003-.01c.225-.432.15-.842-.18-1.12-.004 0-.698-.58-1.037-.83-.36-.255-.73-.492-1.113-.71-.51-.285-1.032-.106-1.248.174l-.447.564c-.23.283-.657.246-.657.246-3.12-.796-3.955-3.955-3.955-3.955s-.037-.426.248-.656l.563-.448c.277-.215.456-.737.17-1.248-.217-.383-.454-.756-.71-1.115-.25-.34-.826-1.033-.83-1.035-.137-.165-.31-.265-.502-.297zm4.49.88c-.158.002-.29.124-.3.282-.01.167.115.312.282.324 1.16.085 2.017.466 2.645 1.15.63.688.93 1.524.906 2.57-.002.168.13.306.3.31.166.003.305-.13.31-.297.025-1.175-.334-2.193-1.067-2.994-.74-.81-1.777-1.253-3.05-1.346h-.024zm.463 1.63c-.16.002-.29.127-.3.287-.008.167.12.31.288.32.523.028.875.175 1.113.422.24.245.388.62.416 1.164.01.167.15.295.318.287.167-.008.295-.15.287-.317-.03-.644-.215-1.178-.58-1.557-.367-.378-.893-.574-1.52-.607h-.018z",
} as const;

function MessengerIcon({ name }: { name: keyof typeof messengerIconPaths }) {
  return (
    <svg className="messenger-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={messengerIconPaths[name]} />
    </svg>
  );
}

const professionOptions = Array.from(
  { length: 7 },
  (_, index) => text(`contact.profession_option_${index + 1}` as Parameters<typeof text>[0]),
);

const CUSTOM_PROFESSION_VALUE = "__custom__";

function getTimestamp() {
  return Date.now();
}

export function ContactSection() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [professionSelection, setProfessionSelection] = useState("");
  const [customProfession, setCustomProfession] = useState("");
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
        setProfessionSelection("");
        setCustomProfession("");
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
        </div>

        <div className="contact-panel">
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

          <div className="profession-field">
            <label htmlFor="profession-select">
              <span {...contentProps("contact.field.profession")}>{text("contact.field.profession")}</span>
            </label>
            <input type="hidden" {...register("profession")} />
            <select
              id="profession-select"
              data-testid="profession-select"
              value={professionSelection}
              onChange={(event) => {
                const selection = event.target.value;
                setProfessionSelection(selection);
                setCustomProfession("");
                setValue(
                  "profession",
                  selection === CUSTOM_PROFESSION_VALUE ? "" : selection,
                  { shouldDirty: true, shouldValidate: true },
                );
              }}
            >
              <option value="" disabled>{text("contact.profession_hint")}</option>
              {professionOptions.map((option) => (
                <option value={option} key={option}>{option}</option>
              ))}
              <option value={CUSTOM_PROFESSION_VALUE}>{text("contact.profession_other")}</option>
            </select>
            {professionSelection === CUSTOM_PROFESSION_VALUE && (
              <input
                data-testid="custom-profession"
                value={customProfession}
                onChange={(event) => {
                  setCustomProfession(event.target.value);
                  setValue("profession", event.target.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                autoComplete="organization-title"
                aria-label={text("contact.profession_other")}
                placeholder={text("contact.placeholder.profession")}
                {...contentProps("contact.placeholder.profession")}
              />
            )}
          </div>

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

          <nav className="contact-list" aria-label="Контакты">
            <a
              href={CONTACTS.telegramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Telegram: ${CONTACTS.telegram}`}
              onClick={() => trackEvent("telegram_click")}
            >
              <span><MessengerIcon name="telegram" /></span>
              <strong>Telegram</strong>
              <ArrowUpRight />
            </a>
            <a
              href={CONTACTS.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`WhatsApp: ${CONTACTS.phone}`}
              onClick={() => trackEvent("whatsapp_click")}
            >
              <span><MessengerIcon name="whatsapp" /></span>
              <strong>WhatsApp</strong>
              <ArrowUpRight />
            </a>
            <a
              href={CONTACTS.viberUrl}
              aria-label={`Viber: ${CONTACTS.phone}`}
              onClick={() => trackEvent("viber_click")}
            >
              <span><MessengerIcon name="viber" /></span>
              <strong>Viber</strong>
              <ArrowUpRight />
            </a>
            <a className="email-contact" href={CONTACTS.emailUrl}>
              <span><Mail /></span>
              <strong {...contentProps("contacts.email")}>{CONTACTS.email}</strong>
              <ArrowUpRight />
            </a>
          </nav>
        </div>
      </div>
    </section>
  );
}
