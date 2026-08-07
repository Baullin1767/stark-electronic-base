import { Fragment } from "react";
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
          {storyMeanings.map(({ key, icon: Icon }, index) => (
            <Fragment key={key}>
              <article className={index === storyMeanings.length - 1 ? "accent" : undefined}>
                <span>
                  <Icon aria-hidden="true" />
                </span>
                <div>
                  <small>0{index + 1}</small>
                  <strong {...contentProps(key)}>{text(key)}</strong>
                </div>
              </article>
              {index < storyMeanings.length - 1 && (
                <ArrowRight className="story-arrow" aria-hidden="true" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
