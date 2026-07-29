import {
  ArrowDown,
  AudioLines,
  Check,
  MessageCircleMore,
  Sparkles,
} from "lucide-react";
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
          {text("hero.title_before")}{" "}
          <span {...contentProps("hero.title_accent")}>{text("hero.title_accent")}</span>
        </h1>
        <p className="hero-lead" {...contentProps("hero.lead")}>{text("hero.lead")}</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#demo" {...contentProps("hero.primary_cta")}>
            {text("hero.primary_cta")}
            <ArrowDown size={18} aria-hidden="true" />
          </a>
          <a className="button button-secondary" href="#contact" {...contentProps("hero.secondary_cta")}>
            {text("hero.secondary_cta")}
          </a>
        </div>
        <ul className="hero-trust" aria-label={text("hero.trust_aria")}>
          <li {...contentProps("hero.trust_control")}>
            <Check size={15} /> {text("hero.trust_control")}
          </li>
          <li {...contentProps("hero.trust_profession")}>
            <Check size={15} /> {text("hero.trust_profession")}
          </li>
        </ul>
      </div>

      <div className="hero-visual" aria-label={text("hero.visual_aria")}>
        <div className="hero-glow" />
        <div className="floating-note note-one" {...contentProps("hero.voice_note")}>
          <AudioLines size={17} />
          {text("hero.voice_note")}
        </div>
        <div className="assistant-card">
          <div className="assistant-card-head">
            <div className="assistant-icon">
              <MessageCircleMore size={22} />
            </div>
            <div>
              <strong {...contentProps("hero.assistant_name")}>{text("hero.assistant_name")}</strong>
              <span {...contentProps("hero.assistant_ready")}>
                <i /> {text("hero.assistant_ready")}
              </span>
            </div>
            <span className="online-label" {...contentProps("hero.online")}>{text("hero.online")}</span>
          </div>
          <div className="hero-chat-feed">
            <div className="assistant-message user-message">
              <span className="audio-play">▶</span>
              <div className="wave mini-wave" aria-hidden="true">
                {Array.from({ length: 18 }, (_, index) => (
                  <i key={index} style={{ height: `${10 + (index % 5) * 4}px` }} />
                ))}
              </div>
              <small {...contentProps("hero.audio_long")}>{text("hero.audio_long")}</small>
            </div>
            <div className="assistant-message ai-message">
              <span className="hero-gpt-label">
                <Sparkles size={13} /> <span {...contentProps("hero.gpt_label")}>{text("hero.gpt_label")}</span>
              </span>
              <p className="ai-summary" {...contentProps("hero.summary")}>{text("hero.summary")}</p>
            </div>
            <div className="assistant-message user-message secondary-message">
              <span className="audio-play">▶</span>
              <div className="wave mini-wave" aria-hidden="true">
                {Array.from({ length: 13 }, (_, index) => (
                  <i key={index} style={{ height: `${9 + (index % 4) * 4}px` }} />
                ))}
              </div>
              <small {...contentProps("hero.audio_short")}>{text("hero.audio_short")}</small>
            </div>
            <div className="assistant-message ai-message compact">
              <span className="hero-gpt-label">
                <Sparkles size={13} /> <span {...contentProps("hero.gpt_label")}>{text("hero.gpt_label")}</span>
              </span>
              <p className="ai-summary" {...contentProps("hero.followup")}>{text("hero.followup")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
