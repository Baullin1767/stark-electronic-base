"use client";

import {
  ArrowRight,
  Check,
  DatabaseBackup,
  Plus,
} from "lucide-react";
import { PRICING, PRICING_ADD_ONS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { contentProps, formatText, text } from "@/lib/content";

const addOnIcons = {
  "database-backup": DatabaseBackup,
} as const;

export function PricingSection() {
  const choosePlan = (name: string) => {
    window.dispatchEvent(
      new CustomEvent("stark:plan-selected", { detail: { plan: name } }),
    );
    trackEvent("pricing_click", { plan: name });
  };

  return (
    <section className="pricing section-shell" id="pricing">
      <div className="section-heading centered">
        <span className="section-number" {...contentProps("pricing.section")}>{text("pricing.section")}</span>
        <h2 {...contentProps("pricing.title")}>{text("pricing.title")}</h2>
      </div>
      <div className="pricing-grid">
        {PRICING.map((plan) => (
          <article
            className={`price-card ${plan.featured ? "featured" : ""}`}
            key={plan.id}
          >
            {plan.featured && <span className="popular" {...contentProps("pricing.popular")}>{text("pricing.popular")}</span>}
            <p className="plan-name" {...contentProps(plan.nameKey)}>{plan.name}</p>
            <div className="price">
              <strong {...contentProps(plan.priceKey)}>{plan.price}</strong>
            </div>
            {plan.description && (
              <p className="plan-description" {...contentProps(plan.descriptionKey)}>{plan.description}</p>
            )}
            <ul>
              {plan.features.map((feature) => {
                const isBonusFeature =
                  feature.key === "pricing.plan.custom.feature_5" ||
                  feature.key === "pricing.plan.custom.feature_6" ||
                  feature.key === "pricing.plan.custom.feature_7";

                return (
                  <li
                    className={isBonusFeature ? "bonus-feature" : undefined}
                    key={feature.value}
                    {...contentProps(feature.key)}
                  >
                    {isBonusFeature ? (
                      <Plus size={16} />
                    ) : (
                      <Check size={16} />
                    )}
                    {feature.value}
                  </li>
                );
              })}
            </ul>
            {plan.notes.length > 0 && (
              <div className="plan-notes">
                {plan.notes.map((note) => (
                  <p key={note.key} {...contentProps(note.key)}>
                    {note.value}
                  </p>
                ))}
              </div>
            )}
            <a
              className={`button ${plan.featured ? "button-primary" : "button-secondary"}`}
              href="#contact"
              onClick={() => choosePlan(plan.name)}
              {...contentProps(plan.ctaKey)}
            >
              {plan.cta}
              <ArrowRight size={17} />
            </a>
          </article>
        ))}
      </div>
      <div className="connection-note">
        <span {...contentProps("benefits.connection_time")}>{text("benefits.connection_time")}</span>
        <p {...contentProps("benefits.connection_note")}>{text("benefits.connection_note")}</p>
      </div>
      <div className="pricing-add-ons">
        <div className="add-ons-heading">
          <p {...contentProps("pricing.addons_title")}>{text("pricing.addons_title")}</p>
          <span {...contentProps("pricing.addons_note")}>{text("pricing.addons_note")}</span>
        </div>
        <div className="add-ons-grid">
          {PRICING_ADD_ONS.map((addOn) => {
            const Icon = addOnIcons[addOn.id];

            return (
              <article className="add-on-card" key={addOn.id}>
                <span className="add-on-icon" aria-hidden="true">
                  <Icon size={21} />
                </span>
                <div className="add-on-copy">
                  <h3 {...contentProps(addOn.nameKey)}>{addOn.name}</h3>
                  <p {...contentProps(addOn.descriptionKey)}>{addOn.description}</p>
                </div>
                <div className="add-on-action">
                  <p>
                    <strong {...contentProps(addOn.priceKey)}>{addOn.price}</strong>
                    {addOn.priceNote && addOn.priceNoteKey && <span {...contentProps(addOn.priceNoteKey)}>{addOn.priceNote}</span>}
                  </p>
                  <a
                    href="#contact"
                    aria-label={formatText("pricing.addon_aria", { name: addOn.name })}
                    onClick={() => choosePlan(addOn.name)}
                    {...contentProps("pricing.addon_cta")}
                  >
                    {text("pricing.addon_cta")}
                    <ArrowRight size={15} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <p className="currency-note" {...contentProps("pricing.currency_note")}>{text("pricing.currency_note")}</p>
    </section>
  );
}
