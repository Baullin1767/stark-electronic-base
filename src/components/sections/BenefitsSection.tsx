import {
  Database,
  MessageCircle,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { BENEFITS } from "@/lib/constants";
import { contentProps, text } from "@/lib/content";

const icons = [MessageCircle, Database, Search, SlidersHorizontal];

export function BenefitsSection() {
  return (
    <section className="benefits section-shell">
      <div className="section-heading centered">
        <span className="section-number" {...contentProps("benefits.section")}>{text("benefits.section")}</span>
        <h2 {...contentProps("benefits.title")}>{text("benefits.title")}</h2>
        <p {...contentProps("benefits.description")}>{text("benefits.description")}</p>
      </div>
      <div className="benefits-grid">
        {BENEFITS.map((benefit, index) => {
          const Icon = icons[index];
          return (
            <article key={benefit.title}>
              <span>
                <Icon />
              </span>
              <div className="benefit-copy">
                <h3 {...contentProps(benefit.titleKey)}>{benefit.title}</h3>
                {benefit.description ? (
                  <p {...contentProps(benefit.descriptionKey)}>{benefit.description}</p>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
