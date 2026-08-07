import {
  History,
  Mic2,
  Search,
  Settings2,
} from "lucide-react";
import { BENEFITS } from "@/lib/constants";
import { contentProps, text } from "@/lib/content";

const icons = [Mic2, History, Search, Settings2];

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
              <h3 {...contentProps(benefit.titleKey)}>{benefit.title}</h3>
              <p {...contentProps(benefit.descriptionKey)}>{benefit.description}</p>
            </article>
          );
        })}
      </div>
      <div className="connection-note">
        <span {...contentProps("benefits.connection_time")}>{text("benefits.connection_time")}</span>
        <p {...contentProps("benefits.connection_note")}>{text("benefits.connection_note")}</p>
      </div>
    </section>
  );
}
