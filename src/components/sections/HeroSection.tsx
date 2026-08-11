import { ArrowDown, Star } from "lucide-react";
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
          <a className="button button-primary" href="#contact" {...contentProps("hero.secondary_cta")}>
            {text("hero.secondary_cta")}
          </a>
          <a className="button button-secondary" href="#demo" {...contentProps("hero.primary_cta")}>
            {text("hero.primary_cta")}<ArrowDown size={18} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="hero-visual" aria-label={text("hero.visual_aria")}>
        <div className="hero-glow" />
        <div className="floating-note note-one" {...contentProps("hero.voice_note")}>
          <Star size={17} fill="currentColor" />{text("hero.voice_note")}
        </div>
        <div className="assistant-card testimonials-card">
          <div className="testimonial-list">
            <article className="testimonial-item testimonial-featured">
              <div className="testimonial-stars" aria-hidden="true">
                {Array.from({ length: 5 }, (_, index) => <Star key={index} size={12} fill="currentColor" />)}
              </div>
              <p {...contentProps("hero.summary")}>{text("hero.summary")}</p>
              <footer>
                <span className="testimonial-avatar">А</span>
                <div><strong {...contentProps("hero.review_1_name")}>{text("hero.review_1_name")}</strong><small {...contentProps("hero.review_1_role")}>{text("hero.review_1_role")}</small></div>
              </footer>
            </article>
            <article className="testimonial-item">
              <p {...contentProps("hero.followup")}>{text("hero.followup")}</p>
              <footer>
                <span className="testimonial-avatar">М</span>
                <div><strong {...contentProps("hero.review_2_name")}>{text("hero.review_2_name")}</strong><small {...contentProps("hero.review_2_role")}>{text("hero.review_2_role")}</small></div>
              </footer>
            </article>
            <article className="testimonial-item testimonial-compact">
              <p {...contentProps("hero.review_3_text")}>{text("hero.review_3_text")}</p>
              <footer>
                <span className="testimonial-avatar">Е</span>
                <div><strong {...contentProps("hero.review_3_name")}>{text("hero.review_3_name")}</strong><small {...contentProps("hero.review_3_role")}>{text("hero.review_3_role")}</small></div>
              </footer>
            </article>
            <article className="testimonial-item testimonial-compact">
              <p {...contentProps("hero.review_4_text")}>{text("hero.review_4_text")}</p>
              <footer>
                <span className="testimonial-avatar">А</span>
                <div><strong {...contentProps("hero.review_4_name")}>{text("hero.review_4_name")}</strong><small {...contentProps("hero.review_4_role")}>{text("hero.review_4_role")}</small></div>
              </footer>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
