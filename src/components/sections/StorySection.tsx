import { ArrowRight, Clock3, Lightbulb, Mic2 } from "lucide-react";
import { contentProps, text } from "@/lib/content";

export function StorySection() {
  return (
    <section className="story" id="story">
      <div className="story-inner section-shell">
        <div className="story-copy">
          <span className="section-number light" {...contentProps("story.section")}>{text("story.section")}</span>
          <h2 {...contentProps("story.title")}>{text("story.title")}</h2>
          <p {...contentProps("story.paragraph_1")}>{text("story.paragraph_1")}</p>
          <p {...contentProps("story.paragraph_2")}>{text("story.paragraph_2")}</p>
          <div className="story-quote">
            <Lightbulb size={24} />
            <p {...contentProps("story.quote")}>{text("story.quote")}</p>
          </div>
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
