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
import {
  contactSchema,
  type ContactInput,
} from "@/lib/validation/contact-schema";

type SubmitState = "idle" | "sending" | "success" | "error" | "rate-limited";

const professionOptions = [
  "Подолог",
  "Косметолог",
  "Массажист",
  "Мастер красоты",
  "Врач",
  "Тренер",
  "Консультант",
] as const;

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
          <span className="section-number light">06 / Связаться</span>
          <h2>Обсудим, как база может работать именно у вас</h2>
          <p>
            Оставьте контакты и коротко расскажите о своей работе. Я свяжусь с
            вами и помогу подобрать подходящий формат.
          </p>
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
                <small>Telegram</small>
                <strong>{CONTACTS.telegram}</strong>
              </div>
              <ArrowUpRight />
            </a>
            <a href={CONTACTS.phoneUrl}>
              <span>
                <Phone />
              </span>
              <div>
                <small>Телефон</small>
                <strong>{CONTACTS.phone}</strong>
              </div>
              <ArrowUpRight />
            </a>
            <a href={CONTACTS.emailUrl}>
              <span>
                <Mail />
              </span>
              <div>
                <small>Email</small>
                <strong>{CONTACTS.email}</strong>
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
              <small>Бесплатная консультация</small>
              <h3>Оставить заявку</h3>
            </div>
            <span>
              <Send />
            </span>
          </div>

          {selectedPlan && (
            <div className="selected-plan">
              <Check size={15} /> Вы выбрали: <strong>{selectedPlan}</strong>
            </div>
          )}

          <div className="form-grid">
            <label>
              <span>Имя *</span>
              <input
                {...register("firstName")}
                autoComplete="given-name"
                placeholder="Александр"
                aria-invalid={Boolean(errors.firstName)}
              />
              {errors.firstName && <em>{errors.firstName.message}</em>}
            </label>
            <label>
              <span>Фамилия</span>
              <input
                {...register("lastName")}
                autoComplete="family-name"
                placeholder="Иванов"
              />
            </label>
          </div>

          <label>
            <span>Род деятельности</span>
            <input
              {...register("profession")}
              list="profession-options"
              autoComplete="organization-title"
              placeholder="Начните вводить профессию"
            />
            <datalist id="profession-options">
              {professionOptions.map((option) => (
                <option value={option} key={option} />
              ))}
            </datalist>
            <small className="field-hint">
              Выберите подсказку или укажите свой вариант
            </small>
          </label>

          <div className="form-grid">
            <label>
              <span>Telegram</span>
              <input
                {...register("telegram")}
                autoComplete="off"
                placeholder="@username"
                aria-invalid={Boolean(errors.telegram)}
              />
              {errors.telegram && <em>{errors.telegram.message}</em>}
            </label>
            <label>
              <span>Телефон</span>
              <input
                {...register("phone")}
                autoComplete="tel"
                inputMode="tel"
                placeholder="+381 62 000 0000"
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone && <em>{errors.phone.message}</em>}
            </label>
          </div>

          <label>
            <span>О вашей задаче</span>
            <textarea
              {...register("message")}
              rows={4}
              placeholder="Как вы сейчас ведёте клиентскую базу и какие данные хотите сохранять?"
            />
            {errors.message && <em>{errors.message.message}</em>}
          </label>

          <label className="consent">
            <input type="checkbox" {...register("consent")} />
            <span>
              Я согласен на обработку контактных данных для связи по заявке.{" "}
              <a href="/privacy">Политика конфиденциальности</a>
            </span>
          </label>
          {errors.consent && <em className="consent-error">{errors.consent.message}</em>}

          <label className="honeypot" aria-hidden="true">
            Ваш сайт
            <input {...register("website")} tabIndex={-1} autoComplete="off" />
          </label>
          <input type="hidden" {...register("formStartedAt", { valueAsNumber: true })} />
          <input type="hidden" {...register("selectedPlan")} />

          <button
            className="button button-primary submit-button"
            type="submit"
            disabled={submitState === "sending" || submitState === "success"}
          >
            {submitState === "sending" ? "Отправляем…" : "Отправить заявку"}
            <Send size={17} />
          </button>

          <div className="form-status" aria-live="polite">
            {submitState === "success" && (
              <p className="success">
                <Check size={17} /> Заявка отправлена. Я свяжусь с вами по
                указанному контакту.
              </p>
            )}
            {submitState === "rate-limited" && (
              <p className="error">
                Вы уже отправляли заявку. Попробуйте ещё раз немного позже.
              </p>
            )}
            {submitState === "error" && (
              <p className="error">
                Не удалось отправить заявку. Напишите напрямую в{" "}
                <a href={CONTACTS.telegramUrl}>Telegram</a>.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
