import {
  ArrowRight,
  BadgeDollarSign,
  Clock3,
  Gauge,
  Lightbulb,
  Mic2,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { contentProps, text } from "@/lib/content";

const storyMeanings = [
  { key: "story.meaning_idea", icon: Lightbulb },
  { key: "story.meaning_tool", icon: Wrench },
  { key: "story.meaning_savings", icon: BadgeDollarSign },
  { key: "story.meaning_speed", icon: Gauge },
  { key: "story.meaning_safety", icon: ShieldCheck },
] as const;

export function StorySection() {
  return (
    <section className="story" id="story">
      <div className="story-inner section-shell">
        <div className="story-copy">
          <span className="section-number light" {...contentProps("story.section")}>{text("story.section")}</span>
          <h2 {...contentProps("story.title")}>{text("story.title")}</h2>
          <p {...contentProps("story.paragraph_1")}>{text("story.paragraph_1")}</p>
          <p {...contentProps("story.paragraph_2")}>{text("story.paragraph_2")}</p>
          <ul className="story-meanings" aria-label="Главные принципы решения">
            {storyMeanings.map(({ key, icon: Icon }, index) => (
              <li key={key} {...contentProps(key)}>
                <span className="story-meaning-number">0{index + 1}</span>
                <Icon aria-hidden="true" />
                <strong>{text(key)}</strong>
              </li>
            ))}
          </ul>
        </div>
        <div className="story-flow">
          <article>
            <span>
              <Clock3 />
            </span>
            <div>
              <small {...contentProps("story.before_label")}>{text("story.before_label")}</small>
              <strong {...contentProps("story.before_text")}>{text("story.before_text")}</strong>
            </div>
          </article>
          <ArrowRight className="story-arrow" aria-hidden="true" />
          <article className="accent">
            <span>
              <Mic2 />
            </span>
            <div>
              <small {...contentProps("story.after_label")}>{text("story.after_label")}</small>
              <strong {...contentProps("story.after_text")}>{text("story.after_text")}</strong>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
