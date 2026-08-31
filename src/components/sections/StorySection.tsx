import {
  ArrowRight,
  BadgeDollarSign,
  Gauge,
  Lightbulb,
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
        </div>
        <div className="story-flow" aria-label="Главные принципы решения">
          {storyMeanings.slice(0, 2).map(({ key, icon: Icon }, index) => (
            index === 0 ? (
              <div className="story-step" key={key}>
                <article>
                  <span><Icon aria-hidden="true" /></span>
                  <div>
                    <small>01</small>
                    <strong {...contentProps(key)}>{text(key)}</strong>
                  </div>
                </article>
                <ArrowRight className="story-arrow" aria-hidden="true" />
              </div>
            ) : (
              <div className="story-branches" key={key}>
                <article className="accent">
                  <span><Icon aria-hidden="true" /></span>
                  <div>
                    <small>02</small>
                    <strong {...contentProps(key)}>{text(key)}</strong>
                  </div>
                </article>
                <span className="story-branch-line" aria-hidden="true" />
                <div className="story-outcomes">
                  {storyMeanings.slice(2).map(({ key: outcomeKey, icon: OutcomeIcon }) => (
                    <div className="story-outcome" key={outcomeKey}>
                      <article>
                        <span><OutcomeIcon aria-hidden="true" /></span>
                        <div>
                          <strong {...contentProps(outcomeKey)}>{text(outcomeKey)}</strong>
                        </div>
                      </article>
                      <span className="story-branch-arrow" aria-hidden="true" />
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
}
