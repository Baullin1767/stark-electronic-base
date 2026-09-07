import { ArrowDown, Check, Mic2, Sparkles } from "lucide-react";
import { contentProps, text } from "@/lib/content";

export function HeroSection() {
  return (
    <section className="hero section-shell" id="top">
      <div className="hero-copy">
        <div className="eyebrow" {...contentProps("hero.eyebrow")}>
          <span className="eyebrow-dot" />
          {text("hero.eyebrow")}
        </div>
        <h1 {...contentProps("hero.title_before")}>
          {text("hero.title_before")} <span {...contentProps("hero.title_accent")}>{text("hero.title_accent")}</span>
        </h1>
        <p className="hero-lead" {...contentProps("hero.lead")}>{text("hero.lead")}</p>
        <div className="hero-actions">
          <a className="button button-primary contact-cta" href="#contact" {...contentProps("hero.secondary_cta")}>
            {text("hero.secondary_cta")}
          </a>
          <a className="button button-secondary" href="#demo" {...contentProps("hero.primary_cta")}>
            {text("hero.primary_cta")}<ArrowDown size={18} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="hero-visual hero-product" aria-label={text("hero.visual_aria")}>
        <div className="hero-glow" />
        <div className="hero-product-card">
          <div className="window-head">
            <span className="window-avatar"><Sparkles size={20} aria-hidden="true" /></span>
            <div><strong>Stark Electronic Base</strong><small {...contentProps("hero.preview_label")}>{text("hero.preview_label")}</small></div>
          </div>
          <div className="hero-voice-preview">
            <strong><Mic2 size={18} aria-hidden="true" /><span {...contentProps("hero.preview_voice")}>{text("hero.preview_voice")}</span></strong>
            <p {...contentProps("hero.preview_note")}>{text("hero.preview_note")}</p>
          </div>
          <ArrowDown className="hero-product-arrow" size={24} aria-hidden="true" />
          <div className="hero-record-preview">
            <strong {...contentProps("hero.preview_result")}>{text("hero.preview_result")}</strong>
            <ul>{(["visit", "recommendations", "photos"] as const).map((item) => <li key={item}><Check size={17} aria-hidden="true" /><span {...contentProps(`hero.preview_${item}`)}>{text(`hero.preview_${item}`)}</span></li>)}</ul>
          </div>
          <p className="hero-product-footer" {...contentProps("hero.preview_footer")}>{text("hero.preview_footer")}</p>
        </div>
      </div>
    </section>
  );
}
