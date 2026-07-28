"use client";

import { ArrowRight, Check } from "lucide-react";
import { PRICING } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

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
        <span className="section-number">05 / Стоимость</span>
        <h2>Понятная стоимость подключения и поддержки</h2>
        <p>
          Начните с готовой базы, а формат дальнейшей помощи выберите под свой
          рабочий процесс.
        </p>
      </div>
      <div className="pricing-grid">
        {PRICING.map((plan) => (
          <article
            className={`price-card ${plan.featured ? "featured" : ""}`}
            key={plan.id}
          >
            {plan.featured && <span className="popular">Быстрый старт</span>}
            <p className="plan-name">{plan.name}</p>
            <div className="price">
              <strong>{plan.price}</strong>
              <span>{plan.euro}</span>
            </div>
            <p className="plan-description">{plan.description}</p>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Check size={16} />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              className={`button ${plan.featured ? "button-primary" : "button-secondary"}`}
              href="#contact"
              onClick={() => choosePlan(plan.name)}
            >
              {plan.cta}
              <ArrowRight size={17} />
            </a>
          </article>
        ))}
      </div>
      <p className="currency-note">
        Эквивалент в евро указан ориентировочно. Оплата производится в сербских
        динарах по согласованным условиям. Значительные изменения
        функциональности оцениваются отдельно.
      </p>
    </section>
  );
}
